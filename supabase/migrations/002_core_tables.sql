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