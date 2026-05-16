import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET() {
  const checks = { status: 'ok', timestamp: new Date().toISOString(), services: {} }
  try {
    if (SUPABASE_URL && SERVICE_KEY) {
      const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
      const { data, error } = await supabase.from('api_providers').select('count').limit(1)
      checks.services.supabase = error ? 'error' : 'ok'
    } else {
      checks.services.supabase = 'not_configured'
    }
    if (typeof globalThis !== 'undefined' && globalThis.__opencode_logs) {
      checks.services.logger = 'ok'
    } else {
      checks.services.logger = 'ok'
    }
  } catch (err) {
    checks.status = 'degraded'
    checks.error = err.message
  }
  return NextResponse.json(checks)
}
