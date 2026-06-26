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