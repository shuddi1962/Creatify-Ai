'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  TrendingUp, RefreshCw, Bookmark, BookmarkCheck,
  FileText, Layout, ChevronDown,
  Globe, Hash
} from 'lucide-react'

import { PLATFORMS, PLATFORM_COLORS, PLATFORM_ICONS, PlatformPill } from '@/components/ui/PlatformIcons'

const NICHES = [
  'All Niches', 'Lifestyle', 'Morning Routines', 'Productivity', 'Minimalism',
  'Self-Improvement', 'Mental Health', 'Motivation', 'Mindfulness', 'Relationships',
  'Business', 'Finance', 'Personal Finance', 'Investing', 'Crypto', 'Side Hustles',
  'Entrepreneurship', 'Freelancing', 'Real Estate', 'E-commerce', 'Dropshipping',
  'Digital Marketing', 'Passive Income', 'Stock Market',
  'Technology', 'AI Tools', 'Software', 'Gaming', 'Coding', 'Cybersecurity',
  'Gadgets', 'Smartphones', 'Web Development', 'App Development',
  'Art', 'Photography', 'Graphic Design', 'Video Editing', 'Animation',
  'Music Production', 'Podcasting', 'Writing', 'Storytelling',
  'Fitness', 'Bodybuilding', 'Yoga', 'Running', 'Nutrition', 'Weight Loss',
  'Mental Wellness', 'Meditation', 'Diet', 'Calisthenics',
  'Food', 'Cooking', 'Baking', 'Recipes', 'Meal Prep', 'Veganism',
  'Keto Diet', 'Street Food', 'Restaurant Reviews', 'Coffee',
  'Fashion', 'Beauty', 'Skincare', 'Makeup', 'Hair Care', 'Outfits',
  'Sustainable Fashion', 'Luxury', 'Streetwear', 'Thrift',
  'Travel', 'Budget Travel', 'Solo Travel', 'Luxury Travel', 'Van Life',
  'Digital Nomad', 'Adventure', 'Culture', 'Hidden Gems',
  'Comedy', 'Memes', 'Pop Culture', 'Celebrity News', 'True Crime',
  'Horror', 'Movies', 'TV Shows', 'Anime', 'K-Drama', 'Sports',
  'NBA', 'Football', 'Soccer', 'Formula 1',
  'Education', 'History', 'Science', 'Psychology', 'Philosophy',
  'Language Learning', 'Book Reviews', 'Study Tips',
  'Parenting', 'Motherhood', 'Fatherhood', 'Pregnancy', 'Kids', 'Family Life',
  'Pets', 'Dogs', 'Cats', 'Wildlife', 'Aquariums',
  'Home Decor', 'Interior Design', 'DIY', 'Organization', 'Cleaning',
  'Gardening', 'Architecture', 'Room Makeovers',
  'Spirituality', 'Christianity', 'Islam', 'Wellness', 'Manifestation',
  'Astrology', 'African Culture', 'Nigerian Content', 'Afrobeats',
]

const REGIONS = [
  'Global', 'United States', 'United Kingdom', 'Nigeria', 'Ghana', 'Kenya',
  'South Africa', 'India', 'Canada', 'Australia', 'Brazil', 'Germany',
  'France', 'Indonesia', 'Philippines', 'Mexico', 'Japan', 'South Korea',
]

const TIMEFRAMES = ['Today', 'This Week', 'This Month']
const SORT_OPTIONS = ['Virality Score', 'Newest', 'Most Saved', 'Platform Match']

function PlatformIcon({ id, size = 16 }) {
  const Icon = PLATFORM_ICONS[id]
  if (!Icon) return null
  return <Icon width={size} height={size} />
}

function ViralityBar({ score }) {
  const color = score >= 90 ? '#22c55e' : score >= 80 ? 'var(--accent-primary)' : '#f59e0b'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: 'var(--bg-elevated)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 100, transition: 'width 600ms ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32 }}>{score}</span>
    </div>
  )
}

export default function TrendingPage() {
  const [niche, setNiche] = useState('All Niches')
  const [platform, setPlatform] = useState('all')
  const [region, setRegion] = useState('Global')
  const [timeframe, setTimeframe] = useState('Today')
  const [sort, setSort] = useState('Virality Score')
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(new Set())
  const [nicheSearch, setNicheSearch] = useState('')
  const [nicheOpen, setNicheOpen] = useState(false)

  const filteredNiches = NICHES.filter(n =>
    n.toLowerCase().includes(nicheSearch.toLowerCase())
  )

  const loadTrends = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ niche, platform, region, limit: '15' })
      const res = await fetch(`/api/v1/ideas/trends?${params}`)
      if (res.ok) {
        const data = await res.json()
        setTrends(data.trends || [])
      } else {
        setTrends([])
      }
    } catch {
      setTrends([])
    }
    setLoading(false)
  }, [niche, platform, region, timeframe])

  useEffect(() => { loadTrends() }, [niche, platform, region, timeframe])

  function toggleSave(id) {
    setSaved(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div style={{ padding: '28px 28px 40px', maxWidth: 1200, margin: '0 auto' }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <TrendingUp size={22} style={{ color: '#22c55e' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Trending Now
          </h1>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100,
            background: '#22c55e', color: '#fff',
          }}>LIVE</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
          Select your niche and region to see what is trending with virality scores, hooks, and hashtags
        </p>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 16, padding: '16px 20px',
        marginBottom: 24,
        display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end',
      }}>

        <div style={{ flex: '0 0 220px', position: 'relative' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            NICHE / CATEGORY
          </label>
          <div
            onClick={() => setNicheOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--bg-input)', border: `1px solid ${nicheOpen ? 'var(--border-active)' : 'var(--border-default)'}`,
              borderRadius: 10, padding: '9px 12px', cursor: 'pointer',
              color: 'var(--text-primary)', fontSize: 13, fontWeight: 500,
              transition: 'border-color 150ms',
            }}
          >
            <span>{niche}</span>
            <ChevronDown size={14} style={{
              color: 'var(--text-muted)',
              transform: nicheOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 200ms',
            }} />
          </div>

          {nicheOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0,
              width: 280, maxHeight: 320, overflowY: 'auto',
              background: 'var(--bg-dropdown)',
              border: '1px solid var(--border-default)',
              borderRadius: 12, zIndex: 500,
              boxShadow: 'var(--shadow-dropdown)',
              animation: 'dropIn 150ms ease',
            }}>
              <div style={{ padding: '10px 10px 6px', position: 'sticky', top: 0, background: 'var(--bg-dropdown)' }}>
                <input
                  value={nicheSearch}
                  onChange={e => setNicheSearch(e.target.value)}
                  placeholder="Search niches..."
                  autoFocus
                  style={{
                    width: '100%', background: 'var(--bg-input)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 8, padding: '7px 10px',
                    color: 'var(--text-primary)', fontSize: 12,
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ padding: '4px 6px 8px' }}>
                {filteredNiches.map(n => (
                  <div
                    key={n}
                    onClick={() => { setNiche(n); setNicheOpen(false); setNicheSearch('') }}
                    style={{
                      padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                      fontSize: 13,
                      background: niche === n ? 'var(--bg-active)' : 'transparent',
                      color: niche === n ? 'var(--text-active)' : 'var(--text-primary)',
                      fontWeight: niche === n ? 600 : 400,
                      transition: 'background 120ms',
                    }}
                    onMouseEnter={e => { if (niche !== n) e.currentTarget.style.background = 'var(--bg-hover)' }}
                    onMouseLeave={e => { if (niche !== n) e.currentTarget.style.background = 'transparent' }}
                  >
                    {n}
                  </div>
                ))}
                {filteredNiches.length === 0 && (
                  <div style={{ padding: '12px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                    No niches found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: '0 0 180px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            PLATFORM
          </label>
          <select
            value={platform}
            onChange={e => setPlatform(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-input)',
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13,
              outline: 'none', cursor: 'pointer',
            }}
          >
            {PLATFORMS.filter(p => !p.hidden).map(p => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '0 0 180px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            REGION
          </label>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-input)',
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13,
              outline: 'none', cursor: 'pointer',
            }}
          >
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div style={{ flex: '0 0 160px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            TIMEFRAME
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {TIMEFRAMES.map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 11,
                  fontWeight: timeframe === t ? 600 : 400,
                  border: 'none', cursor: 'pointer',
                  background: timeframe === t ? 'var(--accent-primary)' : 'var(--bg-input)',
                  color: timeframe === t ? '#000' : 'var(--text-secondary)',
                  transition: 'all 150ms',
                }}
              >
                {t.replace('This ', '')}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: '0 0 180px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            SORT BY
          </label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-input)',
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13,
              outline: 'none', cursor: 'pointer',
            }}
          >
            {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <button
          onClick={loadTrends}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 10, padding: '9px 14px',
            fontSize: 13, fontWeight: 500,
            color: 'var(--text-secondary)', cursor: 'pointer',
            alignSelf: 'flex-end',
            transition: 'all 150ms',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 700ms linear infinite' : 'none' }} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {niche !== 'All Niches' && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'var(--bg-active)', border: '1px solid var(--border-active)',
            borderRadius: 100, padding: '4px 10px', fontSize: 12,
            color: 'var(--text-active)', fontWeight: 500,
          }}>
            <Hash size={11} /> {niche}
            <button onClick={() => setNiche('All Niches')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-active)', padding: 0, lineHeight: 1 }}>
              \u00d7
            </button>
          </span>
        )}
        {platform !== 'all' && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
            borderRadius: 100, padding: '4px 10px', fontSize: 12, color: 'var(--text-secondary)',
          }}>
            <PlatformIcon id={platform} size={14} /> {PLATFORMS.find(p => p.id === platform)?.label}
            <button onClick={() => setPlatform('all')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}>
              \u00d7
            </button>
          </span>
        )}
        {region !== 'Global' && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
            borderRadius: 100, padding: '4px 10px', fontSize: 12, color: 'var(--text-secondary)',
          }}>
            <Globe size={11} /> {region}
            <button onClick={() => setRegion('Global')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}>
              \u00d7
            </button>
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)', borderRadius: 16, padding: '20px',
              border: '1px solid var(--border-subtle)',
            }}>
              {[80, 60, 100, 40, 50].map((w, j) => (
                <div key={j} style={{
                  height: j === 0 ? 18 : 12,
                  width: `${w}%`,
                  background: 'var(--bg-elevated)', borderRadius: 6,
                  marginBottom: 12,
                  animation: 'shimmer 1.5s infinite',
                  backgroundImage: 'linear-gradient(90deg, var(--bg-card) 0%, var(--bg-elevated) 50%, var(--bg-card) 100%)',
                  backgroundSize: '200% 100%',
                }} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {trends.map((trend, idx) => (
            <div
              key={trend.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 16, padding: '20px',
                display: 'flex', flexDirection: 'column', gap: 14,
                transition: 'all 180ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      #{idx + 1}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
                      background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <PlatformPill id={Object.keys(PLATFORM_ICONS).find(k => PLATFORMS.find(p => p.id === k)?.label?.toLowerCase() === trend.platform?.toLowerCase()) || 'tiktok'} size={12} showLabel={false} />
                      {trend.platform}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
                      background: 'var(--bg-active)', color: 'var(--text-active)',
                    }}>
                      {trend.niche}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
                    margin: 0, lineHeight: 1.3,
                    textTransform: 'capitalize',
                  }}>
                    {trend.title}
                  </h3>
                </div>
                <button
                  onClick={() => toggleSave(trend.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    color: saved.has(trend.id) ? 'var(--accent-primary)' : 'var(--text-muted)',
                    flexShrink: 0,
                  }}
                  title={saved.has(trend.id) ? 'Saved' : 'Save idea'}
                >
                  {saved.has(trend.id)
                    ? <BookmarkCheck size={18} />
                    : <Bookmark size={18} />}
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Virality Score
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {trend.estimatedViews}
                  </span>
                </div>
                <ViralityBar score={trend.viralityScore} />
              </div>

              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: '12px 14px',
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                  Opening Hook
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  {trend.hook}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
                    Content Angle
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{trend.contentAngle}</div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
                    Trending Audio
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    \uD83C\uDFB5 {trend.trendingAudio}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
                    In Trend For
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{trend.timeInTrend}</div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
                    Region
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{trend.region}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {trend.hashtags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 11, color: 'var(--text-active)',
                    background: 'var(--bg-active)',
                    border: '1px solid var(--border-active)',
                    borderRadius: 100, padding: '3px 8px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Link
                  href={`/studio/ideas/scripts?topic=${encodeURIComponent(trend.title)}&hook=${encodeURIComponent(trend.hook)}&niche=${encodeURIComponent(trend.niche)}`}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
                    borderRadius: 9, padding: '9px 0',
                    fontSize: 12, fontWeight: 700, textDecoration: 'none',
                    transition: 'opacity 150ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <FileText size={13} /> Generate Script
                </Link>
                <Link
                  href={`/studio/ideas/storyboard?topic=${encodeURIComponent(trend.title)}`}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 9, padding: '9px 0',
                    fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
                    textDecoration: 'none', transition: 'border-color 150ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                >
                  <Layout size={13} /> Storyboard
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && trends.length === 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 16, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No Trends Found</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              No trending data available for the selected filters. Make sure Tavily or SerpAPI keys are configured in Admin &gt; API Providers.
            </p>
          </div>
        </div>
      )}

      {nicheOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 499 }}
          onClick={() => setNicheOpen(false)}
        />
      )}
    </div>
  )
}
