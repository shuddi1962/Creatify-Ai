-- =============================================
-- Creatify AI - Complete Supabase Schema Setup
-- Run this entire script in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. API KEYS
create table if not exists public.api_keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  provider text not null default 'muapi',
  encrypted_key text not null,
  label text default 'default',
  is_active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (user_id, provider, label)
);
alter table public.api_keys enable row level security;

create policy "Users can view own API keys"
  on api_keys for select using (auth.uid() = user_id);
create policy "Users can insert own API keys"
  on api_keys for insert with check (auth.uid() = user_id);
create policy "Users can update own API keys"
  on api_keys for update using (auth.uid() = user_id);
create policy "Users can delete own API keys"
  on api_keys for delete using (auth.uid() = user_id);

-- 3. GENERATIONS
create type generation_type as enum ('image', 'video', 'i2i', 'i2v', 'v2v', 'lipsync');

create table if not exists public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type generation_type not null,
  model text not null,
  prompt text,
  negative_prompt text,
  image_url text,
  video_url text,
  audio_url text,
  aspect_ratio text,
  resolution text,
  duration int,
  seed bigint,
  guidance_scale real,
  steps int,
  quality text,
  mode text,
  status text default 'pending' not null,
  error text,
  metadata jsonb default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists generations_user_id_idx on generations(user_id);
create index if not exists generations_type_idx on generations(type);
create index if not exists generations_created_at_idx on generations(created_at desc);

alter table public.generations enable row level security;

create policy "Users can view own generations"
  on generations for select using (auth.uid() = user_id);
create policy "Users can insert own generations"
  on generations for insert with check (auth.uid() = user_id);
create policy "Users can update own generations"
  on generations for update using (auth.uid() = user_id);
create policy "Users can delete own generations"
  on generations for delete using (auth.uid() = user_id);

-- 4. UPLOADS
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

create index if not exists uploads_user_id_idx on uploads(user_id);
create index if not exists uploads_created_at_idx on uploads(created_at desc);

alter table public.uploads enable row level security;

create policy "Users can view own uploads"
  on uploads for select using (auth.uid() = user_id);
create policy "Users can insert own uploads"
  on uploads for insert with check (auth.uid() = user_id);
create policy "Users can delete own uploads"
  on uploads for delete using (auth.uid() = user_id);

-- 5. PENDING JOBS
create type job_type as enum ('image', 'video', 'i2i', 'i2v', 'v2v', 'lipsync', 'workflow');

create table if not exists public.pending_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  request_id text not null,
  generation_id uuid references public.generations(id) on delete set null,
  job_type job_type not null,
  model text not null,
  params jsonb default '{}',
  status text default 'pending' not null,
  poll_attempts int default 0,
  max_poll_attempts int default 900,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists pending_jobs_user_id_idx on pending_jobs(user_id);
create index if not exists pending_jobs_status_idx on pending_jobs(status);
create unique index if not exists pending_jobs_request_id_idx on pending_jobs(request_id);

alter table public.pending_jobs enable row level security;

create policy "Users can view own pending jobs"
  on pending_jobs for select using (auth.uid() = user_id);
create policy "Users can insert own pending jobs"
  on pending_jobs for insert with check (auth.uid() = user_id);
create policy "Users can update own pending jobs"
  on pending_jobs for update using (auth.uid() = user_id);
create policy "Users can delete own pending jobs"
  on pending_jobs for delete using (auth.uid() = user_id);

-- 6. STORAGE BUCKETS + RLS
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

-- =============================================
-- DONE
-- =============================================
