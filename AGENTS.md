You are upgrading the existing Creatify AI platform at https://github.com/shuddi1962/Creatify-Ai — a Next.js 14 monorepo using App Router, Tailwind CSS, npm workspaces with a packages/studio shared library, and Supabase as the backend. The site is live at https://creatify-ai-one.vercel.app/studio.

DO NOT break any existing functionality. Build all additions on top of what exists.

---

## CURRENT SITE STRUCTURE (what exists already)
Navigation: Image Studio | Video Studio | Lip Sync | Cinema Studio | Marketing Studio | Workflows | Agents | Explore Apps

Architecture:
- app/studio/page.js → renders StandaloneShell component
- components/StandaloneShell.js → tab nav with BYOK (API key from localStorage)
- packages/studio/src/ → ImageStudio, VideoStudio, LipSyncStudio, CinemaStudio, WorkflowStudio components
- packages/studio/src/models.js → all 200+ model definitions
- packages/studio/src/muapi.js → API client

---

## TASK 1 — ADD DROPDOWN SUBMENUS TO ALL EXISTING NAV ITEMS

Redesign StandaloneShell.js to support a full mega-menu navigation bar. Each nav item gets a hoverable dropdown with sub-routes. Keep dark glassmorphism design (#0A0F1E bg, rgba cards, violet accent #7C3AED).

### Image Studio dropdown submenus:
- Text to Image → /studio/image/text-to-image
- Image to Image → /studio/image/image-to-image
- Inpaint & Edit → /studio/image/inpaint
- Outpaint / Expand → /studio/image/outpaint
- Upscale Image → /studio/image/upscale
- Remove Background → /studio/image/remove-bg
- Multi-View (9 angles) → /studio/image/multi-view
- Camera Angle Control → /studio/image/camera-angle
- Product Placement → /studio/image/product-placement
- Fashion Generator → /studio/image/fashion
- AI Headshot → /studio/image/headshot
- Meme Generator → /studio/image/meme
- Style Transfer → /studio/image/style-transfer
- Image to 3D → /studio/image/image-to-3d

### Video Studio dropdown submenus:
- Text to Video → /studio/video/text-to-video
- Image to Video → /studio/video/image-to-video
- Smart Shot → /studio/video/smart-shot
- Motion Sync → /studio/video/motion-sync
- Edit Video → /studio/video/edit
- Extend Video → /studio/video/extend
- Restyle Video → /studio/video/restyle
- Replace Character → /studio/video/replace-character
- Video Upscale → /studio/video/upscale
- Add Sound Effects → /studio/video/sound-effects
- Mixed Media → /studio/video/mixed-media
- Camera Motion Presets → /studio/video/camera-motion

### Lip Sync dropdown submenus:
- Portrait + Audio → /studio/lipsync/portrait
- Video + Audio → /studio/lipsync/video
- Bulk Lip Sync → /studio/lipsync/bulk
- Talking Avatar → /studio/lipsync/avatar
- Multi-language Dubbing → /studio/lipsync/dubbing

### Cinema Studio dropdown submenus:
- Cinematic Generator → /studio/cinema/generate
- VFX Presets Library → /studio/cinema/vfx
- Color Grading → /studio/cinema/color-grading
- Storyboard Builder → /studio/cinema/storyboard
- Scene Composition → /studio/cinema/scene
- Genre Presets → /studio/cinema/genres

### Marketing Studio dropdown submenus:
- UGC Ad Generator → /studio/marketing/ugc
- Product URL to Ad → /studio/marketing/product-url
- Brand Kit Manager → /studio/marketing/brand-kit
- Platform Formatter → /studio/marketing/formatter
- Hook Generator → /studio/marketing/hooks
- Batch Ad Generator → /studio/marketing/batch
- Story Ad Builder → /studio/marketing/stories

### Workflows dropdown submenus:
- Visual Builder (Canvas) → /studio/workflows/canvas
- Templates Library → /studio/workflows/templates
- My Workflows → /studio/workflows/mine
- Community Workflows → /studio/workflows/community
- Moodboard → /studio/workflows/moodboard
- Scheduled Runs → /studio/workflows/scheduled

### Agents dropdown submenus:
- My Agents → /studio/agents/mine
- Agent Templates → /studio/agents/templates
- MCP Server Connect → /studio/agents/mcp
- CLI Tool → /studio/agents/cli
- Agent Logs → /studio/agents/logs

### Explore Apps dropdown submenus:
- All Apps → /studio/apps/all
- VFX & Effects → /studio/apps/vfx
- Face & Character → /studio/apps/face
- Style & Color → /studio/apps/style
- Product & Fashion → /studio/apps/product
- Meme & Social → /studio/apps/social
- Favorites → /studio/apps/favorites
- New This Week → /studio/apps/new

---

## TASK 2 — ADD NEW TOP-LEVEL NAV ITEMS

Add these new items to the main navigation after "Explore Apps":

### Audio Studio → /studio/audio
Sub-pages:
- Text to Voiceover → /studio/audio/voiceover (100+ voices, multilingual, ElevenLabs via Muapi)
- Voice Cloning → /studio/audio/voice-clone (upload 10s sample → clone voice)
- Text to Music → /studio/audio/music (genre, mood, BPM controls)
- Sound Effects → /studio/audio/sfx
- Audio to Subtitles → /studio/audio/subtitles
- ASMR Generator → /studio/audio/asmr
- Background Music → /studio/audio/background-music

### Bulk Generate → /studio/bulk
Sub-pages:
- Bulk Image → /studio/bulk/image (CSV upload → batch image generation, up to 500 rows)
- Bulk Video → /studio/bulk/video (CSV upload → batch video generation)
- Bulk Lip Sync → /studio/bulk/lipsync (one character + CSV of audio = 100 talking videos)
- Bulk Voiceover → /studio/bulk/voiceover (CSV of scripts → batch audio)
- Job Queue → /studio/bulk/queue (live progress tracker per job, retry failed, download ZIP)

Implementation: each CSV row creates a job in Supabase bulk_jobs table. Process sequentially per user. Store results with download URLs. Show live status with progress bars. Add "Download All as ZIP" and "Push to Google Drive" buttons.

### Content Ideas → /studio/ideas
Sub-pages:
- Trending Now → /studio/ideas/trending
- My Saved Ideas → /studio/ideas/saved
- Content Calendar → /studio/ideas/calendar
- Hook Generator → /studio/ideas/hooks
- Script Generator → /studio/ideas/scripts
- Competitor Analyzer → /studio/ideas/competitor
- Thumbnail Generator → /studio/ideas/thumbnails

Main /studio/ideas page:
- Niche selector: searchable dropdown of 200+ niches (fitness, fashion, finance, food, travel, gaming, beauty, real estate, tech, crypto, parenting, pets, comedy, motivation, education, horror, true crime, business, spirituality + others)
- Region selector: country dropdown (Global + 50 countries)
- Platform selector: TikTok | Instagram Reels | YouTube Shorts | LinkedIn | Twitter/X | Pinterest (multi-select pills)
- Results: grid of idea cards, each showing: hook line, content angle, visual style suggestion, estimated virality score (1-100), trending audio suggestion, hashtags
- Each card has: "Generate Script" button → opens AI script writer, "Add to Calendar" button, "Send to Bulk Video" button
- Fetch trends via Muapi.ai or Tavily API, store results in Supabase content_ideas table, refresh daily via cron

### Characters & Worlds → /studio/characters
Sub-pages:
- My Characters → /studio/characters/mine
- Character Library → /studio/characters/library
- Create Character → /studio/characters/create
- My Worlds → /studio/characters/worlds
- Create World → /studio/characters/worlds/create

### Schedule & Publish → /studio/schedule
Sub-pages:
- Calendar View → /studio/schedule/calendar
- Connect Accounts → /studio/schedule/connect
- Scheduled Posts → /studio/schedule/posts
- Post Analytics → /studio/schedule/analytics

### Media Library → /studio/media
Sub-pages:
- All Assets → /studio/media/all
- Images → /studio/media/images
- Videos → /studio/media/videos
- Audio → /studio/media/audio
- Projects → /studio/media/projects
- Connected Storage → /studio/media/storage

---

## TASK 3 — UPGRADE THE HOMEPAGE

The current homepage shows: headline, 3 stats, 8 feature cards, 3-step how-it-works, CTA.

Upgrade to a full marketing landing page with these sections:

1. Hero: animated headline "Create Anything with AI" — same as now but add a live generation preview (loop through 4-5 sample AI outputs with fade transitions), CTA button "Start Creating Free", secondary "View Demo" button
2. Stats bar: 200+ AI Models | 15 Creative Studios | 100% Free & Open Source | 500 Bulk at once | 200+ Niches for Ideas
3. Feature spotlight cards (8 → 15 cards, matching all studio sections)
4. "How it works" — keep existing 3 steps
5. NEW — Content Ideas section: show the niche picker and trend cards in a demo/preview state with sample data to show the feature
6. NEW — Bulk Generation section: show a CSV → video pipeline diagram
7. NEW — Trusted models section: logos/badges of Kling, Sora, Veo, Seedance, Flux, GPT-Image, Seedream, Wan, Runway, Midjourney
8. CTA footer section: same as existing

---

## TASK 4 — ADD FULL ADMIN PORTAL at /admin

Create a completely separate layout for /admin/* routes. Admin portal is NOT accessible from the user-facing studio — it has its own login at /admin/login.

Admin auth: use Supabase auth + check user role = 'admin' or 'super_admin'. Redirect to /admin/login if not authorized.

Admin layout: fixed left sidebar (260px dark sidebar #0D1321), main content area. All admin routes use AdminLayout wrapper.

### Admin pages to build:

/admin/dashboard
- Stats cards: Total Users, Active Today, Generations Today, Revenue Today (if payment enabled), API Calls Today, Failed Jobs
- Charts: 7-day signups line chart, 7-day generations bar chart by type (image/video/audio)
- Live activity feed (last 20 events: user signup, generation complete, bulk job complete)
- Alert panel: failed jobs count, API errors, flagged content
- System status indicators: Muapi API (green/red), Supabase (green/red), Storage (green/red)

/admin/users
- Full table: Avatar | Name | Email | Plan | Credits | Joined | Last Active | Status | Actions
- Search bar, filter by plan/status, sort by any column, pagination 25/page
- Click any row → /admin/users/[id] — full user profile with tabs: Overview, All Creations (grid), Billing, Login History, API Usage, Notes
- Per-user actions: Edit Profile, Change Plan, Add Credits, Send Email, Impersonate (view as user), Suspend, Ban, Delete
- Bulk actions toolbar: Export CSV, Mass Email, Bulk Credit Adjustment

/admin/staff
- Staff table: Name | Email | Role | Added By | Last Active | Actions
- Invite Staff modal: email input + role selector + send invite
- Edit role, revoke access buttons

/admin/roles
- Roles table: Name | Description | Staff Count | Permissions Preview | Actions
- Create Role modal: name, description, permission toggles (checkboxes for each admin section: users, staff, content, jobs, models, seo, pages, analytics, settings)
- Built-in roles (not deletable): Super Admin, Admin, Moderator, Support, Finance, Content Manager

/admin/content
- Flagged content queue: thumbnail | type | user | reason | date | Approve/Delete buttons
- NSFW threshold sliders
- Blocked keywords/prompts list with add/remove

/admin/jobs
- Jobs table: ID | User | Type | Model | Status | Credits | Created | Duration | Actions
- Filter by status (queued/processing/completed/failed), type, date
- Retry failed jobs button
- API spend tracker: cost per model per day table

/admin/models
- Models table: Name | Provider | Type | Credit Cost | Plans Available | Enabled | Actions
- Toggle enable/disable per model
- Edit credit cost
- Model stats: usage count, avg latency, error rate

/admin/seo
- Pages list → click any → edit: Meta Title, Meta Description, OG Image, Canonical URL
- Robots.txt editor (textarea)
- Sitemap generator button (auto-generates and shows URL)
- Redirects manager: table with From | To | Type (301/302) | Created | Delete
- Schema markup editor (JSON-LD textarea per page)
- Blog post manager with rich text editor

/admin/pages
- Pages table: Title | Slug | Status | Last Updated | Actions
- Create/Edit page: rich text editor (TipTap or similar), title, slug, meta fields, status toggle (draft/published)
- Built-in pages: About, Pricing, Terms, Privacy, FAQ — always shown

/admin/analytics
- Date range picker
- Charts: Daily/Weekly/Monthly signups, generation volume by type, credit usage
- Table: top 10 models by usage
- Export CSV button for all charts

/admin/marketing
- Promo codes table: Code | Type (% or fixed or credits) | Value | Uses/Limit | Expires | Status | Actions
- Create promo code modal
- Referral settings: reward amount, max referrals per user
- Platform banners: manage announcement banners shown in the studio

/admin/settings
- Platform name, logo upload, favicon upload
- Feature flags: toggle any feature on/off (Bulk Generate, Content Ideas, Schedule & Publish, etc.)
- Maintenance mode toggle + custom message textarea
- API key vault: store Muapi key, Tavily key, ElevenLabs key, Stripe key (encrypted in Supabase)
- SMTP settings for email
- Storage settings

/admin/audit
- Full log table: Timestamp | Admin | Action | Target Type | Target ID | Details
- Filter by admin, action type, date range
- Export CSV

---

## TASK 5 — DATABASE (Supabase migrations)

Add these tables if not existing:

```sql
-- Content ideas
create table content_ideas (
  id uuid primary key default gen_random_uuid(),
  niche text, platform text, region text,
  hook text, script_outline text, virality_score int,
  trending_audio text, hashtags text[],
  created_at timestamptz default now()
);

-- Saved ideas per user
create table saved_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  idea_id uuid references content_ideas,
  created_at timestamptz default now()
);

-- Content calendar
create table content_calendar (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  idea_id uuid references content_ideas,
  scheduled_date date, status text default 'planned'
);

-- Bulk jobs
create table bulk_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  type text, total_items int, completed int default 0,
  failed int default 0, status text default 'queued',
  zip_url text, created_at timestamptz default now()
);

-- Characters
create table characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  name text, reference_images jsonb, metadata jsonb,
  created_at timestamptz default now()
);

-- Worlds
create table worlds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  name text, settings jsonb, created_at timestamptz default now()
);

-- Staff
create table staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  role_id uuid, invited_by uuid, created_at timestamptz default now()
);

-- Roles
create table roles (
  id uuid primary key default gen_random_uuid(),
  name text unique, permissions jsonb, is_system bool default false
);

-- Audit log
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid, action text, target_type text,
  target_id text, metadata jsonb, created_at timestamptz default now()
);

-- Pages (CMS)
create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique, title text, meta_title text,
  meta_description text, og_image text,
  content jsonb, status text default 'draft',
  published_at timestamptz, updated_at timestamptz default now()
);

-- Redirects
create table redirects (
  id uuid primary key default gen_random_uuid(),
  from_slug text, to_slug text, type int default 301
);

-- Promo codes
create table promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique, type text, value numeric,
  uses_limit int, uses_count int default 0,
  expires_at timestamptz, active bool default true
);
```

---

## TASK 6 — UI DESIGN RULES (apply everywhere)

Keep existing dark glassmorphism design. Extend it consistently:
- Background: #0A0F1E
- Card surface: rgba(17, 24, 39, 0.8) with backdrop-filter: blur(10px)
- Border: 1px solid rgba(255,255,255,0.08)
- Primary accent: #7C3AED (violet)
- Secondary: #06B6D4 (cyan)
- Text primary: #F9FAFB
- Text secondary: #9CA3AF

Dropdown menus:
- Appear on hover (with 150ms delay to avoid accidental trigger)
- Dark card surface with blur, border, shadow
- Two-column grid layout for menus with 8+ items
- Each item: icon (Lucide or Tabler) + title + 1-line description
- Smooth 200ms fade + translate-y animation
- Mobile: collapse to hamburger → full-screen slide-in drawer

All new pages must have:
- Proper loading skeleton states
- Error boundaries with retry
- Empty states with illustration + CTA
- Toast notifications (success/error) on all actions
- Responsive (mobile-first, works on 375px+)

---

## TASK 7 — NAV FINAL STRUCTURE

After all changes, the top navigation should be (in order):

[ Image Studio ▾ ] [ Video Studio ▾ ] [ Lip Sync ▾ ] [ Audio Studio ▾ ] [ Cinema Studio ▾ ] [ Marketing Studio ▾ ] [ Bulk Generate ▾ ] [ Content Ideas ▾ ] [ Characters & Worlds ▾ ] [ Workflows ▾ ] [ Agents ▾ ] [ Explore Apps ▾ ] [ Media Library ▾ ] [ Schedule & Publish ▾ ]

On the far right of the topbar:
[ Settings ] [ Sign In / User Avatar ] [ Admin (if admin role) ]

---

## IMPLEMENTATION ORDER

1. First: update StandaloneShell.js with the full mega-menu nav (all dropdowns, hover behavior, mobile drawer)
2. Second: create all new route folders and page.js files (can be placeholder skeletons for new pages)
3. Third: run Supabase migrations to add new tables
4. Fourth: build Content Ideas page (/studio/ideas) — most unique feature, highest priority
5. Fifth: build Bulk Generate page (/studio/bulk) with CSV upload and job queue
6. Sixth: build Audio Studio (/studio/audio)
7. Seventh: build all admin pages in order: dashboard → users → staff → roles → content → jobs → models → seo → pages → analytics → marketing → settings → audit
8. Eighth: upgrade homepage with new sections
9. Last: fill in remaining sub-pages for existing studios (inpaint, upscale, remove-bg, etc.)

Keep all existing generation logic intact. Do not change packages/studio/src/models.js or muapi.js unless adding new model entries.
