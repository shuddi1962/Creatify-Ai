'use client'
import { useState } from 'react'
import { Bookmark, Trash2, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const MOCK_SAVED = [
  { id: 1, topic: 'Morning routine aesthetic', platform: 'TikTok', niche: 'Lifestyle', virality: 94, hook: '5 AM mornings changed my life', savedDate: 'May 8, 2026' },
  { id: 2, topic: 'Budget home makeover', platform: 'Instagram', niche: 'Home Decor', virality: 82, hook: '$50 room transformation', savedDate: 'May 7, 2026' },
  { id: 3, topic: 'Side hustle revealed', platform: 'LinkedIn', niche: 'Business', virality: 79, hook: 'I made $10K last month', savedDate: 'May 6, 2026' },
  { id: 4, topic: 'Pet transformation', platform: 'Instagram', niche: 'Pets', virality: 95, hook: 'Before/after dog grooming', savedDate: 'May 5, 2026' },
]

export default function SavedPage() {
  const [ideas, setIdeas] = useState(MOCK_SAVED)
  const [filter, setFilter] = useState('All')

  const platforms = ['All', ...new Set(MOCK_SAVED.map(i => i.platform))]
  const filtered = filter === 'All' ? ideas : ideas.filter(i => i.platform === filter)

  const handleRemove = (id) => setIdeas(ideas.filter(i => i.id !== id))

  return (
    <div style={{ padding: '28px', maxWidth: 1000, margin: '0 auto' }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Bookmark size={20} style={{ color: 'var(--text-secondary)' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Saved Ideas
          </h1>
          <span style={{
            fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
            background: 'var(--bg-elevated)', padding: '2px 10px', borderRadius: 100,
          }}>
            {ideas.length} saved
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Your bookmarked trending ideas, hooks, and scripts
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {platforms.map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            style={{
              padding: '7px 16px', borderRadius: 100,
              border: '1px solid',
              borderColor: filter === p ? 'var(--border-active)' : 'var(--border-default)',
              background: filter === p ? 'var(--bg-active)' : 'transparent',
              color: filter === p ? 'var(--text-active)' : 'var(--text-secondary)',
              fontSize: 12, fontWeight: filter === p ? 600 : 400,
              cursor: 'pointer', transition: 'all 140ms',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)', border: '2px dashed var(--border-default)',
          borderRadius: 20, padding: '60px 32px', textAlign: 'center',
        }}>
          <Bookmark size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            No saved ideas yet
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Browse trending ideas and save the ones you like
          </div>
          <Link href="/studio/ideas/trending" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 24px', borderRadius: 10,
            background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
            fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}>
            <TrendingUp size={16} /> Browse Trending
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {filtered.map(idea => (
            <div key={idea.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 16, padding: '20px',
              transition: 'all 180ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
                    background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                  }}>
                    {idea.platform}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
                    background: 'var(--bg-active)', color: 'var(--text-active)',
                  }}>
                    {idea.niche}
                  </span>
                </div>
                <button
                  onClick={() => handleRemove(idea.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                {idea.topic}
              </h3>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>
                  <span>Virality Score</span>
                  <span>{idea.virality}/100</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg-elevated)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 100,
                    background: idea.virality >= 90 ? '#22c55e' : idea.virality >= 80 ? 'var(--accent-primary)' : '#f59e0b',
                    width: `${idea.virality}%`,
                  }} />
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 10 }}>
                &ldquo;{idea.hook}&rdquo;
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Saved {idea.savedDate}
                </span>
                <Link
                  href={`/studio/ideas/scripts?topic=${encodeURIComponent(idea.topic)}`}
                  style={{
                    padding: '7px 14px', borderRadius: 8,
                    background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
                    fontSize: 11, fontWeight: 700, textDecoration: 'none',
                  }}
                >
                  Generate Script
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
