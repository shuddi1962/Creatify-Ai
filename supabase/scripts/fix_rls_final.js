const { Client } = require('pg');

async function fix() {
  const c = new Client({
    user: 'postgres.xuhsjvipmwzpmsbpjpgq',
    password: process.argv[2] || '07039Suco2004$#',
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  await c.connect();
  console.log('Connected');

  // Step 1: Create a SECURITY DEFINER function that checks admin_roles without RLS
  // This avoids infinite recursion because the function runs as superuser
  await c.query(`
    CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
    RETURNS boolean
    LANGUAGE sql
    SECURITY DEFINER
    SET search_path = public
    AS $$
      SELECT EXISTS (SELECT 1 FROM admin_roles WHERE user_id = uid AND role IN ('admin', 'super_admin'))
    $$;
  `);
  console.log('Created is_admin() security definer function');

  // Step 2: Drop ALL existing policies on these tables
  await c.query(`DROP POLICY IF EXISTS "Admins can manage all" ON admin_roles`);
  await c.query(`DROP POLICY IF EXISTS "Users can read own admin role" ON admin_roles`);
  await c.query(`DROP POLICY IF EXISTS "Users can insert own admin role" ON admin_roles`);
  await c.query(`DROP POLICY IF EXISTS "Admin manage via JWT" ON admin_roles`);
  await c.query(`DROP POLICY IF EXISTS "Admin only" ON admin_provider_keys`);
  await c.query(`DROP POLICY IF EXISTS "Admin insert provider keys" ON admin_provider_keys`);
  await c.query(`DROP POLICY IF EXISTS "Admin provider keys via JWT" ON admin_provider_keys`);
  await c.query(`DROP POLICY IF EXISTS "Admin provider keys insert via JWT" ON admin_provider_keys`);
  await c.query(`DROP POLICY IF EXISTS "Admin provider manage" ON api_providers`);
  await c.query(`DROP POLICY IF EXISTS "Admin insert providers" ON api_providers`);
  await c.query(`DROP POLICY IF EXISTS "Admin providers via JWT" ON api_providers`);
  await c.query(`DROP POLICY IF EXISTS "Admin providers insert via JWT" ON api_providers`);
  console.log('Dropped all existing policies');

  // Step 3: Create new policies using the SECURITY DEFINER function
  // admin_roles
  await c.query(`
    CREATE POLICY "read own role" ON admin_roles FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "admin manage roles" ON admin_roles FOR ALL USING (public.is_admin(auth.uid()));
  `);
  console.log('Created admin_roles policies');

  // admin_provider_keys - use is_admin() to avoid recursion
  await c.query(`
    CREATE POLICY "admin keys select" ON admin_provider_keys FOR SELECT USING (public.is_admin(auth.uid()));
    CREATE POLICY "admin keys insert" ON admin_provider_keys FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
    CREATE POLICY "admin keys update" ON admin_provider_keys FOR UPDATE USING (public.is_admin(auth.uid()));
    CREATE POLICY "admin keys delete" ON admin_provider_keys FOR DELETE USING (public.is_admin(auth.uid()));
  `);
  console.log('Created admin_provider_keys policies');

  // api_providers
  await c.query(`
    CREATE POLICY "admin prov select" ON api_providers FOR SELECT USING (public.is_admin(auth.uid()));
    CREATE POLICY "admin prov insert" ON api_providers FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
    CREATE POLICY "admin prov update" ON api_providers FOR UPDATE USING (public.is_admin(auth.uid()));
    CREATE POLICY "admin prov delete" ON api_providers FOR DELETE USING (public.is_admin(auth.uid()));
  `);
  console.log('Created api_providers policies');

  // Step 4: Also fix the other admin-only tables that reference admin_roles in their policies
  // These policies from 000_full_setup.sql also need fixing
  const adminTables = ['staff', 'roles', 'audit_logs', 'pages', 'redirects', 'promo_codes'];
  for (const table of adminTables) {
    // Drop old policies
    await c.query(`DROP POLICY IF EXISTS "Staff read" ON ${table}`);
    await c.query(`DROP POLICY IF EXISTS "Admin all" ON ${table}`);
    await c.query(`DROP POLICY IF EXISTS "Admin audit" ON ${table}`);
    await c.query(`DROP POLICY IF EXISTS "Admin pages" ON ${table}`);
    await c.query(`DROP POLICY IF EXISTS "Admin redirects" ON ${table}`);
    await c.query(`DROP POLICY IF EXISTS "Admin promo" ON ${table}`);
    
    // Create new ones using is_admin()
    await c.query(`
      CREATE POLICY "admin ${table}" ON ${table} FOR ALL USING (public.is_admin(auth.uid()));
    `);
    console.log(`Fixed ${table} policies`);
  }

  await c.end();
  console.log('\nDONE! All RLS policies fixed using SECURITY DEFINER function.');
  console.log('No more infinite recursion. Key saving should work now.');
  console.log('Sign out and sign back in for changes to take effect.');
}

fix().catch(e => { console.error('Error:', e.message); process.exit(1); });
