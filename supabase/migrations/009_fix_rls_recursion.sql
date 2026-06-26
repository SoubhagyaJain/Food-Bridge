-- Fix infinite recursion (42P17) in RLS policies
-- Run in Supabase SQL Editor after setup-v1.sql

create or replace function public.user_owns_donation(p_donation_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.donations
    where id = p_donation_id and donor_id = auth.uid()
  );
$$;

create or replace function public.user_has_claim_on_donation(p_donation_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.claims
    where donation_id = p_donation_id and ngo_id = auth.uid()
  );
$$;

create or replace function public.user_volunteer_on_donation(p_donation_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.pickups
    where donation_id = p_donation_id and volunteer_id = auth.uid()
  );
$$;

create or replace function public.auth_user_role()
returns user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- locations: avoid subquery back into donations
drop policy if exists "Authenticated users can view linked locations" on public.locations;
create policy "Authenticated users can view locations"
  on public.locations for select
  to authenticated
  using (true);

-- donations: use helper functions instead of subqueries into claims/pickups
drop policy if exists "NGOs can view claimed donations" on public.donations;
create policy "NGOs can view claimed donations"
  on public.donations for select
  using (public.user_has_claim_on_donation(id));

drop policy if exists "Volunteers can view assigned donations" on public.donations;
create policy "Volunteers can view assigned donations"
  on public.donations for select
  using (public.user_volunteer_on_donation(id));

drop policy if exists "NGOs can view available donations in radius" on public.donations;
create policy "NGOs can view available donations in radius"
  on public.donations for select
  using (
    status = 'available'
    and public.auth_user_role() = 'ngo'
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

-- claims
drop policy if exists "Donors can view claims on own donations" on public.claims;
create policy "Donors can view claims on own donations"
  on public.claims for select
  using (public.user_owns_donation(donation_id));

-- pickups
drop policy if exists "Donors can view pickups on own donations" on public.pickups;
create policy "Donors can view pickups on own donations"
  on public.pickups for select
  using (public.user_owns_donation(donation_id));

drop policy if exists "Volunteers can view open pickups" on public.pickups;
create policy "Volunteers can view open pickups"
  on public.pickups for select
  using (status = 'open' and public.auth_user_role() = 'volunteer');

-- donation_events
drop policy if exists "Involved users can view donation events" on public.donation_events;
create policy "Involved users can view donation events"
  on public.donation_events for select
  using (
    public.user_owns_donation(donation_id)
    or public.user_has_claim_on_donation(donation_id)
    or public.user_volunteer_on_donation(donation_id)
  );

grant execute on function public.user_owns_donation(uuid) to authenticated;
grant execute on function public.user_has_claim_on_donation(uuid) to authenticated;
grant execute on function public.user_volunteer_on_donation(uuid) to authenticated;
grant execute on function public.auth_user_role() to authenticated;