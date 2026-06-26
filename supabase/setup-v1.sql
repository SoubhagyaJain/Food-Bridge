-- FoodBridge v1: extensions and enum types
-- Run first in Supabase SQL Editor

create extension if not exists postgis;

do $$ begin
  create type user_role as enum ('donor', 'ngo', 'volunteer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type donation_status as enum (
    'available', 'claimed', 'in_transit', 'delivered', 'expired', 'cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type claim_status as enum ('pending', 'approved', 'rejected', 'fulfilled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type pickup_status as enum ('open', 'assigned', 'in_transit', 'delivered', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type food_unit as enum ('kg', 'lbs', 'meals', 'boxes', 'liters', 'items');
exception when duplicate_object then null;
end $$;
-- FoodBridge v1: core tables

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  point geography(point, 4326) not null,
  formatted_address text not null,
  city text,
  postal_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role user_role not null,
  phone text,
  avatar_url text,
  organization_name text,
  onboarding_completed boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ngo_profiles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  organization_name text not null,
  registration_number text,
  service_location_id uuid references public.locations (id) on delete set null,
  service_radius_km numeric not null default 25 check (service_radius_km > 0),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.profiles (id) on delete cascade,
  pickup_location_id uuid not null references public.locations (id) on delete restrict,
  title text not null,
  description text,
  food_type text not null,
  quantity numeric not null check (quantity > 0),
  unit food_unit not null,
  photo_url text,
  status donation_status not null default 'available',
  expires_at timestamptz not null,
  claimed_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations (id) on delete cascade,
  ngo_id uuid not null references public.profiles (id) on delete cascade,
  status claim_status not null default 'approved',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pickups (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null unique references public.donations (id) on delete cascade,
  claim_id uuid not null references public.claims (id) on delete cascade,
  volunteer_id uuid references public.profiles (id) on delete set null,
  status pickup_status not null default 'open',
  assigned_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- FoodBridge v1: audit log and notifications

create table if not exists public.donation_events (
  id bigserial primary key,
  donation_id uuid not null references public.donations (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  event_type text not null,
  old_status donation_status,
  new_status donation_status,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
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
-- FoodBridge v1: Row Level Security policies

alter table public.locations enable row level security;
alter table public.profiles enable row level security;
alter table public.ngo_profiles enable row level security;
alter table public.donations enable row level security;
alter table public.claims enable row level security;
alter table public.pickups enable row level security;
alter table public.donation_events enable row level security;
alter table public.notifications enable row level security;

-- profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Authenticated users can view active profile basics" on public.profiles;
create policy "Authenticated users can view active profile basics"
  on public.profiles for select
  using (is_active = true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ngo_profiles
drop policy if exists "NGO can view own profile" on public.ngo_profiles;
create policy "NGO can view own profile"
  on public.ngo_profiles for select
  using (profile_id = auth.uid());

drop policy if exists "Verified NGOs are public" on public.ngo_profiles;
create policy "Verified NGOs are public"
  on public.ngo_profiles for select
  using (verified = true);

drop policy if exists "NGO can insert own profile" on public.ngo_profiles;
create policy "NGO can insert own profile"
  on public.ngo_profiles for insert
  with check (
    profile_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'ngo')
  );

drop policy if exists "NGO can update own profile" on public.ngo_profiles;
create policy "NGO can update own profile"
  on public.ngo_profiles for update
  using (profile_id = auth.uid());

-- locations (readable when linked to visible donations or own NGO profile)
drop policy if exists "Authenticated users can view linked locations" on public.locations;
create policy "Authenticated users can view linked locations"
  on public.locations for select
  to authenticated
  using (
    exists (select 1 from public.donations d where d.pickup_location_id = locations.id)
    or exists (select 1 from public.ngo_profiles np where np.service_location_id = locations.id)
  );

drop policy if exists "Authenticated users can insert locations" on public.locations;
create policy "Authenticated users can insert locations"
  on public.locations for insert
  to authenticated
  with check (true);

-- donations
drop policy if exists "Donors can view own donations" on public.donations;
create policy "Donors can view own donations"
  on public.donations for select
  using (donor_id = auth.uid());

drop policy if exists "NGOs can view available donations in radius" on public.donations;
create policy "NGOs can view available donations in radius"
  on public.donations for select
  using (
    status = 'available'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'ngo')
    and (
      not exists (
        select 1 from public.ngo_profiles np
        where np.profile_id = auth.uid() and np.service_location_id is not null
      )
      or exists (
        select 1
        from public.ngo_profiles np
        join public.locations nl on nl.id = np.service_location_id
        join public.locations dl on dl.id = donations.pickup_location_id
        where np.profile_id = auth.uid()
          and ST_DWithin(dl.point, nl.point, np.service_radius_km * 1000)
      )
    )
  );

drop policy if exists "NGOs can view claimed donations" on public.donations;
create policy "NGOs can view claimed donations"
  on public.donations for select
  using (
    exists (
      select 1 from public.claims c
      where c.donation_id = donations.id and c.ngo_id = auth.uid()
    )
  );

drop policy if exists "Volunteers can view assigned donations" on public.donations;
create policy "Volunteers can view assigned donations"
  on public.donations for select
  using (
    exists (
      select 1 from public.pickups p
      where p.donation_id = donations.id and p.volunteer_id = auth.uid()
    )
  );

drop policy if exists "Donors can update own available donations" on public.donations;
create policy "Donors can update own available donations"
  on public.donations for update
  using (donor_id = auth.uid() and status in ('available', 'claimed'));

-- claims
drop policy if exists "NGOs can view own claims" on public.claims;
create policy "NGOs can view own claims"
  on public.claims for select
  using (ngo_id = auth.uid());

drop policy if exists "Donors can view claims on own donations" on public.claims;
create policy "Donors can view claims on own donations"
  on public.claims for select
  using (
    exists (
      select 1 from public.donations d
      where d.id = claims.donation_id and d.donor_id = auth.uid()
    )
  );

-- pickups
drop policy if exists "Volunteers can view open pickups" on public.pickups;
create policy "Volunteers can view open pickups"
  on public.pickups for select
  using (
    status = 'open'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'volunteer')
  );

drop policy if exists "Volunteers can view assigned pickups" on public.pickups;
create policy "Volunteers can view assigned pickups"
  on public.pickups for select
  using (volunteer_id = auth.uid());

drop policy if exists "NGOs can view related pickups" on public.pickups;
create policy "NGOs can view related pickups"
  on public.pickups for select
  using (
    exists (
      select 1 from public.claims c
      where c.id = pickups.claim_id and c.ngo_id = auth.uid()
    )
  );

drop policy if exists "Donors can view pickups on own donations" on public.pickups;
create policy "Donors can view pickups on own donations"
  on public.pickups for select
  using (
    exists (
      select 1 from public.donations d
      where d.id = pickups.donation_id and d.donor_id = auth.uid()
    )
  );

-- donation_events
drop policy if exists "Involved users can view donation events" on public.donation_events;
create policy "Involved users can view donation events"
  on public.donation_events for select
  using (
    exists (select 1 from public.donations d where d.id = donation_events.donation_id and d.donor_id = auth.uid())
    or exists (
      select 1 from public.claims c
      where c.donation_id = donation_events.donation_id and c.ngo_id = auth.uid()
    )
    or exists (
      select 1 from public.pickups p
      where p.donation_id = donation_events.donation_id and p.volunteer_id = auth.uid()
    )
  );

-- notifications
drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
  on public.notifications for update
  using (user_id = auth.uid());
-- FoodBridge v1: storage bucket for donation photos

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'donation-photos',
  'donation-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "Donors can upload donation photos" on storage.objects;
create policy "Donors can upload donation photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'donation-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Donors can update own donation photos" on storage.objects;
create policy "Donors can update own donation photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'donation-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Donors can delete own donation photos" on storage.objects;
create policy "Donors can delete own donation photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'donation-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Public can view donation photos" on storage.objects;
create policy "Public can view donation photos"
  on storage.objects for select
  to public
  using (bucket_id = 'donation-photos');
-- FoodBridge v1: views and indexes

create or replace view public.donations_with_address as
select
  d.id,
  d.donor_id,
  d.pickup_location_id,
  d.title,
  d.description,
  d.food_type,
  d.quantity,
  d.unit,
  d.photo_url,
  d.status,
  d.expires_at,
  d.claimed_at,
  d.delivered_at,
  d.created_at,
  d.updated_at,
  l.formatted_address as pickup_address,
  ST_Y(l.point::geometry) as pickup_lat,
  ST_X(l.point::geometry) as pickup_lng
from public.donations d
join public.locations l on l.id = d.pickup_location_id;

create or replace view public.volunteer_pickups as
select * from public.pickups;

create index if not exists locations_point_gist on public.locations using gist (point);

create index if not exists donations_status_expires_idx
  on public.donations (status, expires_at);

create index if not exists donations_donor_created_idx
  on public.donations (donor_id, created_at desc);

create index if not exists donations_pickup_location_idx
  on public.donations (pickup_location_id);

create unique index if not exists claims_one_active_per_donation
  on public.claims (donation_id)
  where status in ('pending', 'approved', 'fulfilled');

create index if not exists claims_ngo_created_idx
  on public.claims (ngo_id, created_at desc);

create index if not exists pickups_open_status_idx
  on public.pickups (status)
  where status = 'open';

create index if not exists pickups_volunteer_idx
  on public.pickups (volunteer_id);

create index if not exists donation_events_donation_created_idx
  on public.donation_events (donation_id, created_at);

create index if not exists notifications_user_read_idx
  on public.notifications (user_id, read_at);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_email_idx on public.profiles (email);
-- FoodBridge v1: backfill profiles for existing auth users

insert into public.profiles (id, email, full_name, role, organization_name, onboarding_completed)
select
  u.id,
  u.email,
  coalesce(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ),
  coalesce(nullif(u.raw_user_meta_data->>'role', '')::user_role, 'donor'::user_role),
  u.raw_user_meta_data->>'organization_name',
  coalesce((u.raw_user_meta_data->>'role') is not null and (u.raw_user_meta_data->>'role') <> '', false)
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
  and u.email is not null
on conflict (id) do nothing;

insert into public.ngo_profiles (profile_id, organization_name)
select
  p.id,
  coalesce(p.organization_name, p.full_name || ' Organization')
from public.profiles p
left join public.ngo_profiles np on np.profile_id = p.id
where p.role = 'ngo'
  and np.profile_id is null
on conflict (profile_id) do nothing;
