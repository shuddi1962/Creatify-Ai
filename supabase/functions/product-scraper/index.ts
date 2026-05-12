import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { url } = await req.json()
  if (!url) return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    // Check cache first
    const { data: cached } = await supabase
      .from('scraped_urls')
      .select('*')
      .eq('url', url)
      .single()

    if (cached && Date.now() - new Date(cached.scraped_at).getTime() < 3600000) {
      return new Response(JSON.stringify({ data: cached, source: 'cache' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Fetch URL metadata
    const fetchRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CreatifyBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    })

    const html = await fetchRes.text()
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || ''
    const desc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1]
      || html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i)?.[1]
      || ''
    const ogImage = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
      || html.match(/<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/i)?.[1]
      || ''
    const ogType = html.match(/<meta[^>]+property="og:type"[^>]+content="([^"]+)"/i)?.[1] || 'website'
    const domain = new URL(url).hostname

    // Extract product data from common e-commerce patterns
    const price = html.match(/["']price["']\s*:\s*["']?([\d.]+)/i)?.[1]
      || html.match(/<meta[^>]+property="product:price:amount"[^>]+content="([^"]+)"/i)?.[1]
      || ''
    const currency = html.match(/["']priceCurrency["']\s*:\s*["']?(\w+)["']?/i)?.[1]
      || html.match(/<meta[^>]+property="product:price:currency"[^>]+content="([^"]+)"/i)?.[1]
      || 'USD'
    const images = [...html.matchAll(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/gi)].map(m => m[1])
    const availability = html.match(/["']availability["']\s*:\s*["']?([^"']+)["']?/i)?.[1]
      || html.match(/<meta[^>]+property="product:availability"[^>]+content="([^"]+)"/i)?.[1]
      || ''

    const productData: Record<string, any> = {}
    if (price) productData.price = price
    if (currency) productData.currency = currency
    if (images.length) productData.images = images
    if (availability) productData.availability = availability

    const scraped = {
      url, title, description: desc, og_image: ogImage,
      og_type: ogType, domain, product_data: productData,
      scraped_at: new Date().toISOString(),
    }

    // Save to cache (upsert)
    await supabase.from('scraped_urls').upsert(scraped, { onConflict: 'url' })

    return new Response(JSON.stringify({ data: scraped, source: 'fresh' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
