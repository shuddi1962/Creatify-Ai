'use client'

import { useState, useEffect, useCallback } from 'react'
import { LayoutDashboard, Image, Video, Music, Folder, Settings, User, Zap, Loader2, RefreshCw, Activity, TrendingUp, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabase'

export default function DashboardPage() {
  const [stats, setStats] = useState({ images: 0, videos: 0, audio: 0, total: 0, today: 0 })
  const [credits, setCredits] = useState({ plan: 'free', used: 0, limit: 100 })
  const [recentGens, setRecentGens] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setError('')
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { setLoading(false); return }
      setUser(session.user)

      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      // Merge Supabase generations + localStorage history
      let supabaseGens = [], localMuapi = [], localVideo = [], localLipsync = []
      try {
        const { data: gens } = await supabase
          .from('generations')
          .select('type, created_at, prompt, status')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
        supabaseGens = gens || []
      } catch {}

      try { localMuapi = JSON.parse(localStorage.getItem('muapi_history') || '[]') } catch {}
      try { localVideo = JSON.parse(localStorage.getItem('video_history') || '[]') } catch {}
      try { localLipsync = JSON.parse(localStorage.getItem('lipsync_history') || '[]') } catch {}

      const localMuapiNorm = localMuapi.map(g => ({ ...g, type: g.type || 'image', prompt: g.prompt || '', status: g.status || 'completed' }))
      const localVideoNorm = localVideo.map(g => ({ ...g, type: g.type || 'video', prompt: g.prompt || '', status: g.status || 'completed' }))
      const localLipsyncNorm = localLipsync.map(g => ({ ...g, type: g.type || 'lipsync', prompt: g.prompt || '', status: g.status || 'completed' }))

      const allGens = [...supabaseGens, ...localMuapiNorm, ...localVideoNorm, ...localLipsyncNorm]
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))

      const images = allGens.filter(g => ['image', 'i2i'].includes(g.type)).length
      const videos = allGens.filter(g => ['video', 'i2v', 'v2v'].includes(g.type)).length
      const audio = allGens.filter(g => ['audio', 'lipsync'].includes(g.type)).length
      const today = allGens.filter(g => new Date(g.created_at || 0) >= todayStart).length

      setStats({ images, videos, audio, total: allGens.length, today })
      setRecentGens(allGens.slice(0, 10))

      // Credits from localStorage + subscriptions
      let plan = 'free', used = 0
      try { plan = localStorage.getItem('plan_tier') || 'free' } catch {}
      try { used = parseInt(localStorage.getItem('credits_used') || '0') } catch {}
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan_tier, credits_used_monthly')
        .eq('user_id', session.user.id)
        .maybeSingle()
      if (sub) { plan = sub.plan_tier || plan; used = sub.credits_used_monthly || used }
      const limits = { free: 100, plus: 45000, ultra: 150000, business: 600000 }
      setCredits({ plan, used, limit: limits[plan] || 100 })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const poll = setInterval(fetchData, 15_000)
    return () => clearInterval(poll)
  }, [fetchData])

  const cards = [
    { icon: Image, label: 'Images', value: stats.images, href: '/studio/media/images', color: '#a78bfa' },
    { icon: Video, label: 'Videos', value: stats.videos, href: '/studio/media/videos', color: '#f472b6' },
    { icon: Music, label: 'Audio', value: stats.audio, href: '/studio/media/audio', color: '#34d399' },
    { icon: Folder, label: 'Total Assets', value: stats.total, href: '/studio/media/all', color: '#fbbf24' },
  ]

  const links = [
    { icon: User, label: 'Manage Profile', href: '/studio/settings', desc: 'Update your name, email, and avatar' },
    { icon: Settings, label: 'Settings', href: '/studio/settings', desc: 'API keys, theme, and preferences' },
    { icon: Folder, label: 'Media Library', href: '/studio/media/all', desc: 'Browse all your generated assets' },
    { icon: Zap, label: 'Pricing & Credits', href: '/studio/pricing', desc: 'View your plan and usage' },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
        <Loader2 size={24} style={{ animation: 'spin 700ms linear infinite', color: 'var(--text-muted)' }} />
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Sign in to view your dashboard</h2>
          <Link href="/studio/signup" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 10, background: '#7C3AED', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #00C896, #00b380)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={24} style={{ color: '#000' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Dashboard</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{user?.email || 'Welcome back'}</p>
            </div>
          </div>
          <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 12, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Credit bar */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <CreditCard size={18} style={{ color: '#7C3AED' }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{credits.plan.charAt(0).toUpperCase() + credits.plan.slice(1)} Plan</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{credits.used} / {credits.limit} credits used</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (credits.used / credits.limit) * 100)}%`, height: '100%', background: credits.used > credits.limit * 0.8 ? '#ef4444' : '#7C3AED', borderRadius: 100, transition: 'width 500ms ease' }} />
            </div>
          </div>
          <Link href="/studio/pricing" style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {credits.used >= credits.limit ? 'Upgrade Plan' : 'Manage Plan'}
          </Link>
        </div>

        {/* Activity stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px' }}>
            <Activity size={16} style={{ color: '#22c55e' }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.today}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Generated Today</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px' }}>
            <TrendingUp size={16} style={{ color: '#7C3AED' }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.total}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>All Time</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px' }}>
            <CreditCard size={16} style={{ color: '#f59e0b' }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{credits.plan}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Current Plan</div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
          {cards.map(c => (
            <Link key={c.label} href={c.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 20, transition: 'all 200ms' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <c.icon size={18} style={{ color: c.color }} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{c.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent activity */}
        {recentGens.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Recent Activity</h2>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden' }}>
              {recentGens.map((gen, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: i < recentGens.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {gen.type?.startsWith('image') || gen.type === 'i2i' ? <Image size={14} style={{ color: '#a78bfa' }} /> :
                       gen.type?.startsWith('video') || gen.type === 'i2v' || gen.type === 'v2v' ? <Video size={14} style={{ color: '#f472b6' }} /> :
                       <Music size={14} style={{ color: '#34d399' }} />}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{gen.type?.replace(/-/g, ' ') || 'Generation'}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {new Date(gen.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Quick Links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
          {links.map(l => (
            <Link key={l.label} href={l.href} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '14px 16px', transition: 'all 200ms' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <l.icon size={16} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{l.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
