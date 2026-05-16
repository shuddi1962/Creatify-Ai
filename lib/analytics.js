export function trackEvent({ userId, event, properties }) {
  if (typeof globalThis !== 'undefined') {
    if (!globalThis.__analytics) globalThis.__analytics = []
    globalThis.__analytics.push({ timestamp: new Date().toISOString(), userId, event, properties, url: typeof window !== 'undefined' ? window.location.pathname : '' })
  }
  try {
    const body = { event, properties, userId, url: typeof window !== 'undefined' ? window.location.pathname : '', timestamp: new Date().toISOString() }
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/v1/analytics/track', JSON.stringify(body))
    }
  } catch { /* silently fail */ }
}

export function trackPageView(userId) {
  trackEvent({ userId, event: 'page_view', properties: { path: typeof window !== 'undefined' ? window.location.pathname : '' } })
}

export function trackGeneration(userId, type, model) {
  trackEvent({ userId, event: 'generation', properties: { type, model } })
}
