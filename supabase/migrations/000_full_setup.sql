-- =============================================
-- Creatify AI - FULL DATABASE SETUP
-- Run THIS file in Supabase Dashboard > SQL Editor
-- Creates ALL tables, storage, RLS, functions
-- =============================================

-- 1. ADMIN ROLES (must be first - referenced by other policies)
create table if not exists public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users unique,
  role text default 'admin' check (role in ('admin', 'super_admin', 'moderator', 'support', 'finance', 'content_manager')),
  created_at timestamptz default now()
);

-- 2. API PROVIDERS
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

-- 3. ADMIN PROVIDER KEYS
create table if not exists public.admin_provider_keys (
  id uuid primary key default gen_random_uuid(),
  provider text not null references public.api_providers(name) on delete cascade,
  encrypted_key text not null,
  label text default 'default',
  is_active boolean default true,
  created_at timestamptz default now(),
  unique (provider, label)
);

-- 4. CONTENT IDEAS
create table if not exists content_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  niche text, platform text, region text,
  hook text, script_outline text, virality_score int,
  trending_audio text, hashtags text[],
  source_url text,
  source text default 'ai-generated',
  created_at timestamptz default now()
);

-- 5. SAVED IDEAS
create table if not exists saved_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  idea_id uuid references content_ideas,
  created_at timestamptz default now()
);

-- 6. CONTENT CALENDAR
create table if not exists content_calendar (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  idea_id uuid references content_ideas,
  scheduled_date date, status text default 'planned'
);

-- 7. BULK JOBS
create table if not exists bulk_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  type text, total_items int, completed int default 0,
  failed int default 0, status text default 'queued',
  zip_url text, created_at timestamptz default now()
);

-- 8. BULK JOB ITEMS
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

-- 9. CHARACTERS
create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  name text, reference_images jsonb, metadata jsonb,
  created_at timestamptz default now()
);

-- 10. WORLDS
create table if not exists worlds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  name text, settings jsonb, created_at timestamptz default now()
);

-- 11. STAFF
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  role_id uuid, invited_by uuid, created_at timestamptz default now()
);

-- 12. ROLES
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text unique, permissions jsonb, is_system bool default false
);

-- 13. AUDIT LOG
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid, action text, target_type text,
  target_id text, metadata jsonb, created_at timestamptz default now()
);

-- 14. PAGES (CMS)
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique, title text, meta_title text,
  meta_description text, og_image text,
  content jsonb, status text default 'draft',
  published_at timestamptz, updated_at timestamptz default now()
);

-- 15. REDIRECTS
create table if not exists redirects (
  id uuid primary key default gen_random_uuid(),
  from_slug text, to_slug text, type int default 301
);

-- 16. PROMO CODES
create table if not exists promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique, type text, value numeric,
  uses_limit int, uses_count int default 0,
  expires_at timestamptz, active bool default true
);

-- 17. WORKFLOWS
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

-- 18. WORKFLOW RUNS
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

-- 19. AGENTS
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

-- 20. AGENT LOGS
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

-- 21. MEDIA LIBRARY
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

-- 22. SCHEDULED POSTS
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

-- 23. CONNECTED ACCOUNTS
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

-- 24. NOTIFICATIONS
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

-- 25. USER SETTINGS
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

-- 26. CREDIT TRANSACTIONS
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

-- 27. SUBSCRIPTIONS
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

-- 28. PROMPT TEMPLATES
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

-- 29. MCP SKILLS
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

-- 30. SCRAPED URLS CACHE
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

-- =============================================
-- RLS POLICIES (each wrapped in existence check)
-- =============================================

-- Helper to create policy if not exists
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'admin_roles') then alter table public.admin_roles enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'api_providers') then alter table public.api_providers enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'admin_provider_keys') then alter table public.admin_provider_keys enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'content_ideas') then alter table content_ideas enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'saved_ideas') then alter table saved_ideas enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'content_calendar') then alter table content_calendar enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'bulk_jobs') then alter table bulk_jobs enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'bulk_job_items') then alter table public.bulk_job_items enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'characters') then alter table characters enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'worlds') then alter table worlds enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'staff') then alter table staff enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'roles') then alter table roles enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'audit_logs') then alter table audit_logs enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'pages') then alter table pages enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'redirects') then alter table redirects enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'promo_codes') then alter table promo_codes enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'workflows') then alter table public.workflows enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'workflow_runs') then alter table public.workflow_runs enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'agents') then alter table public.agents enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'agent_logs') then alter table public.agent_logs enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'media_library') then alter table public.media_library enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'scheduled_posts') then alter table public.scheduled_posts enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'connected_accounts') then alter table public.connected_accounts enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'notifications') then alter table public.notifications enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'user_settings') then alter table public.user_settings enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'credit_transactions') then alter table public.credit_transactions enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'subscriptions') then alter table public.subscriptions enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'prompt_templates') then alter table public.prompt_templates enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'mcp_skills') then alter table public.mcp_skills enable row level security; end if;
  if not exists (select 1 from pg_policies where tablename = 'scraped_urls') then alter table public.scraped_urls enable row level security; end if;
end $$;

-- User-owning policies (each checks if already exists by name)
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own their saved_ideas') then create policy "Users own their saved_ideas" on saved_ideas for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own their content_calendar') then create policy "Users own their content_calendar" on content_calendar for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own their bulk_jobs') then create policy "Users own their bulk_jobs" on bulk_jobs for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own their characters') then create policy "Users own their characters" on characters for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own their worlds') then create policy "Users own their worlds" on worlds for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own bulk items') then create policy "Users own bulk items" on bulk_job_items for all using (exists (select 1 from bulk_jobs where id = bulk_job_id and user_id = auth.uid())); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own workflows') then create policy "Users own workflows" on workflows for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Anyone can view published') then create policy "Anyone can view published" on workflows for select using (is_published = true); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own workflow runs') then create policy "Users own workflow runs" on workflow_runs for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own agents') then create policy "Users own agents" on agents for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Anyone can view template agents') then create policy "Anyone can view template agents" on agents for select using (is_template = true); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own agent logs') then create policy "Users own agent logs" on agent_logs for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own media') then create policy "Users own media" on media_library for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own scheduled posts') then create policy "Users own scheduled posts" on scheduled_posts for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own connected accounts') then create policy "Users own connected accounts" on connected_accounts for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own notifications') then create policy "Users own notifications" on notifications for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own settings') then create policy "Users own settings" on user_settings for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users view own credits') then create policy "Users view own credits" on credit_transactions for select using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users view own subscription') then create policy "Users view own subscription" on subscriptions for select using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users update own subscription') then create policy "Users update own subscription" on subscriptions for update using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own templates') then create policy "Users own templates" on prompt_templates for all using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Anyone view public templates') then create policy "Anyone view public templates" on prompt_templates for select using (is_public = true); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users own MCP skills') then create policy "Users own MCP skills" on mcp_skills for all using (auth.uid() = user_id); end if; end $$;

-- Admin-only policies
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Staff read') then create policy "Staff read" on staff for select using (exists (select 1 from admin_roles where user_id = auth.uid())); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Admin all') then create policy "Admin all" on roles for all using (exists (select 1 from admin_roles where user_id = auth.uid() and role in ('admin', 'super_admin'))); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Admin audit') then create policy "Admin audit" on audit_logs for all using (exists (select 1 from admin_roles where user_id = auth.uid())); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Admin pages') then create policy "Admin pages" on pages for all using (exists (select 1 from admin_roles where user_id = auth.uid())); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Admin redirects') then create policy "Admin redirects" on redirects for all using (exists (select 1 from admin_roles where user_id = auth.uid())); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Admin promo') then create policy "Admin promo" on promo_codes for all using (exists (select 1 from admin_roles where user_id = auth.uid())); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Admin only') then create policy "Admin only" on admin_provider_keys for all using (exists (select 1 from admin_roles where user_id = auth.uid())); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Admin provider manage') then create policy "Admin provider manage" on api_providers for all using (exists (select 1 from admin_roles where user_id = auth.uid())); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users can read own admin role') then create policy "Users can read own admin role" on admin_roles for select using (auth.uid() = user_id); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Admins can manage all') then create policy "Admins can manage all" on admin_roles for all using (exists (select 1 from admin_roles where user_id = auth.uid() and role in ('admin', 'super_admin'))); end if; end $$;

-- =============================================
-- STORAGE BUCKETS (idempotent via on conflict)
-- =============================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('uploads', 'uploads', true, 52428800, array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav']),
  ('generations', 'generations', true, 104857600, array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm']),
  ('avatars', 'avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp']),
  ('media', 'media', false, 104857600, array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav']),
  ('characters', 'characters', false, 52428800, array['image/png', 'image/jpeg', 'image/webp']),
  ('worlds', 'worlds', false, 52428800, array['image/png', 'image/jpeg', 'image/webp']),
  ('thumbnails', 'thumbnails', true, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

-- Storage RLS policies (each wrapped in existence check)
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users can view uploads' and tablename = 'objects') then create policy "Users can view uploads" on storage.objects for select using (bucket_id in ('uploads', 'generations')); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users can upload files' and tablename = 'objects') then create policy "Users can upload files" on storage.objects for insert with check (bucket_id in ('uploads', 'generations') and auth.role() = 'authenticated'); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users can update own files' and tablename = 'objects') then create policy "Users can update own files" on storage.objects for update using (auth.uid() = owner); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where policyname = 'Users can delete own files' and tablename = 'objects') then create policy "Users can delete own files" on storage.objects for delete using (auth.uid() = owner); end if; end $$;

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

create or replace function public.handle_new_user_settings()
returns trigger as $$
begin
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace function public.handle_new_user_subscription()
returns trigger as $$
begin
  insert into public.subscriptions (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created_settings
  after insert on auth.users
  for each row execute function public.handle_new_user_settings();

create or replace trigger on_auth_user_created_subscription
  after insert on auth.users
  for each row execute function public.handle_new_user_subscription();

-- Utility functions
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

-- =============================================
-- COMPLETE - All infrastructure created
-- =============================================
