-- Content ideas
create table if not exists content_ideas (
  id uuid primary key default gen_random_uuid(),
  niche text, platform text, region text,
  hook text, script_outline text, virality_score int,
  trending_audio text, hashtags text[],
  created_at timestamptz default now()
);

-- Saved ideas per user
create table if not exists saved_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  idea_id uuid references content_ideas,
  created_at timestamptz default now()
);

-- Content calendar
create table if not exists content_calendar (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  idea_id uuid references content_ideas,
  scheduled_date date, status text default 'planned'
);

-- Bulk jobs
create table if not exists bulk_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  type text, total_items int, completed int default 0,
  failed int default 0, status text default 'queued',
  zip_url text, created_at timestamptz default now()
);

-- Characters
create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  name text, reference_images jsonb, metadata jsonb,
  created_at timestamptz default now()
);

-- Worlds
create table if not exists worlds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  name text, settings jsonb, created_at timestamptz default now()
);

-- Staff
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  role_id uuid, invited_by uuid, created_at timestamptz default now()
);

-- Roles
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text unique, permissions jsonb, is_system bool default false
);

-- Audit log
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid, action text, target_type text,
  target_id text, metadata jsonb, created_at timestamptz default now()
);

-- Pages (CMS)
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique, title text, meta_title text,
  meta_description text, og_image text,
  content jsonb, status text default 'draft',
  published_at timestamptz, updated_at timestamptz default now()
);

-- Redirects
create table if not exists redirects (
  id uuid primary key default gen_random_uuid(),
  from_slug text, to_slug text, type int default 301
);

-- Promo codes
create table if not exists promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique, type text, value numeric,
  uses_limit int, uses_count int default 0,
  expires_at timestamptz, active bool default true
);

-- Admin user roles (for auth.users metadata fallback)
create table if not exists admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users unique,
  role text default 'admin' check (role in ('admin', 'super_admin', 'moderator', 'support', 'finance', 'content_manager')),
  created_at timestamptz default now()
);

-- RLS: enable all
alter table content_ideas enable row level security;
alter table saved_ideas enable row level security;
alter table content_calendar enable row level security;
alter table bulk_jobs enable row level security;
alter table characters enable row level security;
alter table worlds enable row level security;
alter table staff enable row level security;
alter table roles enable row level security;
alter table audit_logs enable row level security;
alter table pages enable row level security;
alter table redirects enable row level security;
alter table promo_codes enable row level security;
alter table admin_roles enable row level security;

-- RLS policies: users own their data
create policy "Users own their saved_ideas" on saved_ideas for all using (auth.uid() = user_id);
create policy "Users own their content_calendar" on content_calendar for all using (auth.uid() = user_id);
create policy "Users own their bulk_jobs" on bulk_jobs for all using (auth.uid() = user_id);
create policy "Users own their characters" on characters for all using (auth.uid() = user_id);
create policy "Users own their worlds" on worlds for all using (auth.uid() = user_id);

-- RLS policies: admin-only tables
create policy "Staff read" on staff for select using (exists (select 1 from admin_roles where user_id = auth.uid()));
create policy "Admin all" on roles for all using (exists (select 1 from admin_roles where user_id = auth.uid() and role in ('admin', 'super_admin')));
create policy "Admin audit" on audit_logs for all using (exists (select 1 from admin_roles where user_id = auth.uid()));
create policy "Admin pages" on pages for all using (exists (select 1 from admin_roles where user_id = auth.uid()));
create policy "Admin redirects" on redirects for all using (exists (select 1 from admin_roles where user_id = auth.uid()));
create policy "Admin promo" on promo_codes for all using (exists (select 1 from admin_roles where user_id = auth.uid()));
