-- Add donor display name to volunteer pickup queries
-- Must drop first: PostgreSQL cannot change RETURNS TABLE shape via CREATE OR REPLACE

drop function if exists public.nearby_open_pickups(double precision, double precision, numeric);

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
  distance_meters double precision,
  donor_name text
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
    ) as distance_meters,
    coalesce(donor_p.organization_name, donor_p.full_name) as donor_name
  from public.pickups p
  join public.donations d on d.id = p.donation_id
  join public.locations l on l.id = d.pickup_location_id
  join public.profiles donor_p on donor_p.id = d.donor_id
  where p.status = 'open'
    and d.expires_at > now()
    and ST_DWithin(
      l.point,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_radius_km * 1000
    )
  order by distance_meters asc, d.expires_at asc;
$$;

grant execute on function public.nearby_open_pickups(double precision, double precision, numeric) to authenticated;

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
  ngo_p.email as ngo_email,
  coalesce(donor_p.organization_name, donor_p.full_name) as donor_name
from public.pickups p
join public.donations_with_address d on d.id = p.donation_id
join public.claims c on c.id = p.claim_id
join public.profiles ngo_p on ngo_p.id = c.ngo_id
join public.profiles donor_p on donor_p.id = d.donor_id
left join public.ngo_profiles np on np.profile_id = c.ngo_id;