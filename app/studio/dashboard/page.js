'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, Image, Video, Music, Folder, Settings, User, Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabase'

export default function DashboardPage() {
  const [stats, setStats] = useState({ images: 0, videos: 0, audio: 0 })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)

        const { data: gens } = await supabase.from('generations').select('type')
        if (gens) {
          setStats({
            images: gens.filter(g => ['image', 'i2i'].includes(g.type)).length,
            videos: gens.filter(g => ['video', 'i2v', 'v2v'].includes(g.type)).length,
            audio: gens.filter(g => ['audio', 'lipsync'].includes(g.type)).length,
          })
        }
      } catch {} finally { setLoading(false) }
    })()
  }, [])

  const cards = [
    { icon: Image, label: 'Images', value: stats.images, href: '/studio/media/images', color: '#a78bfa' },
    { icon: Video, label: 'Videos', value: stats.videos, href: '/studio/media/videos', color: '#f472b6' },
    { icon: Music, label: 'Audio', value: stats.audio, href: '/studio/media/audio', color: '#34d399' },
    { icon: Folder, label: 'All Assets', value: stats.images + stats.videos + stats.audio, href: '/studio/media/all', color: '#fbbf24' },
  ]

  const links = [
    { icon: User, label: 'Manage Profile', href: '/studio/settings', desc: 'Update your name, email, and avatar' },
    { icon: Settings, label: 'Settings', href: '/studio/settings', desc: 'API keys, theme, and preferences' },
    { icon: Folder, label: 'Media Library', href: '/studio/media/all', desc: 'Browse all your generated assets' },
    { icon: Zap, label: 'Pricing & Credits', href: '/studio/pricing', desc: 'View your plan and usage' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        <div className="flex items-center gap-4 mb-8">
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #00C896, #00b380)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={24} style={{ color: '#000' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user?.email || 'Welcome back'}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
          {cards.map(c => (
            <Link key={c.label} href={c.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 20, transition: 'all 200ms' }}
                className="hover-lift"
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

        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Quick Links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
          {links.map(l => (
            <Link key={l.label} href={l.href} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '14px 16px', transition: 'all 200ms' }}
                className="hover-lift-sm"
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
      <style jsx>{`
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .hover-lift-sm:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
      `}</style>
    </div>
  )
}
