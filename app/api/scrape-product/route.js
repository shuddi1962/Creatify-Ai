import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

    // Try to fetch the URL and extract basic product info from meta tags
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CreatifyBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error('Failed to fetch URL')

    const html = await response.text()

    // Extract meta tags
    const getMeta = (name) => {
      const regex = new RegExp(`<meta\\s+[^>]*?(?:name|property)=["'](?:(?:og|twitter):)?${name}["'][^>]*?content=["']([^"']+)["']`, 'i')
      const match = html.match(regex)
      return match ? match[1] : ''
    }

    const getTitle = () => {
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      return match ? match[1].trim() : ''
    }

    const product = {
      name: getMeta('title') || getMeta('product:name') || getTitle() || url,
      description: getMeta('description') || getMeta('product:description') || '',
      price: getMeta('product:price:amount') || getMeta('price') || '',
      keyFeatures: [],
      image: getMeta('image') || getMeta('product:image') || '',
    }

    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Failed to scrape product' }, { status: 500 })
  }
}
