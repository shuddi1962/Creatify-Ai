import { NextResponse } from 'next/server';

const PROVIDER_CONFIGS = {
  'muapi': {
    base: 'https://api.muapi.ai',
    auth: (key) => ({ 'x-api-key': key }),
  },
};

async function getProviderKey(provider) {
  // 1. Check environment variables first
  const envKey = process.env[`${provider.toUpperCase().replace(/-/g, '_')}_API_KEY`]
    || process.env[`NEXT_PUBLIC_${provider.toUpperCase().replace(/-/g, '_')}_API_KEY`];
  if (envKey) return envKey;

  // 2. Check Supabase admin_provider_keys table using service role key (bypasses RLS)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && serviceKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/admin_provider_keys?select=encrypted_key&provider=eq.${provider}&is_active=eq.true&limit=1`,
        { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.length > 0 && data[0].encrypted_key) return data[0].encrypted_key;
      }
    } catch { /* db unavailable */ }
  }

  return '';
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { provider, endpoint, method = 'POST', data } = body;
  if (!provider || !endpoint) {
    return NextResponse.json({ error: 'Missing provider or endpoint' }, { status: 400 });
  }

  const config = PROVIDER_CONFIGS[provider];
  if (!config) {
    return NextResponse.json({ error: `Unknown provider '${provider}'. Available: ${Object.keys(PROVIDER_CONFIGS).join(', ')}` }, { status: 400 });
  }

  try {
    const apiKey = await getProviderKey(provider);
    if (!apiKey) {
      return NextResponse.json({
        error: `No API key configured for ${provider}`,
        hint: `Add it in Admin Panel → API Keys, or set ${provider.toUpperCase().replace(/-/g, '_')}_API_KEY in .env`,
      }, { status: 400 });
    }

    const headers = { 'Content-Type': 'application/json', ...config.auth(apiKey) };

    let url = `${config.base}${endpoint}`;
    let fetchData = data;

    if (config.keyInBody) {
      fetchData = { ...data, api_key: apiKey };
    } else if (config.keyInQuery) {
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}${config.keyInQuery}=${apiKey}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(fetchData) : undefined,
      signal: AbortSignal.timeout(30000),
    });

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const result = await response.json();
      return NextResponse.json(result, { status: response.status });
    }
    const text = await response.text();
    return NextResponse.json({ raw: text }, { status: response.status });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  return POST(request);
}
