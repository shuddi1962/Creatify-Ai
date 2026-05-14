-- =============================================
-- ONE-CLICK SETUP — Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. CREATE ALL MISSING TABLES
\i '../migrations/008_complete_infrastructure.sql'
\i '../migrations/007_new_tables.sql'

-- 2. GRANT YOURSELF ADMIN ACCESS (replace YOUR_USER_ID)
-- Find your user ID: run this first:  SELECT id FROM auth.users WHERE email = 'your-email@example.com';
-- Then run:  INSERT INTO admin_roles (user_id, role) VALUES ('YOUR_USER_ID', 'super_admin');
