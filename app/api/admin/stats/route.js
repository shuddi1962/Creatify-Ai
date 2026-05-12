import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: admin } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [usersCount, activeToday, generationsToday, apiCalls, failedCount, revenue] = await Promise.all([
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }),
    supabase.from('generations').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 86400000).toISOString()),
    supabase.from('generations').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 86400000).toISOString()),
    supabase.from('generations').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('generations').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
    supabase.from('credit_transactions').select('amount').eq('type', 'purchase').gte('created_at', new Date(Date.now() - 86400000).toISOString()),
  ]);

  return NextResponse.json({
    stats: {
      totalUsers: usersCount.count || 0,
      activeToday: activeToday.count || 0,
      generationsToday: generationsToday.count || 0,
      apiCallsToday: apiCalls.count || 0,
      failedJobs: failedCount.count || 0,
      revenueToday: revenue.data?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0,
    }
  });
}
