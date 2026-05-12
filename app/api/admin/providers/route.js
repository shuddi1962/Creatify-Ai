import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function checkAdmin(authHeader) {
  if (!authHeader) return null;
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) return null;
  const { data: admin } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
  return admin ? user : null;
}

export async function GET(request) {
  const user = await checkAdmin(request.headers.get('Authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase.from('api_providers').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request) {
  const user = await checkAdmin(request.headers.get('Authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, display_name, base_url, docs_url, supported_models } = body;

  const { error } = await supabase.from('api_providers').insert({
    name, display_name, base_url, docs_url,
    supported_models: supported_models || [],
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(request) {
  const user = await checkAdmin(request.headers.get('Authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, display_name, base_url, is_active, supported_models } = body;

  const updates = {};
  if (display_name !== undefined) updates.display_name = display_name;
  if (base_url !== undefined) updates.base_url = base_url;
  if (is_active !== undefined) updates.is_active = is_active;
  if (supported_models !== undefined) updates.supported_models = supported_models;

  const { error } = await supabase.from('api_providers').update(updates).eq('name', name);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const user = await checkAdmin(request.headers.get('Authorization'));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });

  const { error } = await supabase.from('api_providers').delete().eq('name', name);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
