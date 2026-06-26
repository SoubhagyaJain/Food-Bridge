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