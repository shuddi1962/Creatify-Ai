import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const PLAN_LIMITS = {
  free: { daily: 20, monthly: 100, ratePerMin: 5 },
  plus: { daily: 1500, monthly: 45000, ratePerMin: 30 },
  ultra: { daily: 5000, monthly: 150000, ratePerMin: 60 },
  business: { daily: 20000, monthly: 600000, ratePerMin: 120 },
}

export async function checkUserCredits(userId) {
  if (!SUPABASE_URL || !SERVICE_KEY) return { allowed: true, reason: 'no_db' }
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan_tier, credits_used_monthly, credits_reset_at')
      .eq('user_id', userId)
      .maybeSingle()
    if (!sub) return { allowed: true, plan: 'free', daily: 20 }
    const limits = PLAN_LIMITS[sub.plan_tier] || PLAN_LIMITS.free
    if (sub.credits_used_monthly >= limits.monthly) {
      return { allowed: false, reason: 'Monthly credit limit reached', limit: limits.monthly, used: sub.credits_used_monthly, plan: sub.plan_tier }
    }
    return { allowed: true, plan: sub.plan_tier, daily: limits.daily, monthly: limits.monthly, used: sub.credits_used_monthly || 0 }
  } catch {
    return { allowed: true, reason: 'check_failed' }
  }
}

export async function incrementCreditsUsed(userId, amount = 1) {
  if (!SUPABASE_URL || !SERVICE_KEY) return
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
    await supabase.rpc('increment_credits_used', { p_user_id: userId, p_amount: amount })
  } catch { /* silently fail */ }
}

export { PLAN_LIMITS }
