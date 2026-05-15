'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  TrendingUp, Bookmark, Calendar, Zap, FileText,
  Search, Image, Layout, ChevronLeft, ChevronRight,
  Lightbulb
} from 'lucide-react'

const IDEAS_NAV = [
  { href: '/studio/ideas', icon: Lightbulb, label: 'Overview', desc: 'All tools' },
  { href: '/studio/ideas/trending', icon: TrendingUp, label: 'Trending Now', desc: 'Daily trends', badge: 'LIVE' },
  { href: '/studio/ideas/saved', icon: Bookmark, label: 'Saved Ideas', desc: 'Your library' },
  { href: '/studio/ideas/calendar', icon: Calendar, label: 'Content Calendar', desc: 'Plan content' },
  { href: '/studio/ideas/hooks', icon: Zap, label: 'Hook Generator', desc: 'Viral hooks' },
  { href: '/studio/ideas/scripts', icon: FileText, label: 'Script Generator', desc: 'Full scripts' },
  { href: '/studio/ideas/competitor', icon: Search, label: 'Competitor Analyzer', desc: 'Spy on niches' },
  { href: '/studio/ideas/thumbnails', icon: Image, label: 'Thumbnails', desc: 'AI thumbnails' },
  { href: '/studio/ideas/storyboard', icon: Layout, label: 'Storyboard Pipeline', desc: 'Script\u2192video', badge: 'NEW' },
]

export default function IdeasSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div style={{
      width: collapsed ? 52 : 220,
      flexShrink: 0,
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 250ms ease',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        padding: collapsed ? '14px 0' : '14px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              Content Ideas
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              9 tools available
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
            flexShrink: 0,
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight size={14} />
            : <ChevronLeft size={14} />}
        </button>
      </div>

      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {IDEAS_NAV.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/studio/ideas' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: collapsed ? '10px 0' : '9px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 10,
                  background: isActive ? 'var(--bg-active)' : 'transparent',
                  borderLeft: isActive
                    ? '3px solid var(--accent-primary)'
                    : '3px solid transparent',
                  transition: 'all 140ms',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
              >
                <item.icon
                  size={18}
                  style={{ color: isActive ? 'var(--accent-primary)' : 'var(--icon-default)', flexShrink: 0 }}
                />
                {!collapsed && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--text-active)' : 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {item.label}
                      {item.badge && (
                        <span style={{
                          fontSize: 8, fontWeight: 700,
                          padding: '1px 5px', borderRadius: 3,
                          background: item.badge === 'LIVE'
                            ? '#22c55e' : 'var(--accent-primary)',
                          color: item.badge === 'LIVE' ? '#fff' : '#000',
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {item.desc}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
