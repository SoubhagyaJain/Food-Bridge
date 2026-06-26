-- FoodBridge Supabase schema
-- Run this in Supabase Dashboard → SQL Editor → New query → Run

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('donor', 'ngo', 'volunteer')),
  phone text,
  organization_name text,
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
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'donor')
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

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Donations: donors manage their own; NGOs/volunteers can read available
create policy "Donors can insert own donations"
  on public.donations for insert
  with check (auth.uid() = donor_id);

create policy "Donors can update own donations"
  on public.donations for update
  using (auth.uid() = donor_id);

create policy "Donors can view own donations"
  on public.donations for select
  using (auth.uid() = donor_id);

create policy "Authenticated users can view available donations"
  on public.donations for select
  using (status = 'available' or auth.uid() = donor_id);

-- Claims: NGOs manage their own claims
create policy "NGOs can insert claims"
  on public.claims for insert
  with check (auth.uid() = ngo_id);

create policy "NGOs can view own claims"
  on public.claims for select
  using (auth.uid() = ngo_id);

-- Pickups: volunteers can view open pickups and update assigned ones
create policy "Authenticated users can view pickups"
  on public.pickups for select
  using (true);

create policy "Volunteers can accept open pickups"
  on public.pickups for update
  using (status = 'open' or volunteer_id = auth.uid());