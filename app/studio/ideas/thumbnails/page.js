'use client'
import { useState } from 'react'
import { Image, Download } from 'lucide-react'
import Link from 'next/link'
import PromptArea from '@/components/ideas/PromptArea'

const PLATFORMS = ['YouTube', 'TikTok', 'Instagram', 'LinkedIn']
const STYLES = ['Clickbait', 'Educational', 'Minimalist', 'Bold Text', 'Face Reaction', 'Split']
const NUM_OPTIONS = ['3', '5', '8', '10']

export default function ThumbnailsPage() {
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('YouTube')
  const [style, setStyle] = useState('Bold Text')
  const [numThumbs, setNumThumbs] = useState('5')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const generate = () => {
    if (!title.trim()) return
    setLoading(true)
    setTimeout(() => {
      const thumbs = Array.from({ length: parseInt(numThumbs) }, (_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/seed/thumb${Date.now() + i}/640/360`,
        label: `Variant ${i + 1}`,
      }))
      setResults(thumbs)
      setLoading(false)
    }, 2500)
  }

  return (
    <div style={{ padding: '28px', maxWidth: 1000, margin: '0 auto' }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Image size={20} style={{ color: '#ec4899' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Thumbnail Generator
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Generate AI thumbnail variants for any content idea. Optimized per platform.
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
            VIDEO TOPIC
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. How to make money with AI in 2025"
            style={{
              width: '100%', background: 'var(--bg-input)',
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14,
              outline: 'none', fontFamily: 'inherit',
            }}
            onKeyDown={e => e.key === 'Enter' && generate()}
          />
        </div>

        <div style={{ flex: '0 0 150px' }}>
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

        <div style={{ flex: '0 0 150px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            STYLE
          </label>
          <select
            value={style}
            onChange={e => setStyle(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-input)',
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13,
              outline: 'none', cursor: 'pointer',
            }}
          >
            {STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ flex: '0 0 100px' }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            VARIANTS
          </label>
          <select
            value={numThumbs}
            onChange={e => setNumThumbs(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-input)',
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '9px 12px', color: 'var(--text-primary)', fontSize: 13,
              outline: 'none', cursor: 'pointer',
            }}
          >
            {NUM_OPTIONS.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>

        <button
          onClick={generate}
          disabled={loading || !title.trim()}
          style={{
            padding: '10px 24px',
            background: loading || !title.trim() ? 'var(--bg-elevated)' : 'var(--btn-generate-bg)',
            color: loading || !title.trim() ? 'var(--text-muted)' : 'var(--btn-generate-text)',
            border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Generating...' : '\u2726 Generate'}
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Generated Thumbnails ({results.length})
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {results.map(thumb => (
              <div key={thumb.id} style={{
                background: 'var(--bg-card)', borderRadius: 14,
                overflow: 'hidden', border: '1px solid var(--border-subtle)',
              }}>
                <div style={{
                  width: '100%', aspectRatio: '16/9',
                  background: 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontSize: 12,
                }}>
                  [Thumbnail {thumb.id}]
                </div>
                <div style={{ padding: '10px 12px', display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {}}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8,
                      background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
                      border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Use This
                  </button>
                  <button
                    onClick={() => {}}
                    style={{
                      padding: '8px 12px', borderRadius: 8,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-default)',
                      cursor: 'pointer', color: 'var(--text-muted)',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && (
        <div style={{
          background: 'var(--bg-card)', border: '2px dashed var(--border-default)',
          borderRadius: 20, padding: '60px 32px', textAlign: 'center',
        }}>
          <Image size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            Enter a topic to generate thumbnails
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            AI will create {numThumbs} thumbnail variants for {platform}
          </div>
        </div>
      )}
    </div>
  )
}
