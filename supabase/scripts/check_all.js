const { Client } = require('pg');

async function check() {
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

  // Check all users
  const users = await c.query('SELECT id, email FROM auth.users ORDER BY created_at');
  console.log('=== ALL USERS ===');
  for (const u of users.rows) {
    console.log(`  ${u.email} (${u.id})`);
  }

  // Check admin_roles
  const adminRoles = await c.query('SELECT * FROM admin_roles');
  console.log('\n=== ADMIN ROLES ===');
  if (adminRoles.rows.length === 0) {
    console.log('  EMPTY - no admin roles assigned!');
  }
  for (const r of adminRoles.rows) {
    console.log(`  user_id=${r.user_id} role=${r.role}`);
  }

  // Test is_admin for EACH user
  console.log('\n=== IS_ADMIN CHECK ===');
  for (const u of users.rows) {
    const res = await c.query('SELECT public.is_admin($1)', [u.id]);
    console.log(`  ${u.email}: is_admin=${res.rows[0].is_admin}`);
  }

  // Recreate the function to be safe
  await c.query(`
    CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
    RETURNS boolean
    LANGUAGE sql
    SECURITY DEFINER
    STABLE
    AS $$
      SELECT EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = uid AND role IN ('admin', 'super_admin'))
    $$;
  `);
  console.log('\nRecreated is_admin function');

  // Re-test
  for (const u of users.rows) {
    const res = await c.query('SELECT public.is_admin($1)', [u.id]);
    console.log(`  ${u.email}: is_admin=${res.rows[0].is_admin}`);
  }

  await c.end();
}

check().catch(e => console.error('Error:', e.message));
