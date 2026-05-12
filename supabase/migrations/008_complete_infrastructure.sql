-- =============================================
-- Creatify AI - Complete Infrastructure
-- Run in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. API PROVIDERS (admin configurable)
create table if not exists public.api_providers (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  display_name text not null,
  base_url text not null,
  docs_url text,
  is_active boolean default true,
  supported_models jsonb default '[]',
  created_at timestamptz default now()
);

insert into public.api_providers (name, display_name, base_url, docs_url, supported_models) values
  ('muapi', 'Muapi AI', 'https://api.muapi.ai', 'https://muapi.ai/docs', '["gpt-image-2","seedance-2","kling-3","flux","midjourney-v7"]'),
  ('kie-ai', 'Kie AI', 'https://api.kie.ai/v1', 'https://kie.ai/docs', '["kie-image","kie-video"]'),
  ('openrouter', 'OpenRouter', 'https://openrouter.ai/api/v1', 'https://openrouter.ai/docs', '["gpt-4o","claude-3.5","gemini-2.0"]'),
  ('elevenlabs', 'ElevenLabs', 'https://api.elevenlabs.io/v1', 'https://elevenlabs.io/docs', '["eleven-multilingual-v2"]'),
  ('google-trends', 'Google Trends', 'https://serpapi.com', 'https://serpapi.com/google-trends-api', '[]'),
  ('tavily', 'Tavily AI', 'https://api.tavily.com', 'https://tavily.com/docs', '["tavily-search"]')
on conflict (name) do nothing;

-- 2. ADMIN PROVIDER KEYS (encrypted, admin-only)
create table if not exists public.admin_provider_keys (
  id uuid primary key default gen_random_uuid(),
  provider text not null references public.api_providers(name) on delete cascade,
  encrypted_key text not null,
  label text default 'default',
  is_active boolean default true,
  created_at timestamptz default now(),
  unique (provider, label)
);

alter table public.admin_provider_keys enable row level security;
create policy "Admin only - provider keys" on public.admin_provider_keys
  for all using (exists (select 1 from admin_roles where user_id = auth.uid()));

-- 3. WORKFLOWS
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  nodes jsonb default '[]',
  edges jsonb default '[]',
  is_template boolean default false,
  is_published boolean default false,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists workflows_user_id_idx on workflows(user_id);

alter table public.workflows enable row level security;
create policy "Users own workflows" on workflows for all using (auth.uid() = user_id);
create policy "Anyone can view published" on workflows for select using (is_published = true);

-- 4. WORKFLOW RUNS
create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references public.workflows on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  inputs jsonb default '{}',
  outputs jsonb default '{}',
  status text default 'pending',
  error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.workflow_runs enable row level security;
create policy "Users own workflow runs" on workflow_runs for all using (auth.uid() = user_id);

-- 5. AGENTS
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  system_prompt text,
  model text default 'gpt-4o',
  temperature real default 0.7,
  max_tokens int default 2048,
  tools jsonb default '[]',
  is_template boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.agents enable row level security;
create policy "Users own agents" on agents for all using (auth.uid() = user_id);
create policy "Anyone can view template agents" on agents for select using (is_template = true);

-- 6. AGENT LOGS
create table if not exists public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  input text, output text,
  tokens_used int default 0,
  duration_ms int default 0,
  status text default 'completed',
  error text,
  created_at timestamptz default now()
);

alter table public.agent_logs enable row level security;
create policy "Users own agent logs" on agent_logs for all using (auth.uid() = user_id);

-- 7. MEDIA LIBRARY
create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  type text not null check (type in ('image', 'video', 'audio', 'document', '3d')),
  url text not null,
  thumbnail_url text,
  file_size bigint,
  mime_type text,
  folder text default '/',
  tags text[] default '{}',
  metadata jsonb default '{}',
  favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index media_library_user_id_idx on media_library(user_id);
create index media_library_type_idx on media_library(type);

alter table public.media_library enable row level security;
create policy "Users own media" on media_library for all using (auth.uid() = user_id);

-- 8. SCHEDULED POSTS
create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text,
  media_urls text[] default '{}',
  platform text not null,
  scheduled_for timestamptz not null,
  status text default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed')),
  platform_post_id text,
  analytics jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.scheduled_posts enable row level security;
create policy "Users own scheduled posts" on scheduled_posts for all using (auth.uid() = user_id);

-- 9. CONNECTED ACCOUNTS
create table if not exists public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  platform text not null,
  account_name text,
  account_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  is_active boolean default true,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, platform)
);

alter table public.connected_accounts enable row level security;
create policy "Users own connected accounts" on connected_accounts for all using (auth.uid() = user_id);

-- 10. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  type text not null,
  title text not null,
  body text,
  data jsonb default '{}',
  is_read boolean default false,
  created_at timestamptz default now()
);

create index notifications_user_id_idx on notifications(user_id);
create index notifications_unread_idx on notifications(user_id) where is_read = false;

alter table public.notifications enable row level security;
create policy "Users own notifications" on notifications for all using (auth.uid() = user_id);

-- 11. USER SETTINGS
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users on delete cascade,
  theme text default 'dark',
  accent_color text default '#7C3AED',
  sidebar_collapsed boolean default false,
  auto_publish boolean default false,
  email_notifications boolean default true,
  two_factor_enabled boolean default false,
  api_rate_limit int default 60,
  storage_quota_mb int default 5120,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_settings enable row level security;
create policy "Users own settings" on user_settings for all using (auth.uid() = user_id);

create or replace function public.handle_new_user_settings()
returns trigger as $$
begin
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created_settings
  after insert on auth.users
  for each row execute function public.handle_new_user_settings();

-- 12. CREDIT TRANSACTIONS
create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  amount int not null,
  type text not null check (type in ('purchase', 'usage', 'refund', 'bonus', 'referral')),
  description text,
  balance_after int not null,
  reference_id text,
  created_at timestamptz default now()
);

create index credit_transactions_user_id_idx on credit_transactions(user_id);

alter table public.credit_transactions enable row level security;
create policy "Users view own credits" on credit_transactions for select using (auth.uid() = user_id);

-- 13. SUBSCRIPTIONS
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null unique,
  plan text default 'free' not null check (plan in ('free', 'pro', 'enterprise')),
  credits int default 100,
  credits_used int default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  status text default 'active' check (status in ('active', 'past_due', 'canceled', 'expired')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;
create policy "Users view own subscription" on subscriptions for select using (auth.uid() = user_id);
create policy "Users update own subscription" on subscriptions for update using (auth.uid() = user_id);

create or replace function public.handle_new_user_subscription()
returns trigger as $$
begin
  insert into public.subscriptions (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created_subscription
  after insert on auth.users
  for each row execute function public.handle_new_user_subscription();

-- 14. PROMPT TEMPLATES
create table if not exists public.prompt_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  name text not null,
  category text,
  prompt_text text not null,
  model text,
  settings jsonb default '{}',
  is_public boolean default false,
  uses_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.prompt_templates enable row level security;
create policy "Users own templates" on prompt_templates for all using (auth.uid() = user_id);
create policy "Anyone view public templates" on prompt_templates for select using (is_public = true);

-- 15. MCP SKILLS
create table if not exists public.mcp_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  server_url text not null,
  tool_definitions jsonb default '[]',
  auth_type text default 'none',
  credentials jsonb default '{}',
  is_active boolean default true,
  last_used_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.mcp_skills enable row level security;
create policy "Users own MCP skills" on mcp_skills for all using (auth.uid() = user_id);

-- 16. BULK JOB ITEMS
create table if not exists public.bulk_job_items (
  id uuid primary key default gen_random_uuid(),
  bulk_job_id uuid references public.bulk_jobs on delete cascade not null,
  row_index int not null,
  prompt text,
  params jsonb default '{}',
  result_url text,
  status text default 'pending',
  error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.bulk_job_items enable row level security;
create policy "Users own bulk items" on bulk_job_items for all
  using (exists (select 1 from bulk_jobs where id = bulk_job_id and user_id = auth.uid()));

-- 17. SCRAPED URLS CACHE
create table if not exists public.scraped_urls (
  id uuid primary key default gen_random_uuid(),
  url text unique not null,
  title text,
  description text,
  og_image text,
  og_type text,
  domain text,
  product_data jsonb default '{}',
  scraped_at timestamptz default now()
);

create index scraped_urls_domain_idx on scraped_urls(domain);

alter table public.scraped_urls enable row level security;
create policy "Anyone can read scraped cache" on scraped_urls for select using (true);
create policy "Authenticated can insert" on scraped_urls for insert with check (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKETS
-- =============================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('avatars', 'avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp']),
  ('media', 'media', false, 104857600, array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav']),
  ('characters', 'characters', false, 52428800, array['image/png', 'image/jpeg', 'image/webp']),
  ('worlds', 'worlds', false, 52428800, array['image/png', 'image/jpeg', 'image/webp']),
  ('thumbnails', 'thumbnails', true, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

-- Storage RLS policies (skip if already exist)
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Users can view avatars') then
    create policy "Users can view avatars" on storage.objects for select
      using (bucket_id = 'avatars');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Users can view media') then
    create policy "Users can view media" on storage.objects for select
      using (bucket_id = 'media' and (auth.uid() = owner or auth.role() = 'authenticated'));
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Users can view characters') then
    create policy "Users can view characters" on storage.objects for select
      using (bucket_id = 'characters' and (auth.uid() = owner));
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Users can view worlds') then
    create policy "Users can view worlds" on storage.objects for select
      using (bucket_id = 'worlds' and (auth.uid() = owner));
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Users can view thumbnails') then
    create policy "Users can view thumbnails" on storage.objects for select
      using (bucket_id = 'thumbnails');
  end if;
end;
$$;

-- Authenticated users can upload to all buckets
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'Auth upload to all buckets') then
    create policy "Auth upload to all buckets" on storage.objects for insert
      with check (
        bucket_id in ('avatars', 'media', 'characters', 'worlds', 'thumbnails')
        and auth.role() = 'authenticated'
      );
  end if;
end;
$$;

-- =============================================
-- CORE FUNCTIONS
-- =============================================

-- Get or create user settings
create or replace function public.get_user_settings()
returns json as $$
declare
  settings json;
begin
  select row_to_json(u.*)::json into settings
  from public.user_settings u
  where u.user_id = auth.uid();
  return settings;
end;
$$ language plpgsql security definer;

-- Get user balance / credits
create or replace function public.get_user_credits()
returns int as $$
declare
  credit_balance int;
begin
  select credits - credits_used into credit_balance
  from public.subscriptions
  where user_id = auth.uid();
  return coalesce(credit_balance, 0);
end;
$$ language plpgsql security definer;

-- Deduct credits
create or replace function public.deduct_credits(amount int, description text default 'generation')
returns boolean as $$
begin
  update public.subscriptions
  set credits_used = credits_used + amount
  where user_id = auth.uid()
  and (credits - credits_used) >= amount;
  if found then
    insert into public.credit_transactions (user_id, amount, type, description, balance_after)
    values (auth.uid(), -amount, 'usage', description,
      (select credits - credits_used from public.subscriptions where user_id = auth.uid()));
    return true;
  end if;
  return false;
end;
$$ language plpgsql security definer;

-- Save generation record
create or replace function public.save_generation(
  p_type text, p_model text, p_prompt text, p_result_url text, p_metadata jsonb default '{}'
) returns uuid as $$
declare
  gen_id uuid;
begin
  insert into public.generations (user_id, type, model, prompt,
    case when p_type in ('image','i2i') then image_url else null end,
    case when p_type in ('video','i2v','v2v','lipsync') then video_url else null end,
    metadata)
  values (auth.uid(),
    case when p_type = 'image' then 'image'::generation_type
         when p_type = 'video' then 'video'::generation_type
         when p_type = 'i2i' then 'i2i'::generation_type
         when p_type = 'i2v' then 'i2v'::generation_type
         when p_type = 'v2v' then 'v2v'::generation_type
         else 'lipsync'::generation_type
    end,
    p_model, p_prompt, p_result_url, p_result_url, p_metadata)
  returning id into gen_id;
  return gen_id;
end;
$$ language plpgsql security definer;

-- =============================================
-- VIEWS
-- =============================================

create or replace view public.user_dashboard_stats as
select
  u.id as user_id,
  coalesce(s.credits - s.credits_used, 0) as available_credits,
  s.plan,
  (select count(*) from generations g where g.user_id = u.id) as total_generations,
  (select count(*) from generations g where g.user_id = u.id and g.created_at > now() - interval '24 hours') as generations_today,
  (select count(*) from media_library m where m.user_id = u.id) as media_count,
  (select count(*) from scheduled_posts sp where sp.user_id = u.id and sp.status = 'scheduled') as scheduled_posts
from auth.users u
left join subscriptions s on s.user_id = u.id;

-- =============================================
-- COMPLETE - All infrastructure created
-- =============================================
