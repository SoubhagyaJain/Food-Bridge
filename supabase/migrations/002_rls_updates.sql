-- FoodBridge RLS updates — run in Supabase SQL Editor after schema.sql

-- NGOs can view donations they have claims on
create policy "NGOs can view claimed donations"
  on public.donations for select
  using (
    exists (
      select 1 from public.claims
      where claims.donation_id = donations.id
        and claims.ngo_id = auth.uid()
    )
  );

-- Donors can view claims on their donations
create policy "Donors can view claims on own donations"
  on public.claims for select
  using (
    exists (
      select 1 from public.donations
      where donations.id = claims.donation_id
        and donations.donor_id = auth.uid()
    )
  );

-- Replace permissive pickup select policy
drop policy if exists "Authenticated users can view pickups" on public.pickups;

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

-- Prevent duplicate active claims per donation
create unique index if not exists claims_one_active_per_donation
  on public.claims (donation_id)
  where status in ('pending', 'approved', 'fulfilled');