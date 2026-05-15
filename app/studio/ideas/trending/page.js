'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  TrendingUp, RefreshCw, Bookmark, BookmarkCheck,
  FileText, Layout, ChevronDown,
  Globe, Hash
} from 'lucide-react'

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

const PLATFORMS = [
  { id: 'all', label: 'All Platforms' },
  { id: 'tiktok', label: 'TikTok', emoji: '\uD83C\uDFB5' },
  { id: 'instagram', label: 'Instagram', emoji: '\uD83D\uDCF8' },
  { id: 'youtube', label: 'YouTube', emoji: '\u25B6\uFE0F' },
  { id: 'linkedin', label: 'LinkedIn', emoji: '\uD83D\uDCBC' },
  { id: 'twitter', label: 'Twitter / X', emoji: '\uD835\uDDD7' },
  { id: 'pinterest', label: 'Pinterest', emoji: '\uD83D\uDCCC' },
]

const REGIONS = [
  'Global', 'United States', 'United Kingdom', 'Nigeria', 'Ghana', 'Kenya',
  'South Africa', 'India', 'Canada', 'Australia', 'Brazil', 'Germany',
  'France', 'Indonesia', 'Philippines', 'Mexico', 'Japan', 'South Korea',
]

const TIMEFRAMES = ['Today', 'This Week', 'This Month']
const SORT_OPTIONS = ['Virality Score', 'Newest', 'Most Saved', 'Platform Match']

function generateTrends(niche, platform, region) {
  const nicheLabel = niche === 'All Niches' ? '' : `${niche} `
  const platLabel = platform === 'all' ? '' : `${PLATFORMS.find(p=>p.id===platform)?.label || ''} `

  return [
    {
      id: '1',
      title: `${nicheLabel}transformation challenge`,
      hook: `"No one told me ${niche === 'All Niches' ? 'this' : niche.toLowerCase()} could change your life like this"`,
      niche: niche === 'All Niches' ? 'Lifestyle' : niche,
      platform: platform === 'all' ? 'TikTok' : PLATFORMS.find(p=>p.id===platform)?.label,
      region,
      viralityScore: 97,
      trendingAudio: 'Levii\'s Jeans - Beyonc\u00e9',
      hashtags: [`#${(niche === 'All Niches' ? 'lifestyle' : niche.toLowerCase().replace(/\s/g, ''))}`, '#transformation', '#fyp'],
      contentAngle: 'Before/After reveal',
      estimatedViews: '2.4M avg',
      timeInTrend: '3 days',
    },
    {
      id: '2',
      title: `Day in my life as a ${nicheLabel}creator`,
      hook: `"I never show this side of being a ${niche === 'All Niches' ? 'content' : niche.toLowerCase()} creator..."`,
      niche: niche === 'All Niches' ? 'Lifestyle' : niche,
      platform: platform === 'all' ? 'Instagram' : PLATFORMS.find(p=>p.id===platform)?.label,
      region,
      viralityScore: 92,
      trendingAudio: 'Lo-fi Chill Beats Mix',
      hashtags: ['#dayinmylife', `#${(niche==='All Niches'?'creator':niche.toLowerCase().replace(/\s/g,''))}`, '#behindthescenes'],
      contentAngle: 'Authentic behind-the-scenes',
      estimatedViews: '1.8M avg',
      timeInTrend: '5 days',
    },
    {
      id: '3',
      title: `${nicheLabel}secrets nobody talks about`,
      hook: `"The ${niche === 'All Niches' ? 'industry' : niche.toLowerCase()} doesn't want you to know this"`,
      niche: niche === 'All Niches' ? 'Business' : niche,
      platform: platform === 'all' ? 'YouTube' : PLATFORMS.find(p=>p.id===platform)?.label,
      region,
      viralityScore: 89,
      trendingAudio: 'Dramatic Suspense Sting',
      hashtags: ['#secrets', `#${(niche==='All Niches'?'truth':niche.toLowerCase().replace(/\s/g,''))}`, '#exposed'],
      contentAngle: 'Controversial revelation',
      estimatedViews: '3.1M avg',
      timeInTrend: '1 day',
    },
    {
      id: '4',
      title: `How I make money with ${nicheLabel.trim() || 'AI'}`,
      hook: `"I make $X/month doing this one ${niche === 'All Niches' ? 'thing' : niche.toLowerCase()} trick"`,
      niche: niche === 'All Niches' ? 'Finance' : niche,
      platform: platform === 'all' ? 'TikTok' : PLATFORMS.find(p=>p.id===platform)?.label,
      region,
      viralityScore: 88,
      trendingAudio: 'Money Trees - Kendrick Lamar',
      hashtags: ['#makemoney', '#sidehustle', `#${(niche==='All Niches'?'finance':niche.toLowerCase().replace(/\s/g,''))}`],
      contentAngle: 'Income reveal / tutorial',
      estimatedViews: '4.2M avg',
      timeInTrend: '2 days',
    },
    {
      id: '5',
      title: `${nicheLabel}tips that actually work`,
      hook: `"Stop wasting time on ${niche === 'All Niches' ? 'content' : niche.toLowerCase()} that doesn't work \u2014 do this instead"`,
      niche: niche === 'All Niches' ? 'Education' : niche,
      platform: platform === 'all' ? 'LinkedIn' : PLATFORMS.find(p=>p.id===platform)?.label,
      region,
      viralityScore: 85,
      trendingAudio: 'Upbeat Corporate Background',
      hashtags: ['#tips', `#${(niche==='All Niches'?'success':niche.toLowerCase().replace(/\s/g,''))}`, '#growth'],
      contentAngle: 'Educational list format',
      estimatedViews: '890K avg',
      timeInTrend: '7 days',
    },
    {
      id: '6',
      title: `${region} ${nicheLabel}trends you missed`,
      hook: `"Everyone in ${region} is doing this \u2014 are you?"`,
      niche: niche === 'All Niches' ? 'Culture' : niche,
      platform: platform === 'all' ? 'Instagram' : PLATFORMS.find(p=>p.id===platform)?.label,
      region,
      viralityScore: 82,
      trendingAudio: 'Regional trending sound',
      hashtags: [`#${region.toLowerCase().replace(/\s/g, '')}`, '#trending', `#${(niche==='All Niches'?'culture':niche.toLowerCase().replace(/\s/g,''))}`],
      contentAngle: 'Regional trend spotlight',
      estimatedViews: '1.2M avg',
      timeInTrend: '4 days',
    },
    {
      id: '7',
      title: `${nicheLabel}routine that went viral`,
      hook: `"My ${niche === 'All Niches' ? 'daily' : niche.toLowerCase()} routine got 10M views \u2014 here is why"`,
      niche: niche === 'All Niches' ? 'Lifestyle' : niche,
      platform: platform === 'all' ? 'TikTok' : PLATFORMS.find(p=>p.id===platform)?.label,
      region,
      viralityScore: 80,
      trendingAudio: 'Get Him Back - Olivia Rodrigo',
      hashtags: ['#routine', '#viral', `#${(niche==='All Niches'?'grwm':niche.toLowerCase().replace(/\s/g,''))}`],
      contentAngle: 'Process breakdown',
      estimatedViews: '5.6M avg',
      timeInTrend: '6 days',
    },
    {
      id: '8',
      title: `Honest review: ${nicheLabel}products`,
      hook: `"I bought every ${niche === 'All Niches' ? 'trending' : niche.toLowerCase()} product so you don't have to"`,
      niche: niche === 'All Niches' ? 'Reviews' : niche,
      platform: platform === 'all' ? 'YouTube' : PLATFORMS.find(p=>p.id===platform)?.label,
      region,
      viralityScore: 78,
      trendingAudio: 'Funny Review Sound',
      hashtags: ['#review', '#honest', `#${(niche==='All Niches'?'worth':niche.toLowerCase().replace(/\s/g,''))}`],
      contentAngle: 'Comparison / review',
      estimatedViews: '2.1M avg',
      timeInTrend: '8 days',
    },
  ]
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

  const loadTrends = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setTrends(generateTrends(niche, platform, region))
      setLoading(false)
    }, 900)
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
            {PLATFORMS.map(p => (
              <option key={p.id} value={p.id}>
                {p.emoji ? `${p.emoji} ` : ''}{p.label}
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
            {PLATFORMS.find(p => p.id === platform)?.emoji} {PLATFORMS.find(p => p.id === platform)?.label}
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
                    }}>
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

      {nicheOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 499 }}
          onClick={() => setNicheOpen(false)}
        />
      )}
    </div>
  )
}
