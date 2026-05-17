// Run: node supabase/scripts/bootstrap.js
// You need your Supabase database password from Dashboard > Settings > Database

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'xuhsjvipmwzpmsbpjpgq';
const POOLER_HOST = 'aws-1-eu-central-1.pooler.supabase.com';

async function bootstrap() {
  const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.argv[2];
  if (!dbPassword) {
    console.log('\n[ERROR] Database password required.');
    console.log('   Get it from: Supabase Dashboard > Project Settings > Database');
    console.log('\n   Run with: node supabase/scripts/bootstrap.js YOUR_DB_PASSWORD');
    console.log('   Or set:    $env:SUPABASE_DB_PASSWORD = "your-password"; node supabase/scripts/bootstrap.js\n');
    process.exit(1);
  }

  const pool = new Pool({
    user: `postgres.${PROJECT_REF}`,
    password: dbPassword,
    host: POOLER_HOST,
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const test = await pool.query('SELECT 1 AS connected');
    console.log('[OK] Connected to database');

    const migrations = [
      { file: '007_new_tables.sql', name: 'New tables (content_ideas, bulk_jobs, characters, etc.)' },
      { file: '008_complete_infrastructure.sql', name: 'Complete infrastructure (workflows, agents, media, etc.)' },
    ];

    for (const m of migrations) {
      const filePath = path.join(__dirname, '..', 'migrations', m.file);
      if (!fs.existsSync(filePath)) {
        console.log(`[WARN] ${m.file} not found, skipping`);
        continue;
      }
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`[RUN] Running: ${m.name}...`);
      await pool.query(sql);
      console.log(`[OK] ${m.name} applied`);
    }

    console.log('\n[DONE] All migrations applied successfully!\n');
    await pool.end();
  } catch (err) {
    console.error(`\n[ERROR] ${err.message}\n`);
    await pool.end();
    process.exit(1);
  }
}

bootstrap();
