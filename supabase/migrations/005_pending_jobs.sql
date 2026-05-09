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

create index pending_jobs_user_id_idx on pending_jobs(user_id);
create index pending_jobs_status_idx on pending_jobs(status);
create unique index pending_jobs_request_id_idx on pending_jobs(request_id);

alter table public.pending_jobs enable row level security;

create policy "Users can view own pending jobs"
  on pending_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own pending jobs"
  on pending_jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own pending jobs"
  on pending_jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own pending jobs"
  on pending_jobs for delete
  using (auth.uid() = user_id);
