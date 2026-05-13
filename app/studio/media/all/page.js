'use client'

import { useState, useEffect } from 'react'
import { Search, Image, Video, Music, Download, Trash2, Grid, List, ZoomIn, X, Clock, Loader2 } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

const TYPES = ['All', 'Images', 'Videos', 'Audio']
const TYPE_MAP = { Images: 'image', Videos: 'video', Audio: 'audio' }

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  const now = new Date()
  const diff = (now - date) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString()
}

function getUrl(row) {
  return row.image_url || row.video_url || row.audio_url || row.url || ''
}

function getType(row) {
  const t = (row.type || row._type || '').toLowerCase()
  if (['image', 'i2i'].includes(t)) return 'image'
  if (['video', 'i2v', 'v2v'].includes(t)) return 'video'
  if (['audio', 'lipsync'].includes(t)) return 'audio'
  return t || 'image'
}

export default function MediaAllPage() {
  const [typeFilter, setTypeFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      const all = []

      try {
        const { data } = await supabase
          .from('generations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)
        if (data) all.push(...data)
      } catch {}

      try {
        const images = JSON.parse(localStorage.getItem('muapi_history') || '[]')
        all.push(...images.map(i => ({ ...i, _local: true })))
      } catch {}
      try {
        const videos = JSON.parse(localStorage.getItem('video_history') || '[]')
        all.push(...videos.map(i => ({ ...i, _local: true })))
      } catch {}

      const seen = new Set()
      const merged = all.filter(a => {
        const key = a.url || a.image_url || a.video_url || a.id || Math.random()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      merged.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      setAssets(merged)
      setLoading(false)
    })()
  }, [])

  const filtered = assets.filter(a => {
    if (typeFilter !== 'All' && getType(a) !== TYPE_MAP[typeFilter]) return false
    if (search) {
      const q = search.toLowerCase()
      const prompt = (a.prompt || a.name || '').toLowerCase()
      const model = (a.model || '').toLowerCase()
      if (!prompt.includes(q) && !model.includes(q)) return false
    }
    return true
  })

  const deleteAsset = async (e, id) => {
    e.stopPropagation()
    try {
      await supabase.from('generations').delete().eq('id', id)
      setAssets(prev => prev.filter(a => a.id !== id))
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading media library...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ fontSize: 24, fontWeight: 700, background: 'linear-gradient(135deg, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Media Library
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  style={{
                    padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                    background: typeFilter === t ? 'var(--accent-bg)' : 'transparent',
                    color: typeFilter === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                    transition: 'all 150ms',
                  }}
                >{t}</button>
              ))}
            </div>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <button onClick={() => setView('grid')}
                style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer', background: view === 'grid' ? 'var(--accent-bg)' : 'transparent', color: view === 'grid' ? 'var(--accent-text)' : 'var(--text-muted)' }}>
                <Grid size={14} />
              </button>
              <button onClick={() => setView('list')}
                style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer', background: view === 'list' ? 'var(--accent-bg)' : 'transparent', color: view === 'list' ? 'var(--accent-text)' : 'var(--text-muted)' }}>
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative mb-6" style={{ maxWidth: 400 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by prompt or model..."
            style={{
              width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10,
              padding: '10px 14px 10px 36px', color: 'var(--text-primary)', fontSize: 13, outline: 'none',
            }}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Image size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 4 }}>No assets yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Generated images, videos, and audio will appear here</p>
          </div>
        ) : view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {filtered.map(asset => {
              const url = getUrl(asset)
              const type = getType(asset)
              return (
                <div key={asset.id || asset._id} onClick={() => setLightbox(asset)}
                  style={{
                    background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)',
                    overflow: 'hidden', cursor: 'pointer', transition: 'all 200ms', position: 'relative',
                  }}
                  className="hover-lift"
                >
                  <div style={{ aspectRatio: type === 'video' ? '16/9' : '1', background: 'var(--bg-page)', position: 'relative' }}>
                    {url ? (
                      <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {type === 'audio' ? <Music size={24} style={{ color: 'var(--text-muted)' }} /> : <Image size={24} style={{ color: 'var(--text-muted)' }} />}
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', textTransform: 'capitalize' }}>{type}</span>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 200ms' }}
                      className="hover-overlay"
                    >
                      <ZoomIn size={20} style={{ color: '#fff' }} />
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: 11, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginBottom: 2 }}>
                      {(asset.prompt || asset.name || '').slice(0, 60) || 'Untitled'}
                    </p>
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                      <span>{asset.model || ''}</span>
                      {asset.created_at && <><span>·</span><span>{formatDate(asset.created_at)}</span></>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 500 }}>Preview</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 500 }}>Prompt</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 500 }}>Type</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 500 }}>Model</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 500 }}>Date</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 500 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(asset => {
                    const url = getUrl(asset)
                    const type = getType(asset)
                    return (
                      <tr key={asset.id || asset._id} onClick={() => setLightbox(asset)}
                        style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                        className="hover-row"
                      >
                        <td style={{ padding: '8px 14px' }}>
                          {url ? (
                            <img src={url} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} alt="" loading="lazy" />
                          ) : (
                            <div style={{ width: 40, height: 40, borderRadius: 6, background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {type === 'audio' ? <Music size={14} style={{ color: 'var(--text-muted)' }} /> : <Image size={14} style={{ color: 'var(--text-muted)' }} />}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '8px 14px', color: 'var(--text-primary)', fontSize: 12, maxWidth: 300, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {(asset.prompt || asset.name || '').slice(0, 80) || <span style={{ color: 'var(--text-muted)' }}>Untitled</span>}
                        </td>
                        <td style={{ padding: '8px 14px' }}>
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'var(--accent-bg)', color: 'var(--accent-text)', textTransform: 'capitalize' }}>{type}</span>
                        </td>
                        <td style={{ padding: '8px 14px', color: 'var(--text-secondary)', fontSize: 12 }}>{asset.model || '-'}</td>
                        <td style={{ padding: '8px 14px', color: 'var(--text-secondary)', fontSize: 11 }}>{formatDate(asset.created_at)}</td>
                        <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-1">
                            {url && (
                              <a href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                style={{ padding: 4, borderRadius: 4, border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                title="Download"
                              >
                                <Download size={13} />
                              </a>
                            )}
                            {asset.id && (
                              <button onClick={e => deleteAsset(e, asset.id)}
                                style={{ padding: 4, borderRadius: 4, border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>
          {filtered.length} asset{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: 10, cursor: 'pointer', color: '#fff', backdropFilter: 'blur(8px)' }}>
            <X size={22} />
          </button>
          <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, maxWidth: '95vw', maxHeight: '95vh' }}>
            {getUrl(lightbox) ? (
              <img src={getUrl(lightbox)} style={{ maxWidth: '95vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain' }} alt="" />
            ) : null}
            <div style={{ color: '#ccc', fontSize: 13, textAlign: 'center', maxWidth: 600 }}>
              <p style={{ marginBottom: 2 }}>{(lightbox.prompt || '').slice(0, 200)}</p>
              <p style={{ color: '#888', fontSize: 12 }}>{lightbox.model || ''} · {formatDate(lightbox.created_at)}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .hover-lift:hover .hover-overlay { opacity: 1; }
        .hover-row:hover { background: rgba(255,255,255,0.03); }
      `}</style>
    </div>
  )
}
