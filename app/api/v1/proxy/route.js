import { NextResponse } from 'next/server';

const PROVIDERS = {
  'kie-ai': { base: 'https://api.kie.ai/v1' },
  'openrouter': { base: 'https://openrouter.ai/api/v1' },
  'elevenlabs': { base: 'https://api.elevenlabs.io/v1' },
  'tavily': { base: 'https://api.tavily.com' },
  'serpapi': { base: 'https://serpapi.com' },
};

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { provider, endpoint, method = 'POST', data } = body;

  if (!provider || !endpoint) {
    return NextResponse.json({ error: 'Missing provider or endpoint' }, { status: 400 });
  }

  const config = PROVIDERS[provider];
  if (!config) return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });

  try {
    const apiKey = process.env[`${provider.toUpperCase().replace(/-/g, '_')}_API_KEY`]
      || process.env[`NEXT_PUBLIC_${provider.toUpperCase().replace(/-/g, '_')}_API_KEY`]
      || '';

    const headers = { 'Content-Type': 'application/json' };
    
    switch (provider) {
      case 'kie-ai':
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['x-api-key'] = apiKey;
        break;
      case 'openrouter':
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['HTTP-Referer'] = 'https://creatify.ai';
        headers['X-Title'] = 'Creatify AI';
        break;
      case 'elevenlabs':
        headers['xi-api-key'] = apiKey;
        break;
      case 'tavily':
        // API key goes in body for Tavily
        break;
      case 'serpapi':
        // API key goes in query params
        break;
    }

    let url = `${config.base}${endpoint}`;
    let fetchData = data;

    if (provider === 'tavily' && apiKey) {
      fetchData = { ...data, api_key: apiKey };
    } else if (provider === 'serpapi') {
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}api_key=${apiKey}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(fetchData) : undefined,
      signal: AbortSignal.timeout(30000),
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');
  const endpoint = searchParams.get('endpoint');

  return POST(request);
}
