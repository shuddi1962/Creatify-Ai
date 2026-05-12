import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Cache to avoid DB calls on every request
let cache = {};
let cacheTime = 0;
const CACHE_TTL = 60000; // 1 minute

export async function GET(request) {
  const provider = request.nextUrl.searchParams.get('provider') || 'muapi';

  try {
    // Check cache first
    if (cache[provider] && Date.now() - cacheTime < CACHE_TTL) {
      return NextResponse.json({ key: cache[provider], provider, cached: true });
    }

    const { data, error } = await supabase
      .from('admin_provider_keys')
      .select('encrypted_key')
      .eq('provider', provider)
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      cache[provider] = null;
      cacheTime = Date.now();
      return NextResponse.json({ key: null, provider });
    }

    cache[provider] = data.encrypted_key;
    cacheTime = Date.now();
    return NextResponse.json({ key: data.encrypted_key, provider });
  } catch (err) {
    return NextResponse.json({ key: null, provider, error: err.message }, { status: 500 });
  }
}
