import { NextResponse } from 'next/server';

const LOCAL_API_PREFIXES = [
  '/api/v1/scrape',
  '/api/v1/notifications',
  '/api/v1/proxy',
  '/api/v1/content-ideas',
  '/api/v1/shared-key',
  '/api/v1/models',
  '/api/admin',
];

// Cache shared key
let sharedKeyCache = null;
let sharedKeyTime = 0;
const SHARED_KEY_TTL = 60000;

async function getSharedKey() {
  if (sharedKeyCache && Date.now() - sharedKeyTime < SHARED_KEY_TTL) {
    return sharedKeyCache;
  }
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/admin_provider_keys?select=encrypted_key&provider=eq.muapi&is_active=eq.true&limit=1`,
        { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.[0]?.encrypted_key) {
          sharedKeyCache = data[0].encrypted_key;
          sharedKeyTime = Date.now();
          return sharedKeyCache;
        }
      }
    }
  } catch { /* db unavailable */ }
  return null;
}

function getApiKey(request) {
  const headerKey = request.headers.get('x-api-key');
  if (headerKey) return headerKey;
  const cookieKey = request.cookies.get('muapi_key')?.value;
  return cookieKey || null;
}

export async function middleware(request) {
    const url = request.nextUrl;
    const pathname = url.pathname;

    // Skip local API routes
    for (const prefix of LOCAL_API_PREFIXES) {
      if (pathname === prefix || pathname.startsWith(prefix + '/')) {
        return NextResponse.next();
      }
    }

    // Proxy to Muapi for generation endpoints
    const isMuApi = pathname.startsWith('/api/workflow') ||
                    pathname.startsWith('/api/app') ||
                    pathname.startsWith('/api/v1') ||
                    pathname.startsWith('/api/agents');

    if (isMuApi) {
        const targetUrl = new URL(pathname + url.search, 'https://api.muapi.ai');
        const requestHeaders = new Headers(request.headers);
        
        // Try user's key first, then shared admin key
        let apiKey = getApiKey(request);
        if (!apiKey) {
          apiKey = await getSharedKey();
        }
        
        if (apiKey) {
          requestHeaders.set('x-api-key', apiKey);
        }
        
        requestHeaders.delete('host');
        requestHeaders.delete('connection');
        requestHeaders.delete('cookie');

        const response = await fetch(targetUrl, {
          headers: requestHeaders,
          method: request.method,
          body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
        });

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/workflow/:path*',
        '/api/app/:path*',
        '/api/v1/:path*',
        '/api/agents/:path*',
        '/api/admin/:path*',
    ],
};
