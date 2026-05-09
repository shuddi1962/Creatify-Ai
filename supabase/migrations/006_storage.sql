insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('uploads', 'uploads', true, 52428800, array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav']),
  ('generations', 'generations', true, 104857600, array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm'])
on conflict (id) do nothing;

create policy "Users can view uploads"
  on storage.objects for select
  using (bucket_id in ('uploads', 'generations'));

create policy "Users can upload files"
  on storage.objects for insert
  with check (
    bucket_id in ('uploads', 'generations')
    and auth.role() = 'authenticated'
  );

create policy "Users can update own files"
  on storage.objects for update
  using (auth.uid() = owner);

create policy "Users can delete own files"
  on storage.objects for delete
  using (auth.uid() = owner);
