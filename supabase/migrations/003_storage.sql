-- FoodBridge Storage — donation photos
-- Run in Supabase SQL Editor after schema.sql

-- Optional photo URL on donations
alter table public.donations
  add column if not exists photo_url text;

-- Storage bucket for donation images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'donation-photos',
  'donation-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Donors can upload to their own folder (path prefix = user id)
create policy "Donors can upload donation photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'donation-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Donors can update own donation photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'donation-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Donors can delete own donation photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'donation-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public read for donation photos
create policy "Public can view donation photos"
  on storage.objects for select
  to public
  using (bucket_id = 'donation-photos');

-- Alias view: volunteer_pickups (checklist naming)
create or replace view public.volunteer_pickups as
  select * from public.pickups;