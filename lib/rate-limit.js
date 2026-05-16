const store = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, window] of store) {
    for (const [route, entry] of window) {
      if (entry.resetAt <= now) window.delete(route);
    }
    if (window.size === 0) store.delete(key);
  }
}, 60_000);

export function rateLimit({ interval = 60, max = 30, key = 'global' } = {}) {
  const now = Date.now();
  if (!store.has(key)) store.set(key, new Map());
  const userWindow = store.get(key);

  const route = arguments[1] || 'default';
  let entry = userWindow.get(route);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + interval * 1000 };
    userWindow.set(route, entry);
  }

  entry.count++;
  const remaining = Math.max(0, max - entry.count);
  const reset = entry.resetAt;

  return {
    success: entry.count <= max,
    remaining,
    resetAt: reset,
    retryAfter: Math.ceil((reset - now) / 1000),
  };
}

export function rateLimitMiddleware(max = 30, interval = 60) {
  return async (request, handler) => {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'anonymous';
    const result = rateLimit({ interval, max, key: ip }, request.nextUrl.pathname);
    if (!result.success) {
      return new Response(JSON.stringify({
        error: 'Too many requests',
        retryAfter: result.retryAfter,
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.retryAfter),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(result.resetAt),
        },
      });
    }
    return handler(request);
  };
}
