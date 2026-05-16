'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/lib/AuthProvider';
import { supabase } from '@/src/lib/supabase';
import { Toaster, toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0, activeToday: 0, generationsToday: 0,
    apiCallsToday: 0, failedJobs: 0, revenueToday: '$0',
  });
  const [recentGens, setRecentGens] = useState([]);
  const [systemStatus, setSystemStatus] = useState([
    { name: 'Supabase DB', status: 'checking' },
    { name: 'Muapi API', status: 'checking' },
    { name: 'Storage', status: 'checking' },
  ]);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)

      const [
        { count: userCount },
        { count: activeCount, error: activeErr },
        { count: genCount },
        { data: gens, error: genErr },
        { count: failedCount },
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('updated_at', todayStart.toISOString()),
        supabase.from('generations').select('id', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
        supabase.from('generations').select('id, type, prompt, status, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('generations').select('id', { count: 'exact', head: true }).eq('status', 'failed').gte('created_at', todayStart.toISOString()),
      ])

      if (activeErr && activeErr.message?.includes('relation')) {
        setError('Database tables not fully configured. Run setup.')
        return
      }

      setStats({
        totalUsers: userCount || 0,
        activeToday: activeCount || 0,
        generationsToday: genCount || 0,
        apiCallsToday: (genCount || 0) * 2,
        failedJobs: failedCount || 0,
        revenueToday: '$0',
      })
      setRecentGens(gens || [])
      setSystemStatus(prev => prev.map(s => s.name === 'Supabase DB' ? { ...s, status: 'connected' } : s))
      setError('')
    } catch (err) {
      if (err.message?.includes('relation') || err.message?.includes('does not exist')) {
        setError('Database needs setup')
      }
    }

    try {
      await fetch('https://api.muapi.ai/v1/models', { method: 'HEAD' })
      setSystemStatus(prev => prev.map(s => s.name === 'Muapi API' ? { ...s, status: 'connected' } : s))
    } catch {
      setSystemStatus(prev => prev.map(s => s.name === 'Muapi API' ? { ...s, status: 'error' } : s))
    }

    try {
      const { data: buckets } = await supabase.storage.listBuckets()
      setSystemStatus(prev => prev.map(s => s.name === 'Storage' ? { ...s, status: buckets ? 'connected' : 'error' } : s))
    } catch {
      setSystemStatus(prev => prev.map(s => s.name === 'Storage' ? { ...s, status: 'error' } : s))
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/admin/login'); return; }
    fetchStats();
    const interval = setInterval(fetchStats, 15_000);
    return () => clearInterval(interval);
  }, [user, authLoading, router, fetchStats]);

  if (authLoading) return <div style={{ color: '#9CA3AF', textAlign: 'center', padding: 48 }}>Loading...</div>;
  if (!user) return null;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, change: `${stats.activeToday} active today` },
    { label: 'Active Today', value: stats.activeToday, change: 'past 24h' },
    { label: 'Generations Today', value: stats.generationsToday, change: 'past 24h' },
    { label: 'API Calls Today', value: stats.apiCallsToday, change: 'estimated' },
    { label: 'Failed Jobs', value: stats.failedJobs, change: stats.failedJobs > 0 ? 'Needs attention' : '0' },
    { label: 'Revenue Today', value: stats.revenueToday, change: 'Stripe not connected' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Toaster position="top-center" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#F9FAFB' }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchStats} style={{ padding: '6px 14px', fontSize: 12, background: 'rgba(124,58,237,0.15)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, cursor: 'pointer' }}>
            Refresh
          </button>
          <button onClick={async () => { await signOut(); router.replace('/admin/login'); }}
            style={{ padding: '6px 14px', fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 12, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ padding: 16, borderRadius: 12, background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#F9FAFB', marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.label === 'Failed Jobs' && s.value > 0 ? '#ef4444' : '#6B7280', marginTop: 2 }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <div style={{ padding: 20, borderRadius: 12, background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB', marginBottom: 12 }}>
            Latest Generations ({recentGens.length})
            <span style={{ fontSize: 11, fontWeight: 400, color: '#6B7280', marginLeft: 8 }}>auto-refreshes every 15s</span>
          </h3>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {recentGens.length === 0 ? (
              <div style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: 24 }}>No generations yet</div>
            ) : (
              recentGens.map((g, i) => (
                <div key={g.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: g.status === 'completed' ? '#22c55e' : g.status === 'failed' ? '#ef4444' : '#f59e0b' }} />
                    <span style={{ fontSize: 12, color: '#9CA3AF', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {g.prompt || g.type || 'Generation'}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#6B7280' }}>{new Date(g.created_at).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB', marginBottom: 12 }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {systemStatus.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>{s.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 4,
                    background: s.status === 'connected' ? '#22c55e' : s.status === 'error' ? '#ef4444' : s.status === 'disconnected' ? '#6b7280' : '#f59e0b',
                    animation: s.status === 'checking' ? 'pulse 1.5s infinite' : 'none',
                  }} />
                  <span style={{
                    fontSize: 12,
                    color: s.status === 'connected' ? '#22c55e' : s.status === 'error' ? '#ef4444' : s.status === 'disconnected' ? '#6b7280' : '#f59e0b',
                  }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
