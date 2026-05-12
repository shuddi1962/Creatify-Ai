const { Client } = require('pg');

const PWD = process.argv[2] || '07039Suco2004$#';
const PROJECT = 'xuhsjvipmwzpmsbpjpgq';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1aHNqdmlwbXd6cG1zYnBqcGdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMwMTY1NiwiZXhwIjoyMDkzODc3NjU2fQ.3xVf877q81kPq1BVcaqcBegs8NjEd5oCqbmsrhGMhug';
const SUPABASE_URL = 'https://xuhsjvipmwzpmsbpjpgq.supabase.co';

async function fix() {
  const client = new Client({
    user: `postgres.${PROJECT}`,
    password: PWD,
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  await client.connect();
  console.log('Connected to database');

  // Fix RLS: allow authenticated users to read their own admin_roles row
  await client.query(`
    DROP POLICY IF EXISTS "Admin roles manage" ON admin_roles;
    CREATE POLICY "Users can read own admin role" ON admin_roles
      FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Admins can manage all" ON admin_roles
      FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
      );
  `);
  console.log('Fixed admin_roles RLS policies');

  // Get the user
  const { rows: users } = await client.query('SELECT id, email FROM auth.users LIMIT 1');
  if (!users.length) { console.log('No users found'); return; }
  
  const user = users[0];
  console.log(`User found: ${user.email} (${user.id})`);

  // Set app_metadata via Supabase Auth Admin API
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      user_metadata: { admin_role: 'super_admin' },
      app_metadata: {
        admin_role: 'super_admin',
        role: 'super_admin',
        provider: 'email',
      },
    }),
  });
  
  if (res.ok) {
    console.log('Admin metadata set on user account');
  } else {
    const err = await res.text();
    console.log(`Auth API: ${res.status} - ${err.slice(0, 100)}`);
  }

  await client.end();
  console.log('\nDONE! Now do:');
  console.log('1. Sign out of the app completely');
  console.log('2. Sign back in');
  console.log('3. Visit /admin/dashboard');
}

fix().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
