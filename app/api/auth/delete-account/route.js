import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/log'
import { writeAuditLog } from '@/lib/audit'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = SUPABASE_URL && SERVICE_KEY ? createClient(SUPABASE_URL, SERVICE_KEY) : null

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const tables = [
      'generations', 'api_keys', 'uploads', 'pending_jobs',
      'saved_ideas', 'content_calendar', 'bulk_jobs', 'bulk_job_items',
      'characters', 'worlds', 'media_library', 'scheduled_posts',
      'connected_accounts', 'notifications', 'user_settings',
      'credit_transactions', 'subscriptions', 'agent_logs', 'workflows',
      'workflow_runs',
    ]
    for (const table of tables) {
      await supabase.from(table).delete().eq('user_id', user.id).maybeSingle()
    }
    await supabase.from('profiles').delete().eq('id', user.id).maybeSingle()
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
    if (deleteError) throw deleteError
    await writeAuditLog({ adminId: user.id, action: 'account_deleted', targetType: 'user', targetId: user.id })
    logger.info('Account deleted', { userId: user.id })
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('Account deletion failed', { error: err.message })
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
