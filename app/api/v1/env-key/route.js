import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.MUAPI_API_KEY || process.env.NEXT_PUBLIC_MUAPI_API_KEY || ''
  return NextResponse.json({ key })
}
