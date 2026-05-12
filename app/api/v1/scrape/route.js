import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { url } = body;
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  try {
    const fetchRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CreatifyBot/1.0; +https://creatify.ai)' },
      signal: AbortSignal.timeout(15000),
    });
    const html = await fetchRes.text();

    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || '';
    const desc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1]
      || html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i)?.[1]
      || html.match(/<meta[^>]+property="twitter:description"[^>]+content="([^"]+)"/i)?.[1]
      || '';
    const ogImage = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
      || html.match(/<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/i)?.[1]
      || '';
    const ogType = html.match(/<meta[^>]+property="og:type"[^>]+content="([^"]+)"/i)?.[1] || 'website';
    const domain = new URL(url).hostname;

    // Product data extraction
    const price = html.match(/["']price["']\s*:\s*["']?([\d.]+)/i)?.[1]
      || html.match(/<meta[^>]+property="product:price:amount"[^>]+content="([^"]+)"/i)?.[1]
      || html.match(/\$\s*([\d,]+\.?\d*)/)?.[1]
      || '';
    const currency = html.match(/["']priceCurrency["']\s*:\s*["']?(\w+)["']?/i)?.[1]
      || html.match(/<meta[^>]+property="product:price:currency"[^>]+content="([^"]+)"/i)?.[1]
      || 'USD';
    const images = [...html.matchAll(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/gi)].map(m => m[1]);
    const siteName = html.match(/<meta[^>]+property="og:site_name"[^>]+content="([^"]+)"/i)?.[1] || domain;

    const productData = {};
    if (price) productData.price = price.replace(/,/g, '');
    if (currency) productData.currency = currency;
    if (images.length) productData.images = images;
    if (siteName) productData.site_name = siteName;

    return NextResponse.json({
      data: {
        url, title, description: desc, og_image: ogImage,
        og_type: ogType, domain, product_data: productData,
        scraped_at: new Date().toISOString(),
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });

  try {
    const fetchRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CreatifyBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
    const html = await fetchRes.text();
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || url;

    return NextResponse.json({ data: { url, title } });
  } catch (err) {
    return NextResponse.json({ data: { url, title: url } });
  }
}
