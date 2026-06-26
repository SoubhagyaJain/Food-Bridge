-- FoodBridge: volunteer portal — profiles, 3-step pickup workflow, geo queries

-- 1. Volunteer profiles
create table if not exists public.volunteer_profiles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  home_location_id uuid references public.locations (id) on delete set null,
  service_radius_km numeric not null default 25 check (service_radius_km > 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists volunteer_profiles_updated_at on public.volunteer_profiles;
create trigger volunteer_profiles_updated_at
  before update on public.volunteer_profiles
  for each row execute function public.set_updated_at();

insert into public.volunteer_profiles (profile_id)
select id from public.profiles where role = 'volunteer'
on conflict (profile_id) do nothing;

-- 2. Pickup timestamps
alter table public.pickups
  add column if not exists picked_up_at timestamptz;

-- 3. Fix accept_pickup — keep donation at claimed until picked up
create or replace function public.accept_pickup(p_pickup_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_pickup public.pickups%rowtype;
begin
  if v_user_id is null then
    return jsonb_build_object('success', false, 'error_code', 'not_authenticated');
  end if;

  if not exists (
    select 1 from public.profiles where id = v_user_id and role = 'volunteer' and is_active
  ) then
    return jsonb_build_object('success', false, 'error_code', 'not_volunteer');
  end if;

  select * into v_pickup
  from public.pickups
  where id = p_pickup_id
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error_code', 'pickup_not_found');
  end if;

  if v_pickup.status <> 'open' then
    return jsonb_build_object('success', false, 'error_code', 'pickup_unavailable');
  end if;

  update public.pickups
  set volunteer_id = v_user_id, status = 'assigned', assigned_at = now()
  where id = p_pickup_id;

  perform public.log_donation_event(
    v_pickup.donation_id, v_user_id, 'pickup_assigned', 'claimed', 'claimed',
    jsonb_build_object('pickup_id', p_pickup_id)
  );

  return jsonb_build_object('success', true, 'pickup_id', p_pickup_id);
end;
$$;

-- 4. Mark picked up — assigned → in_transit
create or replace function public.mark_picked_up(p_pickup_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_pickup public.pickups%rowtype;
begin
  if v_user_id is null then
    return jsonb_build_object('success', false, 'error_code', 'not_authenticated');
  end if;

  if not exists (
    select 1 from public.profiles where id = v_user_id and role = 'volunteer' and is_active
  ) then
    return jsonb_build_object('success', false, 'error_code', 'not_volunteer');
  end if;

  select * into v_pickup
  from public.pickups
  where id = p_pickup_id
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error_code', 'pickup_not_found');
  end if;

  if v_pickup.volunteer_id is distinct from v_user_id then
    return jsonb_build_object('success', false, 'error_code', 'not_assigned');
  end if;

  if v_pickup.status <> 'assigned' then
    return jsonb_build_object('success', false, 'error_code', 'invalid_pickup_status');
  end if;

  update public.pickups
  set status = 'in_transit', picked_up_at = now()
  where id = p_pickup_id;

  update public.donations
  set status = 'in_transit'
  where id = v_pickup.donation_id;

  perform public.log_donation_event(
    v_pickup.donation_id, v_user_id, 'picked_up', 'claimed', 'in_transit',
    jsonb_build_object('pickup_id', p_pickup_id)
  );

  return jsonb_build_object('success', true, 'pickup_id', p_pickup_id);
end;
$$;

-- 5. Complete pickup — only from in_transit
create or replace function public.complete_pickup(p_pickup_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_pickup public.pickups%rowtype;
begin
  if v_user_id is null then
    return jsonb_build_object('success', false, 'error_code', 'not_authenticated');
  end if;

  select * into v_pickup
  from public.pickups
  where id = p_pickup_id
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error_code', 'pickup_not_found');
  end if;

  if v_pickup.volunteer_id is distinct from v_user_id then
    return jsonb_build_object('success', false, 'error_code', 'not_assigned');
  end if;

  if v_pickup.status <> 'in_transit' then
    return jsonb_build_object('success', false, 'error_code', 'invalid_pickup_status');
  end if;

  update public.pickups
  set status = 'delivered', delivered_at = now()
  where id = p_pickup_id;

  update public.donations
  set status = 'delivered', delivered_at = now()
  where id = v_pickup.donation_id;

  update public.claims
  set status = 'fulfilled'
  where id = v_pickup.claim_id;

  perform public.log_donation_event(
    v_pickup.donation_id, v_user_id, 'delivered', 'in_transit', 'delivered',
    jsonb_build_object('pickup_id', p_pickup_id)
  );

  return jsonb_build_object('success', true, 'pickup_id', p_pickup_id);
end;
$$;

-- 6. Nearby open pickups for volunteers
create or replace function public.nearby_open_pickups(
  p_lat double precision,
  p_lng double precision,
  p_radius_km numeric default 25
)
returns table (
  pickup_id uuid,
  donation_id uuid,
  title text,
  food_type text,
  quantity numeric,
  unit food_unit,
  pickup_address text,
  pickup_lat double precision,
  pickup_lng double precision,
  expires_at timestamptz,
  distance_meters double precision
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id as pickup_id,
    d.id as donation_id,
    d.title,
    d.food_type,
    d.quantity,
    d.unit,
    l.formatted_address as pickup_address,
    ST_Y(l.point::geometry) as pickup_lat,
    ST_X(l.point::geometry) as pickup_lng,
    d.expires_at,
    ST_Distance(
      l.point,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
    ) as distance_meters
  from public.pickups p
  join public.donations d on d.id = p.donation_id
  join public.locations l on l.id = d.pickup_location_id
  where p.status = 'open'
    and d.expires_at > now()
    and ST_DWithin(
      l.point,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_radius_km * 1000
    )
  order by distance_meters asc, d.expires_at asc;
$$;

-- 7. Rich pickup view
create or replace view public.pickups_with_details as
select
  p.id as pickup_id,
  p.donation_id,
  p.claim_id,
  p.volunteer_id,
  p.status as pickup_status,
  p.assigned_at,
  p.picked_up_at,
  p.delivered_at,
  p.created_at as pickup_created_at,
  d.title,
  d.description,
  d.food_type,
  d.quantity,
  d.unit,
  d.photo_url,
  d.status as donation_status,
  d.expires_at,
  d.pickup_address,
  d.pickup_lat,
  d.pickup_lng,
  c.ngo_id,
  coalesce(np.organization_name, ngo_p.organization_name) as ngo_organization_name,
  ngo_p.full_name as ngo_contact_name,
  ngo_p.phone as ngo_phone,
  ngo_p.email as ngo_email
from public.pickups p
join public.donations_with_address d on d.id = p.donation_id
join public.claims c on c.id = p.claim_id
join public.profiles ngo_p on ngo_p.id = c.ngo_id
left join public.ngo_profiles np on np.profile_id = c.ngo_id;

-- 8. RLS for volunteer_profiles
alter table public.volunteer_profiles enable row level security;

drop policy if exists "Volunteers can view own volunteer profile" on public.volunteer_profiles;
create policy "Volunteers can view own volunteer profile"
  on public.volunteer_profiles for select
  using (profile_id = auth.uid());

drop policy if exists "Volunteers can insert own volunteer profile" on public.volunteer_profiles;
create policy "Volunteers can insert own volunteer profile"
  on public.volunteer_profiles for insert
  with check (
    profile_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'volunteer')
  );

drop policy if exists "Volunteers can update own volunteer profile" on public.volunteer_profiles;
create policy "Volunteers can update own volunteer profile"
  on public.volunteer_profiles for update
  using (profile_id = auth.uid());

-- Allow volunteers to read their home location
drop policy if exists "Volunteers can view own home locations" on public.locations;
create policy "Volunteers can view own home locations"
  on public.locations for select
  to authenticated
  using (
    exists (
      select 1 from public.volunteer_profiles vp
      where vp.home_location_id = locations.id and vp.profile_id = auth.uid()
    )
  );

create or replace function public.create_location(
  p_formatted_address text,
  p_lat double precision,
  p_lng double precision
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_location_id uuid;
begin
  insert into public.locations (point, formatted_address)
  values (
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
    p_formatted_address
  )
  returning id into v_location_id;

  return v_location_id;
end;
$$;

create or replace view public.locations_with_coords as
select
  id,
  formatted_address,
  ST_Y(point::geometry) as lat,
  ST_X(point::geometry) as lng
from public.locations;

grant execute on function public.mark_picked_up to authenticated;
grant execute on function public.nearby_open_pickups to authenticated;
grant execute on function public.create_location to authenticated;