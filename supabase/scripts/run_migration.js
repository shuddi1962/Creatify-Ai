const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const PWD = process.argv[2] || '07039Suco2004$#';
const PROJECT = 'xuhsjvipmwzpmsbpjpgq';

async function main() {
  const client = new Client({
    user: `postgres.${PROJECT}`,
    password: PWD,
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('CONNECTED to database');

    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'migrations', '000_full_setup.sql'),
      'utf8'
    );
    console.log('Running migration...');
    await client.query(sql);
    console.log('ALL TABLES CREATED SUCCESSFULLY');

    // Assign admin role
    await client.query(
      "INSERT INTO admin_roles (user_id, role) SELECT id, 'super_admin' FROM auth.users LIMIT 1 ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin'"
    );
    console.log('ADMIN ROLE ASSIGNED - You can access /admin/dashboard');

    await client.end();
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

main();
