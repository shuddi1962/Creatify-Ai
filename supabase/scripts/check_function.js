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

  // Check if function exists
  const r = await c.query(
    `SELECT proname, pronamespace::regnamespace as schema FROM pg_proc WHERE proname = 'is_admin'`
  );
  console.log('is_admin function:', r.rows.length ? r.rows[0].schema + '.' + r.rows[0].proname : 'NOT FOUND');

  if (r.rows.length > 0) {
    // Test it with the user
    const users = await c.query('SELECT id, email FROM auth.users LIMIT 1');
    if (users.rows.length > 0) {
      const res = await c.query('SELECT public.is_admin($1)', [users.rows[0].id]);
      console.log(`is_admin(${users.rows[0].email}):`, res.rows[0].is_admin);
    }
  }

  // Check policies
  const p = await c.query(
    `SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename = 'admin_provider_keys' ORDER BY cmd`
  );
  console.log('\nPolicies on admin_provider_keys:');
  for (const row of p.rows) {
    console.log(`  ${row.cmd}: ${row.policyname}`);
  }

  await c.end();
}

check().catch(e => console.error('Error:', e.message));
