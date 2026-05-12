import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { serviceRoleKey } = body;

  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'Missing serviceRoleKey' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.json({ error: 'Missing SUPABASE_URL in env' }, { status: 500 });
  }

  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations');
  const files = ['008_complete_infrastructure.sql', '007_new_tables.sql', '000_all_in_one.sql'];
  const results = [];

  for (const file of files) {
    const filePath = path.join(migrationPath, file);
    if (!fs.existsSync(filePath)) continue;

    const sql = fs.readFileSync(filePath, 'utf8');
    try {
      const response = await fetch(`${supabaseUrl}/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
        },
        body: JSON.stringify({ query: sql }),
      });

      if (!response.ok) {
        const errText = await response.text();
        results.push({ file, status: 'error', error: errText.slice(0, 200) });
      } else {
        results.push({ file, status: 'success' });
      }
    } catch (err) {
      results.push({ file, status: 'error', error: err.message });
    }
  }

  const allSuccess = results.every(r => r.status === 'success');
  return NextResponse.json({
    success: allSuccess,
    results,
    message: allSuccess ? 'All migrations applied successfully!' : 'Some migrations failed',
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) return NextResponse.json({ authenticated: false });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return NextResponse.json({ authenticated: false });

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: { 'Authorization': `Bearer ${key}`, 'apikey': key },
    });
    return NextResponse.json({ authenticated: response.ok || response.status === 200 });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
