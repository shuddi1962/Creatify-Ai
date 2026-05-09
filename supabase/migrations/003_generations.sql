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

create index generations_user_id_idx on generations(user_id);
create index generations_type_idx on generations(type);
create index generations_created_at_idx on generations(created_at desc);

alter table public.generations enable row level security;

create policy "Users can view own generations"
  on generations for select
  using (auth.uid() = user_id);

create policy "Users can insert own generations"
  on generations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own generations"
  on generations for update
  using (auth.uid() = user_id);

create policy "Users can delete own generations"
  on generations for delete
  using (auth.uid() = user_id);
