import { NextResponse } from 'next/server';

const LOCAL_API_PREFIXES = [
  '/api/v1/scrape',
  '/api/v1/notifications',
  '/api/v1/proxy',
  '/api/v1/content-ideas',
  '/api/admin',
];

export function middleware(request) {
    const url = request.nextUrl;
    const pathname = url.pathname;

    // Skip local API routes — these are handled by Next.js route handlers
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
        return NextResponse.rewrite(targetUrl);
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
