-- FoodBridge v1: triggers and atomic RPC functions

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists ngo_profiles_updated_at on public.ngo_profiles;
create trigger ngo_profiles_updated_at
  before update on public.ngo_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists donations_updated_at on public.donations;
create trigger donations_updated_at
  before update on public.donations
  for each row execute function public.set_updated_at();

drop trigger if exists claims_updated_at on public.claims;
create trigger claims_updated_at
  before update on public.claims
  for each row execute function public.set_updated_at();

drop trigger if exists pickups_updated_at on public.pickups;
create trigger pickups_updated_at
  before update on public.pickups
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role_val text;
  user_full_name text;
  needs_onboarding boolean;
  org_name text;
begin
  user_role_val := new.raw_user_meta_data->>'role';
  user_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );
  org_name := new.raw_user_meta_data->>'organization_name';
  needs_onboarding := user_role_val is null or user_role_val = '';

  insert into public.profiles (id, email, full_name, role, organization_name, onboarding_completed)
  values (
    new.id,
    new.email,
    user_full_name,
    coalesce(nullif(user_role_val, '')::user_role, 'donor'::user_role),
    org_name,
    not needs_onboarding
  );

  if coalesce(nullif(user_role_val, ''), 'donor') = 'ngo' and org_name is not null and org_name <> '' then
    insert into public.ngo_profiles (profile_id, organization_name)
    values (new.id, org_name)
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.log_donation_event(
  p_donation_id uuid,
  p_actor_id uuid,
  p_event_type text,
  p_old_status donation_status,
  p_new_status donation_status,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.donation_events (
    donation_id, actor_id, event_type, old_status, new_status, metadata
  )
  values (
    p_donation_id, p_actor_id, p_event_type, p_old_status, p_new_status, p_metadata
  );
end;
$$;

create or replace function public.create_donation(
  p_title text,
  p_description text,
  p_food_type text,
  p_quantity numeric,
  p_unit text,
  p_formatted_address text,
  p_lat double precision,
  p_lng double precision,
  p_expires_at timestamptz,
  p_photo_url text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_location_id uuid;
  v_donation_id uuid;
  v_unit food_unit;
begin
  if v_user_id is null then
    return jsonb_build_object('success', false, 'error_code', 'not_authenticated');
  end if;

  if not exists (
    select 1 from public.profiles where id = v_user_id and role = 'donor' and is_active
  ) then
    return jsonb_build_object('success', false, 'error_code', 'not_donor');
  end if;

  begin
    v_unit := p_unit::food_unit;
  exception when others then
    return jsonb_build_object('success', false, 'error_code', 'invalid_unit');
  end;

  insert into public.locations (point, formatted_address)
  values (
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
    p_formatted_address
  )
  returning id into v_location_id;

  insert into public.donations (
    donor_id, pickup_location_id, title, description, food_type,
    quantity, unit, photo_url, expires_at, status
  )
  values (
    v_user_id, v_location_id, p_title, p_description, p_food_type,
    p_quantity, v_unit, p_photo_url, p_expires_at, 'available'
  )
  returning id into v_donation_id;

  perform public.log_donation_event(
    v_donation_id, v_user_id, 'created', null, 'available',
    jsonb_build_object('pickup_address', p_formatted_address)
  );

  return jsonb_build_object('success', true, 'donation_id', v_donation_id);
end;
$$;

create or replace function public.claim_donation(
  p_donation_id uuid,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_donation public.donations%rowtype;
  v_claim_id uuid;
  v_pickup_id uuid;
  v_within_radius boolean := true;
begin
  if v_user_id is null then
    return jsonb_build_object('success', false, 'error_code', 'not_authenticated');
  end if;

  if not exists (
    select 1 from public.profiles where id = v_user_id and role = 'ngo' and is_active
  ) then
    return jsonb_build_object('success', false, 'error_code', 'not_ngo');
  end if;

  select * into v_donation
  from public.donations
  where id = p_donation_id
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error_code', 'donation_not_found');
  end if;

  if v_donation.status <> 'available' then
    return jsonb_build_object('success', false, 'error_code', 'donation_unavailable');
  end if;

  if v_donation.expires_at <= now() then
    return jsonb_build_object('success', false, 'error_code', 'donation_expired');
  end if;

  if exists (
    select 1 from public.claims
    where donation_id = p_donation_id
      and status in ('pending', 'approved', 'fulfilled')
  ) then
    return jsonb_build_object('success', false, 'error_code', 'already_claimed');
  end if;

  select exists (
    select 1
    from public.ngo_profiles np
    join public.locations nl on nl.id = np.service_location_id
    join public.locations dl on dl.id = v_donation.pickup_location_id
    where np.profile_id = v_user_id
      and ST_DWithin(dl.point, nl.point, np.service_radius_km * 1000)
  ) into v_within_radius;

  if exists (
    select 1 from public.ngo_profiles
    where profile_id = v_user_id and service_location_id is not null
  ) and not v_within_radius then
    return jsonb_build_object('success', false, 'error_code', 'outside_service_radius');
  end if;

  insert into public.claims (donation_id, ngo_id, notes, status)
  values (p_donation_id, v_user_id, p_notes, 'approved')
  returning id into v_claim_id;

  update public.donations
  set status = 'claimed', claimed_at = now()
  where id = p_donation_id;

  insert into public.pickups (donation_id, claim_id, status)
  values (p_donation_id, v_claim_id, 'open')
  returning id into v_pickup_id;

  perform public.log_donation_event(
    p_donation_id, v_user_id, 'claimed', 'available', 'claimed',
    jsonb_build_object('claim_id', v_claim_id, 'pickup_id', v_pickup_id)
  );

  return jsonb_build_object(
    'success', true,
    'claim_id', v_claim_id,
    'pickup_id', v_pickup_id
  );
end;
$$;

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

  update public.donations
  set status = 'in_transit'
  where id = v_pickup.donation_id;

  perform public.log_donation_event(
    v_pickup.donation_id, v_user_id, 'pickup_assigned', 'claimed', 'in_transit',
    jsonb_build_object('pickup_id', p_pickup_id)
  );

  return jsonb_build_object('success', true, 'pickup_id', p_pickup_id);
end;
$$;

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

  if v_pickup.status not in ('assigned', 'in_transit') then
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

create or replace function public.cancel_donation(
  p_donation_id uuid,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_donation public.donations%rowtype;
begin
  if v_user_id is null then
    return jsonb_build_object('success', false, 'error_code', 'not_authenticated');
  end if;

  select * into v_donation
  from public.donations
  where id = p_donation_id and donor_id = v_user_id
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error_code', 'donation_not_found');
  end if;

  if v_donation.status not in ('available', 'claimed') then
    return jsonb_build_object('success', false, 'error_code', 'cannot_cancel');
  end if;

  update public.donations
  set status = 'cancelled'
  where id = p_donation_id;

  perform public.log_donation_event(
    p_donation_id, v_user_id, 'cancelled', v_donation.status, 'cancelled',
    jsonb_build_object('reason', p_reason)
  );

  return jsonb_build_object('success', true, 'donation_id', p_donation_id);
end;
$$;

create or replace function public.expire_stale_donations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  r record;
begin
  for r in
    select id from public.donations
    where status = 'available' and expires_at < now()
    for update
  loop
    update public.donations set status = 'expired' where id = r.id;
    perform public.log_donation_event(r.id, null, 'expired', 'available', 'expired', '{}'::jsonb);
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public.nearby_available_donations(
  p_lat double precision,
  p_lng double precision,
  p_radius_km numeric default 25
)
returns table (
  id uuid,
  donor_id uuid,
  title text,
  food_type text,
  quantity numeric,
  unit food_unit,
  status donation_status,
  expires_at timestamptz,
  pickup_address text,
  distance_meters double precision
)
language sql
stable
security definer
set search_path = public
as $$
  select
    d.id,
    d.donor_id,
    d.title,
    d.food_type,
    d.quantity,
    d.unit,
    d.status,
    d.expires_at,
    l.formatted_address as pickup_address,
    ST_Distance(
      l.point,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
    ) as distance_meters
  from public.donations d
  join public.locations l on l.id = d.pickup_location_id
  where d.status = 'available'
    and d.expires_at > now()
    and ST_DWithin(
      l.point,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_radius_km * 1000
    )
  order by distance_meters asc, d.expires_at asc;
$$;

grant execute on function public.create_donation to authenticated;
grant execute on function public.claim_donation to authenticated;
grant execute on function public.accept_pickup to authenticated;
grant execute on function public.complete_pickup to authenticated;
grant execute on function public.cancel_donation to authenticated;
grant execute on function public.nearby_available_donations to authenticated;
grant execute on function public.expire_stale_donations to service_role;