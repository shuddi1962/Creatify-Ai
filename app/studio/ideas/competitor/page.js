'use client'
import { useState } from 'react'
import { Search, TrendingUp, Eye, Heart, Copy, AtSign } from 'lucide-react'
import Link from 'next/link'

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Twitter/X', 'Facebook', 'LinkedIn', 'Pinterest']
const DEPTHS = [
  { value: '10', label: 'Quick (10 posts)' },
  { value: '20', label: 'Standard (20 posts)' },
  { value: '50', label: 'Deep (50 posts)' },
]

export default function CompetitorPage() {
  const [handle, setHandle] = useState('')
  const [platform, setPlatform] = useState('TikTok')
  const [depth, setDepth] = useState('20')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const analyze = () => {
    if (!handle.trim()) return
    setLoading(true)
    setTimeout(() => {
      setResults({
        handle: `@${handle.replace('@', '')}`,
        platform,
        followers: '2.4M',
        avgViews: '485K',
        engagementRate: '8.2%',
        topPosts: [
          { title: 'Day in my life', views: '2.1M', likes: '180K' },
          { title: 'How I made $10K', views: '1.8M', likes: '156K' },
          { title: 'Morning routine', views: '1.2M', likes: '98K' },
          { title: 'Behind the scenes', views: '890K', likes: '74K' },
          { title: 'Q&A session', views: '720K', likes: '58K' },
        ],
        insights: [
          'Uses question-based hooks in 80% of content',
          'Short-form video under 45s performs 3x better',
          'Consistent posting schedule: Mon, Wed, Fri',
          'Highest engagement on personal story content',
          'Educational content drives more shares than entertainment',
        ],
        suggestedHooks: [
          'What if you could [achieve goal] in [timeframe]?',
          'I tried [challenge] for 30 days \u2014 here\'s what happened',
          'The secret to [desired outcome] nobody talks about',
          'This one change transformed my [area of life]',
        ],
      })
      setLoading(false)
    }, 2500)
  }

  return (
    <div style={{ padding: '28px', maxWidth: 1000, margin: '0 auto' }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Search size={20} style={{ color: '#f59e0b' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Competitor Analyzer
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Paste any TikTok, Instagram, or YouTube handle. AI reverse-engineers their top content patterns.
        </p>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 16, padding: '20px 24px',
        marginBottom: 24,
        display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            HANDLE TO ANALYZE
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRight: 'none',
              borderRadius: '10px 0 0 10px',
              padding: '10px 12px',
              color: 'var(--text-muted)',
              fontSize: 14,
            }}>
              <AtSign size={16} />
            </div>
            <input
              value={handle}
              onChange={e => setHandle(e.target.value)}
              placeholder="username (no @ needed)"
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: '0 10px 10px 0',
                padding: '10px 14px',
                color: 'var(--text-primary)', fontSize: 14,
                outline: 'none', fontFamily: 'inherit',
              }}
              onKeyDown={e => e.key === 'Enter' && analyze()}
            />
          </div>
        </div>

        <div style={{ flex: '0 0 160px' }}>
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
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div style={{ flex: '0 0 180px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            DEPTH
          </label>
          <select
            value={depth}
            onChange={e => setDepth(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-input)',
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13,
              outline: 'none', cursor: 'pointer',
            }}
          >
            {DEPTHS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        <button
          onClick={analyze}
          disabled={loading || !handle.trim()}
          style={{
            padding: '10px 24px',
            background: loading || !handle.trim() ? 'var(--bg-elevated)' : 'var(--btn-generate-bg)',
            color: loading || !handle.trim() ? 'var(--text-muted)' : 'var(--btn-generate-text)',
            border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: loading || !handle.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Analyzing...' : '\u2726 Analyze'}
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 32, height: 32, border: '2px solid var(--border-default)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 600ms linear infinite' }} />
        </div>
      )}

      {results && !loading && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 16, padding: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--accent-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, color: '#000',
              }}>
                {results.handle.charAt(1).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{results.handle}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{results.followers} followers on {results.platform}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-primary)' }}>{results.avgViews}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Avg Views</div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>{results.engagementRate}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Engagement Rate</div>
              </div>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{results.topPosts.length}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Posts Analyzed</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 16, padding: '24px',
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>Top Performing Content</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {results.topPosts.map((post, i) => (
                <div key={i} style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  borderRadius: 12, padding: '14px',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{post.title}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={13} /> {post.views}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={13} /> {post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 16, padding: '24px',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>
                <TrendingUp size={16} style={{ color: 'var(--accent-primary)' }} /> Pattern Insights
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.insights.map((insight, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-elevated)', borderRadius: 8,
                    padding: '10px 12px', fontSize: 13, color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0 }} />
                    {insight}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 16, padding: '24px',
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 14px' }}>
                Suggested Hooks
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.suggestedHooks.map((hook, i) => (
                  <div
                    key={i}
                    onClick={() => { navigator.clipboard.writeText(hook) }}
                    style={{
                      background: 'var(--bg-elevated)', borderRadius: 8,
                      padding: '10px 12px', fontSize: 13, color: 'var(--text-secondary)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                      border: '1px solid var(--border-subtle)',
                      transition: 'border-color 150ms',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-active)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    <Copy size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    {hook}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <Link
                  href={`/studio/ideas/scripts?topic=${encodeURIComponent(results.handle)}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
                    borderRadius: 9, padding: '10px 0', fontSize: 13, fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Create Similar Content
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {!results && !loading && (
        <div style={{
          background: 'var(--bg-card)', border: '2px dashed var(--border-default)',
          borderRadius: 20, padding: '60px 32px', textAlign: 'center',
        }}>
          <Search size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            Enter a handle to analyze
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            We&apos;ll analyze their top content and give you actionable insights
          </div>
        </div>
      )}
    </div>
  )
}
