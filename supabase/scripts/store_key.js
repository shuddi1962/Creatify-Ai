const { Client } = require('pg');

const PWD = process.argv[2] || '07039Suco2004$#';
const KEY = process.argv[3] || '';

async function run() {
  const c = new Client({
    user: 'postgres.xuhsjvipmwzpmsbpjpgq',
    password: PWD,
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  await c.connect();

  // Store Muapi key
  await c.query('DELETE FROM admin_provider_keys WHERE provider = $1', ['muapi']);
  await c.query(
    'INSERT INTO admin_provider_keys (provider, encrypted_key, label, is_active, is_default) VALUES ($1, $2, $3, $4, $5)',
    ['muapi', KEY, 'admin-shared', true, true]
  );
  console.log('Muapi key stored as admin shared key (default+active)');

  const r = await c.query('SELECT provider, is_default, is_active FROM admin_provider_keys WHERE provider = $1', ['muapi']);
  console.log('Verified:', JSON.stringify(r.rows[0]));

  await c.end();
  console.log('Done');
}

run().catch(e => console.error('Error:', e.message));
