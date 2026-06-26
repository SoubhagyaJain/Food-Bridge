-- FoodBridge v1: storage bucket for donation photos

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