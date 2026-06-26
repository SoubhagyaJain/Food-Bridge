-- FoodBridge — run this ONCE in Supabase Dashboard → SQL Editor → New query → Run
-- Project: https://supabase.com/dashboard/project/thilwunymjbdlawvnqmt/sql/new

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('donor', 'ngo', 'volunteer')),
  phone text,
  organization_name text,
  onboarding_completed boolean not null default true,
  created_at timestamptz not null default now()
);

-- Donations
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  food_type text not null,
  quantity numeric not null,
  unit text not null,
  pickup_address text not null,
  photo_url text,
  status text not null default 'available'
    check (status in ('available', 'claimed', 'in_transit', 'delivered', 'expired', 'cancelled')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- NGO claims on donations
create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations (id) on delete cascade,
  ngo_id uuid not null references public.profiles (id) on delete cascade,
  notes text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'fulfilled')),
  created_at timestamptz not null default now()
);

-- Volunteer pickups
create table if not exists public.pickups (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations (id) on delete cascade,
  volunteer_id uuid references public.profiles (id) on delete set null,
  status text not null default 'open'
    check (status in ('open', 'assigned', 'in_transit', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
  user_full_name text;
  needs_onboarding boolean;
begin
  user_role := new.raw_user_meta_data->>'role';
  user_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    ''
  );
  needs_onboarding := user_role is null or user_role = '';

  insert into public.profiles (id, email, full_name, role, onboarding_completed)
  values (
    new.id,
    new.email,
    user_full_name,
    coalesce(nullif(user_role, ''), 'donor'),
    not needs_onboarding
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists donations_updated_at on public.donations;
create trigger donations_updated_at
  before update on public.donations
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.donations enable row level security;
alter table public.claims enable row level security;
alter table public.pickups enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Donors can insert own donations" on public.donations;
create policy "Donors can insert own donations"
  on public.donations for insert
  with check (auth.uid() = donor_id);

drop policy if exists "Donors can update own donations" on public.donations;
create policy "Donors can update own donations"
  on public.donations for update
  using (auth.uid() = donor_id);

drop policy if exists "Donors can view own donations" on public.donations;
create policy "Donors can view own donations"
  on public.donations for select
  using (auth.uid() = donor_id);

drop policy if exists "Authenticated users can view available donations" on public.donations;
create policy "Authenticated users can view available donations"
  on public.donations for select
  using (status = 'available' or auth.uid() = donor_id);

drop policy if exists "NGOs can view claimed donations" on public.donations;
create policy "NGOs can view claimed donations"
  on public.donations for select
  using (
    exists (
      select 1 from public.claims
      where claims.donation_id = donations.id
        and claims.ngo_id = auth.uid()
    )
  );

drop policy if exists "NGOs can insert claims" on public.claims;
create policy "NGOs can insert claims"
  on public.claims for insert
  with check (auth.uid() = ngo_id);

drop policy if exists "NGOs can view own claims" on public.claims;
create policy "NGOs can view own claims"
  on public.claims for select
  using (auth.uid() = ngo_id);

drop policy if exists "Donors can view claims on own donations" on public.claims;
create policy "Donors can view claims on own donations"
  on public.claims for select
  using (
    exists (
      select 1 from public.donations
      where donations.id = claims.donation_id
        and donations.donor_id = auth.uid()
    )
  );

drop policy if exists "Authenticated users can view pickups" on public.pickups;
drop policy if exists "Volunteers and NGOs can view relevant pickups" on public.pickups;
create policy "Volunteers and NGOs can view relevant pickups"
  on public.pickups for select
  using (
    status = 'open'
    or volunteer_id = auth.uid()
    or exists (
      select 1 from public.claims
      where claims.donation_id = pickups.donation_id
        and claims.ngo_id = auth.uid()
    )
    or exists (
      select 1 from public.donations
      where donations.id = pickups.donation_id
        and donations.donor_id = auth.uid()
    )
  );

drop policy if exists "Volunteers can accept open pickups" on public.pickups;
create policy "Volunteers can accept open pickups"
  on public.pickups for update
  using (status = 'open' or volunteer_id = auth.uid());

create unique index if not exists claims_one_active_per_donation
  on public.claims (donation_id)
  where status in ('pending', 'approved', 'fulfilled');

-- Storage bucket for donation photos
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

create or replace view public.volunteer_pickups as
  select * from public.pickups;

-- Backfill profiles for users who signed up before this schema existed
insert into public.profiles (id, email, full_name, role, onboarding_completed)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''),
  coalesce(nullif(u.raw_user_meta_data->>'role', ''), 'donor'),
  true
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
  and u.email is not null;