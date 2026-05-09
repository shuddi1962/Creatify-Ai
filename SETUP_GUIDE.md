# Creatify AI - Supabase + Vercel Setup Guide

## Step 1: Run SQL Migrations (Supabase Dashboard)

1. Go to https://supabase.com/dashboard/project/xuhsjvipmwzpmsbpjpgq
2. Click **SQL Editor** in the left sidebar
3. Click **New Query** (or + icon)
4. Open the file `supabase/migrations/000_all_in_one.sql` from this project
5. Copy the entire content, paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for "Success. No rows returned" — all tables, indexes, and policies are created

Expected result: All 6 migrations run without errors, creating profiles, api_keys, generations, uploads, pending_jobs tables and storage buckets.

---

## Step 2: Enable Auth (Supabase Dashboard)

1. In the same dashboard, click **Authentication** → **Providers**
2. Make sure **Email** provider is enabled (toggle on)
3. Optionally enable **GitHub**, **Google**, etc. if you want social login

---

## Step 3: Verify Storage Buckets

1. Click **Storage** in the left sidebar
2. You should see two buckets: `uploads` and `generations`
3. If not, run this in SQL Editor:
   ```sql
   insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
   values
     ('uploads', 'uploads', true, 52428800, array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav']),
     ('generations', 'generations', true, 104857600, array['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm'])
   on conflict (id) do nothing;
   ```

---

## Step 4: Deploy Edge Functions

### 4a. Install Supabase CLI
```bash
# Windows (PowerShell as Admin):
winget install supabase.cli

# OR via npm:
npm install -g supabase
```

### 4b. Login to Supabase
```bash
supabase login
```
This opens a browser — log in with your Supabase account.

### 4c. Link your project
```bash
cd "C:\Users\USER\Desktop\Creatify AI\Creatify-Ai"
supabase link --project-ref xuhsjvipmwzpmsbpjpgq
```

### 4d. Deploy functions
```bash
supabase functions deploy proxy-api
supabase functions deploy upload-file
supabase functions deploy poll-job
```

### 4e. Set function secrets (needed for the service_role key)
```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1aHNqdmlwbXd6cG1zYnBqcGdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMwMTY1NiwiZXhwIjoyMDkzODc3NjU2fQ.3xVf877q81kPq1BVcaqcBegs8NjEd5oCqbmsrhGMhug
```

---

## Step 5: Deploy on Vercel

1. Push the code to GitHub:
```bash
cd "C:\Users\USER\Desktop\Creatify AI\Creatify-Ai"
git add -A
git commit -m "Add Supabase backend: migrations, edge functions, frontend integration"
git push
```

2. Go to https://vercel.com
3. Click **Add New** → **Project**
4. Import your `Creatify-Ai` repository
5. In the **Environment Variables** section, add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xuhsjvipmwzpmsbpjpgq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1aHNqdmlwbXd6cG1zYnBqcGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMDE2NTYsImV4cCI6MjA5Mzg3NzY1Nn0.nu72YZ6Xxvxo3PDEPZlCL_bMg2Zh3rGEVhRzU8YduKQ` |

6. Click **Deploy**
7. Wait for build + deploy (first build may take a few minutes)

---

## Step 6: Install Agent Skills
```bash
npx skills add supabase/agent-skills
```

---

## Done

Your app is now live at `https://creatify-ai.vercel.app` (or your custom Vercel URL). Users sign in via Supabase Auth, their Muapi keys are stored securely, and all generation history is saved to the database instead of localStorage.
