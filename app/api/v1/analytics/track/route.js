import { NextResponse } from 'next/server'
import { logger } from '@/lib/log'

const events = []
const MAX_EVENTS = 1000

export async function POST(request) {
  try {
    const body = await request.json()
    events.push({ ...body, receivedAt: new Date().toISOString() })
    if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS)
    logger.debug('Analytics event', { event: body.event })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ events: events.slice(-100), count: events.length })
}
