-- FoodBridge seed data (run AFTER migrations + backfill, with test auth users present)
-- Default center: Mumbai area — adjust lat/lng for your region

-- Example: insert sample donations only when at least one donor profile exists
do $$
declare
  v_donor_id uuid;
  v_loc_id uuid;
begin
  select id into v_donor_id from public.profiles where role = 'donor' limit 1;
  if v_donor_id is null then
    raise notice 'No donor profile found — skip seed donations';
    return;
  end if;

  insert into public.locations (point, formatted_address, city)
  values (
    ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326)::geography,
    'Sample pickup — Andheri West, Mumbai',
    'Mumbai'
  )
  returning id into v_loc_id;

  insert into public.donations (
    donor_id, pickup_location_id, title, food_type, quantity, unit,
    expires_at, description, status
  )
  values (
    v_donor_id,
    v_loc_id,
    'Fresh vegetable surplus',
    'vegetables',
    12,
    'kg',
    now() + interval '2 days',
    'Surplus from community kitchen',
    'available'
  );
end $$;