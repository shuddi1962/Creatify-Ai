-- =============================================
-- Migration 009: Compliance, Auth, and Observability
-- =============================================

-- 1. Function to increment credits used (for token caps)
create or replace function public.increment_credits_used(p_user_id uuid, p_amount int default 1)
returns void
language plpgsql
security definer
as $$
begin
  update public.subscriptions
  set credits_used_monthly = coalesce(credits_used_monthly, 0) + p_amount,
      credits_reset_at = coalesce(credits_reset_at, now() + interval '1 month')
  where user_id = p_user_id;
  if not found then
    insert into public.subscriptions (user_id, plan_tier, credits_used_monthly, credits_reset_at)
    values (p_user_id, 'free', p_amount, now() + interval '1 month');
  end if;
end;
$$;

-- 2. Function to get user credit status
create or replace function public.get_user_credits(p_user_id uuid)
returns table (
  plan_tier text,
  credits_used_monthly int,
  credits_limit_monthly int,
  credits_reset_at timestamptz
)
language plpgsql
security definer
stable
as $$
begin
  return query
  select
    coalesce(s.plan_tier, 'free'),
    coalesce(s.credits_used_monthly, 0),
    case coalesce(s.plan_tier, 'free')
      when 'free' then 100
      when 'plus' then 45000
      when 'ultra' then 150000
      when 'business' then 600000
      else 100
    end,
    coalesce(s.credits_reset_at, now() + interval '1 month')
  from public.subscriptions s
  where s.user_id = p_user_id;
  if not found then
    return query select 'free'::text, 0::int, 100::int, (now() + interval '1 month')::timestamptz;
  end if;
end;
$$;

-- 3. Ensure audit_logs table exists
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- 4. RLS for audit_logs (admin only)
alter table public.audit_logs enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Admin audit logs' and tablename = 'audit_logs') then
    create policy "Admin audit logs" on public.audit_logs
      for all using (exists (select 1 from public.admin_roles where user_id = auth.uid() and role in ('admin', 'super_admin')));
  end if;
end $$;

-- 5. Ensure analytics table exists
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  user_id uuid,
  properties jsonb default '{}',
  url text,
  ip text,
  created_at timestamptz default now()
);

-- 6. Enable RLS on analytics (admin read only, insert for all)
alter table public.analytics_events enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Analytics insert' and tablename = 'analytics_events') then
    create policy "Analytics insert" on public.analytics_events
      for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Analytics admin read' and tablename = 'analytics_events') then
    create policy "Analytics admin read" on public.analytics_events
      for select using (exists (select 1 from public.admin_roles where user_id = auth.uid()));
  end if;
end $$;

-- 7. Rate limit column in user_settings
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name = 'user_settings' and column_name = 'api_rate_limit') then
    alter table public.user_settings add column api_rate_limit int default 60;
  end if;
end $$;

-- 8. Email verification status in profiles
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'email_verified') then
    alter table public.profiles add column email_verified boolean default false;
  end if;
end $$;
