create table if not exists public.uploads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  file_name text not null,
  file_type text not null,
  file_size bigint not null,
  storage_path text not null,
  public_url text,
  thumbnail_url text,
  created_at timestamptz default now() not null
);

create index uploads_user_id_idx on uploads(user_id);
create index uploads_created_at_idx on uploads(created_at desc);

alter table public.uploads enable row level security;

create policy "Users can view own uploads"
  on uploads for select
  using (auth.uid() = user_id);

create policy "Users can insert own uploads"
  on uploads for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own uploads"
  on uploads for delete
  using (auth.uid() = user_id);
