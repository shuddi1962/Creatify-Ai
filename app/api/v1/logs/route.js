import { NextResponse } from 'next/server'
import { getRecentLogs } from '@/lib/log'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '100')
  return NextResponse.json({ logs: getRecentLogs(limit) })
}
