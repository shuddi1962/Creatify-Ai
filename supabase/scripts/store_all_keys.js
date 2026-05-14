const { Client } = require('pg');

const PWD = process.argv[2] || '07039Suco2004$#';

// Keys are passed via environment variables for security
// Usage: PROVIDER_KEYS='{"openrouter":"sk-...","replicate":"r8_..."}' node script.js
const PROVIDER_KEYS = JSON.parse(process.env.PROVIDER_KEYS || '{}');

const DEFAULTS = [
  { provider: 'openrouter', label: 'primary', is_default: true },
  { provider: 'replicate', label: 'primary', is_default: true },
  { provider: 'kie-ai', label: 'primary', is_default: true },
  { provider: 'huggingface', label: 'primary', is_default: true },
];

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
  console.log('Connected');

  for (const d of DEFAULTS) {
    const key = PROVIDER_KEYS[d.provider];
    if (!key) { console.log(`Skipping ${d.provider} (no key provided)`); continue; }
    await c.query('DELETE FROM admin_provider_keys WHERE provider = $1', [d.provider]);
    await c.query(
      'INSERT INTO admin_provider_keys (provider, encrypted_key, label, is_active, is_default) VALUES ($1, $2, $3, true, $4)',
      [d.provider, key, d.label, d.is_default]
    );
    console.log(`Stored ${d.provider} key`);
  }

  const r = await c.query('SELECT provider, is_active, is_default FROM admin_provider_keys ORDER BY provider');
  console.log('\nAll keys:');
  for (const row of r.rows) {
    console.log(`  ${row.provider} | active=${row.is_active} | default=${row.is_default}`);
  }

  await c.end();
  console.log('\nDone');
}

run().catch(e => console.error('Error:', e.message));
