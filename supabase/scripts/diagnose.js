const { Client } = require('pg');

async function run() {
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
  console.log('Connected\n');

  // 1. Check policies
  const policies = await c.query(
    `SELECT tablename, policyname, cmd, qual, with_check FROM pg_policies 
     WHERE tablename IN ('admin_provider_keys','api_providers','admin_roles')
     ORDER BY tablename, cmd`
  );
  console.log('=== RLS POLICIES ===');
  for (const p of policies.rows) {
    console.log(`  ${p.tablename} | ${p.policyname} | ${p.cmd} | ${(p.qual||'').slice(0,60)}`);
  }

  // 2. Check providers
  const provs = await c.query('SELECT count(*) as cnt FROM api_providers');
  console.log(`\n=== API PROVIDERS: ${provs.rows[0].cnt} ===`);

  // 3. Check existing keys
  const keys = await c.query('SELECT provider, is_active, is_default, label FROM admin_provider_keys');
  console.log(`\n=== STORED KEYS: ${keys.rows.length} ===`);
  for (const k of keys.rows) {
    console.log(`  ${k.provider} | active=${k.is_active} | default=${k.is_default} | label=${k.label}`);
  }

  // 4. Check table structure
  const cols = await c.query(
    `SELECT column_name, data_type, is_nullable 
     FROM information_schema.columns 
     WHERE table_name='admin_provider_keys' 
     ORDER BY ordinal_position`
  );
  console.log('\n=== ADMIN_PROVIDER_KEYS COLUMNS ===');
  for (const col of cols.rows) {
    console.log(`  ${col.column_name} (${col.data_type}) nullable=${col.is_nullable}`);
  }

  // 5. Test INSERT directly
  console.log('\n=== TEST INSERT ===');
  try {
    await c.query(`INSERT INTO admin_provider_keys (provider, encrypted_key, label) 
                   VALUES ('muapi', 'test_key_123', 'diagnostic') 
                   ON CONFLICT DO NOTHING`);
    console.log('  Direct INSERT works!');
  } catch (e) {
    console.log('  Direct INSERT failed:', e.message);
  }

  // 6. Check FK constraint
  const fk = await c.query(
    `SELECT conname, pg_get_constraintdef(oid) as def
     FROM pg_constraint WHERE conrelid = 'admin_provider_keys'::regclass AND contype = 'f'`
  );
  console.log('\n=== FK CONSTRAINTS ===');
  for (const f of fk.rows) {
    console.log(`  ${f.conname}: ${f.def}`);
  }

  await c.end();
  console.log('\nDone');
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
