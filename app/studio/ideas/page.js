'use client'
import Link from 'next/link'
import {
  TrendingUp, Bookmark, Calendar, Zap, FileText,
  Search, Image, Layout, Lightbulb, ArrowRight
} from 'lucide-react'

const TOOLS = [
  {
    href: '/studio/ideas/trending',
    icon: TrendingUp,
    label: 'Trending Now',
    desc: 'Discover what is going viral right now by niche, region, and platform. Updated daily with virality scores.',
    badge: 'LIVE',
    badgeBg: '#22c55e',
    color: '#22c55e',
    stat: '200+ niches tracked',
  },
  {
    href: '/studio/ideas/hooks',
    icon: Zap,
    label: 'Hook Generator',
    desc: 'Generate 20 proven viral opening hooks tailored to your niche, platform, and target audience.',
    badge: null,
    color: 'var(--accent-primary)',
    stat: '8 hook styles',
  },
  {
    href: '/studio/ideas/scripts',
    icon: FileText,
    label: 'Script Generator',
    desc: 'AI writes a complete video script \u2014 hook, body, CTA \u2014 for any platform and duration.',
    badge: 'NEW',
    badgeBg: 'var(--accent-primary)',
    color: 'var(--accent-primary)',
    stat: '6 script styles',
  },
  {
    href: '/studio/ideas/competitor',
    icon: Search,
    label: 'Competitor Analyzer',
    desc: 'Paste any TikTok or Instagram handle. AI reverse-engineers their top content patterns.',
    badge: null,
    color: '#f59e0b',
    stat: 'Any public account',
  },
  {
    href: '/studio/ideas/thumbnails',
    icon: Image,
    label: 'Thumbnail Generator',
    desc: 'Generate 5 AI thumbnail variants for any content idea. Optimized per platform.',
    badge: null,
    color: '#ec4899',
    stat: '5 variants per idea',
  },
  {
    href: '/studio/ideas/storyboard',
    icon: Layout,
    label: 'Storyboard Pipeline',
    desc: 'Paste your script. AI breaks it into scenes, generates visuals, sends to bulk video.',
    badge: 'NEW',
    badgeBg: 'var(--accent-primary)',
    color: 'var(--accent-primary)',
    stat: 'Script \u2192 video in 1 click',
  },
  {
    href: '/studio/ideas/saved',
    icon: Bookmark,
    label: 'Saved Ideas',
    desc: 'All your bookmarked trending ideas, saved scripts, and hook collections in one place.',
    badge: null,
    color: 'var(--text-secondary)',
    stat: 'Your personal library',
  },
  {
    href: '/studio/ideas/calendar',
    icon: Calendar,
    label: 'Content Calendar',
    desc: 'Drag saved ideas into a visual calendar. Plan your content creation pipeline week by week.',
    badge: null,
    color: '#06b6d4',
    stat: 'Visual week planner',
  },
]

export default function IdeasHubPage() {
  return (
    <div style={{ padding: '32px 28px', maxWidth: 1100, margin: '0 auto' }}>

      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lightbulb size={20} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Content Ideas & Trends
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              9 tools for trend discovery, scripting, and content planning
            </p>
          </div>
        </div>

        <Link href="/studio/ideas/trending" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,194,255,0.12) 0%, rgba(0,229,204,0.08) 100%)',
            border: '1px solid var(--border-active)',
            borderRadius: 16, padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', transition: 'border-color 150ms',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-active)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--accent-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TrendingUp size={18} color="#000" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  See what is trending right now
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Select your niche and region \u2014 get live trends with virality scores
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-primary)', fontSize: 13, fontWeight: 600 }}>
              Explore <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 14,
      }}>
        {TOOLS.map(tool => (
          <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 16, padding: '20px',
                cursor: 'pointer',
                transition: 'all 180ms',
                height: '100%',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-active)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-card)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <tool.icon size={20} style={{ color: tool.color }} />
                </div>
                {tool.badge && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 7px',
                    borderRadius: 100, background: tool.badgeBg,
                    color: tool.badgeBg === '#22c55e' ? '#fff' : '#000',
                  }}>
                    {tool.badge}
                  </span>
                )}
              </div>

              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 5 }}>
                  {tool.label}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {tool.desc}
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: 11, color: 'var(--text-muted)',
                  background: 'var(--bg-elevated)',
                  padding: '3px 8px', borderRadius: 6,
                }}>
                  {tool.stat}
                </span>
                <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
