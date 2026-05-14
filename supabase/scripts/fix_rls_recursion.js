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

  // The problem: "Admins can manage all" on admin_roles queries admin_roles -> infinite recursion
  // Fix: Use auth.jwt() which reads from the JWT claims instead of querying the table
  // The JWT has app_metadata.admin_role set to 'super_admin' for this user

  await c.query(`
    -- Drop the recursive policy
    DROP POLICY IF EXISTS "Admins can manage all" ON admin_roles;
  `);
  console.log('Dropped recursive admin_roles policy');

  // Create new non-recursive policies
  await c.query(`
    -- Allow users to read their own row
    DROP POLICY IF EXISTS "Users can read own admin role" ON admin_roles;
    CREATE POLICY "Users can read own admin role" ON admin_roles
      FOR SELECT USING (auth.uid() = user_id);
  `);
  console.log('Created read own role policy');

  await c.query(`
    -- Allow any authenticated user to INSERT their own admin_roles row
    -- (so the first admin can be created)
    CREATE POLICY "Users can insert own admin role" ON admin_roles
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  `);
  console.log('Created insert own role policy');

  await c.query(`
    -- For UPDATE/DELETE on admin_roles, check JWT app_metadata instead of querying table
    -- This avoids recursion because it reads from the auth token, not from the DB
    CREATE POLICY "Admin manage via JWT" ON admin_roles
      FOR ALL USING (
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'admin_role', '') IN ('admin', 'super_admin')
      );
  `);
  console.log('Created JWT-based admin management policy');

  // Also fix admin_provider_keys and api_providers policies to use JWT instead
  // This avoids any potential recursion with admin_roles queries

  await c.query(`
    DROP POLICY IF EXISTS "Admin only" ON admin_provider_keys;
    DROP POLICY IF EXISTS "Admin insert provider keys" ON admin_provider_keys;
    
    CREATE POLICY "Admin provider keys via JWT" ON admin_provider_keys
      FOR ALL USING (
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'admin_role', '') IN ('admin', 'super_admin')
      );
    CREATE POLICY "Admin provider keys insert via JWT" ON admin_provider_keys
      FOR INSERT WITH CHECK (
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'admin_role', '') IN ('admin', 'super_admin')
      );
  `);
  console.log('Fixed admin_provider_keys policies');

  await c.query(`
    DROP POLICY IF EXISTS "Admin provider manage" ON api_providers;
    DROP POLICY IF EXISTS "Admin insert providers" ON api_providers;
    
    CREATE POLICY "Admin providers via JWT" ON api_providers
      FOR ALL USING (
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'admin_role', '') IN ('admin', 'super_admin')
      );
    CREATE POLICY "Admin providers insert via JWT" ON api_providers
      FOR INSERT WITH CHECK (
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'admin_role', '') IN ('admin', 'super_admin')
      );
  `);
  console.log('Fixed api_providers policies');

  await c.end();
  console.log('\nDONE! All RLS policies fixed. No more infinite recursion.');
  console.log('Sign out and sign back in for JWT claims to refresh.');
}

fix().catch(e => { console.error('Error:', e.message); process.exit(1); });
