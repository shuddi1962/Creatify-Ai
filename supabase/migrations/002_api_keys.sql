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
  on api_keys for select
  using (auth.uid() = user_id);

create policy "Users can insert own API keys"
  on api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can update own API keys"
  on api_keys for update
  using (auth.uid() = user_id);

create policy "Users can delete own API keys"
  on api_keys for delete
  using (auth.uid() = user_id);
