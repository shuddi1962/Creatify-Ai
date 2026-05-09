-- Creatify AI Database Migrations
-- Run these in your Supabase SQL Editor

-- ============================================
-- Content Ideas Tables
-- ============================================

CREATE TABLE IF NOT EXISTS content_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  niche text NOT NULL,
  platform text NOT NULL,
  region text DEFAULT 'global',
  hook text,
  script_outline text,
  virality_score int,
  trending_audio text,
  hashtags text[],
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id uuid REFERENCES content_ideas(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

CREATE TABLE IF NOT EXISTS content_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id uuid REFERENCES content_ideas(id) ON DELETE SET NULL,
  script_text text,
  media_url text,
  scheduled_date date,
  platform text,
  status text DEFAULT 'planned',
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Bulk Jobs Table
-- ============================================

CREATE TABLE IF NOT EXISTS bulk_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  total_items int NOT NULL,
  completed int DEFAULT 0,
  failed int DEFAULT 0,
  status text DEFAULT 'queued',
  csv_url text,
  zip_url text,
  google_drive_folder_id text,
  webhook_url text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS bulk_job_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES bulk_jobs(id) ON DELETE CASCADE,
  row_data jsonb,
  status text DEFAULT 'pending',
  result_url text,
  error_message text,
  credits_used int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- ============================================
-- Characters & Worlds Tables
-- ============================================

CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  reference_images jsonb,
  voice_id text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  settings jsonb,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Staff & Roles Tables (for Admin)
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  permissions jsonb DEFAULT '[]',
  is_system bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id),
  invited_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  last_active_at timestamptz
);

-- Insert default roles
INSERT INTO roles (name, description, permissions, is_system) VALUES
  ('Super Admin', 'Full system access', '["*"]', true),
  ('Admin', 'Administrative access', '["users", "staff", "content", "jobs", "models", "seo", "pages", "analytics", "marketing", "settings"]', true),
  ('Moderator', 'Content and user moderation', '["content", "users"]', true),
  ('Support', 'User support access', '["users"]', true),
  ('Finance', 'Billing and analytics access', '["analytics", "marketing"]', true),
  ('Content Manager', 'Content and SEO management', '["content", "seo", "pages"]', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Audit Log Table
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  target_type text,
  target_id text,
  metadata jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- CMS Tables
-- ============================================

CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_title text,
  meta_description text,
  og_image text,
  canonical_url text,
  content jsonb,
  status text DEFAULT 'draft',
  published_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_slug text NOT NULL,
  to_slug text NOT NULL,
  type int DEFAULT 301,
  created_at timestamptz DEFAULT now()
);

-- Insert built-in pages
INSERT INTO pages (slug, title, meta_title, meta_description, status, published_at) VALUES
  ('about', 'About', 'About Creatify AI', 'Learn about Creatify AI - the free open-source AI content creation platform', 'published', now()),
  ('pricing', 'Pricing', 'Pricing Plans', 'Flexible pricing plans for AI content generation', 'published', now()),
  ('terms', 'Terms of Service', 'Terms of Service', 'Terms and conditions for using Creatify AI', 'published', now()),
  ('privacy', 'Privacy Policy', 'Privacy Policy', 'How we handle and protect your data', 'published', now()),
  ('faq', 'FAQ', 'Frequently Asked Questions', 'Common questions and answers about Creatify AI', 'published', now())
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Marketing Tables
-- ============================================

CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL,
  value numeric NOT NULL,
  description text,
  uses_limit int,
  uses_count int DEFAULT 0,
  expires_at timestamptz,
  active bool DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_credits int DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Platform Settings Table
-- ============================================

CREATE TABLE IF NOT EXISTS platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO platform_settings (key, value) VALUES
  ('feature_flags', '{"bulk_generate": true, "content_ideas": true, "schedule_publish": true, "characters": true, "workflows": true, "agents": true}'),
  ('maintenance_mode', '{"enabled": false, "message": "We are performing maintenance. Please check back soon."}'),
  ('smtp_settings', null),
  ('storage_settings', '{"provider": "local", "max_storage_gb": 10}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- API Keys Table (for storing encrypted keys)
-- ============================================

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider text NOT NULL,
  encrypted_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Enable Row Level Security
-- ============================================

ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_job_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Users can only see their own data
CREATE POLICY "Users can manage own content_ideas" ON content_ideas FOR ALL USING (true);
CREATE POLICY "Users can manage own saved_ideas" ON saved_ideas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own content_calendar" ON content_calendar FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bulk_jobs" ON bulk_jobs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bulk_job_items" ON bulk_job_items FOR ALL USING (auth.uid() IN (SELECT user_id FROM bulk_jobs WHERE id = bulk_job_items.job_id));
CREATE POLICY "Users can manage own characters" ON characters FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own worlds" ON worlds FOR ALL USING (auth.uid() = user_id);

-- Public read for content_ideas (trending data)
CREATE POLICY "Public can read content_ideas" ON content_ideas FOR SELECT USING (true);

-- Public read for pages (CMS)
CREATE POLICY "Public can read published pages" ON pages FOR SELECT USING (status = 'published');

-- Admin only can modify staff, roles, audit_logs, pages, promo_codes, platform_settings, api_keys
CREATE POLICY "Admins can manage staff" ON staff FOR ALL USING (true);
CREATE POLICY "Admins can manage roles" ON roles FOR ALL USING (true);
CREATE POLICY "Admins can manage audit_logs" ON audit_logs FOR ALL USING (true);
CREATE POLICY "Admins can manage pages" ON pages FOR ALL USING (true);
CREATE POLICY "Admins can manage promo_codes" ON promo_codes FOR ALL USING (true);
CREATE POLICY "Admins can manage platform_settings" ON platform_settings FOR ALL USING (true);
CREATE POLICY "Admins can manage api_keys" ON api_keys FOR ALL USING (true);

-- ============================================
-- Indexes for Performance
-- ============================================

CREATE INDEX idx_content_ideas_niche ON content_ideas(niche);
CREATE INDEX idx_content_ideas_platform ON content_ideas(platform);
CREATE INDEX idx_content_ideas_region ON content_ideas(region);
CREATE INDEX idx_content_ideas_created ON content_ideas(created_at DESC);

CREATE INDEX idx_saved_ideas_user ON saved_ideas(user_id);
CREATE INDEX idx_saved_ideas_idea ON saved_ideas(idea_id);

CREATE INDEX idx_content_calendar_user ON content_calendar(user_id);
CREATE INDEX idx_content_calendar_date ON content_calendar(scheduled_date);
CREATE INDEX idx_content_calendar_status ON content_calendar(status);

CREATE INDEX idx_bulk_jobs_user ON bulk_jobs(user_id);
CREATE INDEX idx_bulk_jobs_status ON bulk_jobs(status);
CREATE INDEX idx_bulk_jobs_created ON bulk_jobs(created_at DESC);

CREATE INDEX idx_bulk_job_items_job ON bulk_job_items(job_id);
CREATE INDEX idx_bulk_job_items_status ON bulk_job_items(status);

CREATE INDEX idx_characters_user ON characters(user_id);
CREATE INDEX idx_worlds_user ON worlds(user_id);

CREATE INDEX idx_audit_logs_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(active);