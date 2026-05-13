'use client'

import { useState, useEffect } from 'react'
import { Search, Image, Download, Trash2, ZoomIn, X, Loader2 } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

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

export default function MediaImagesPage() {
  const [search, setSearch] = useState('')
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
          .in('type', ['image', 'i2i'])
          .order('created_at', { ascending: false })
          .limit(100)
        if (data) all.push(...data)
      } catch {}
      try {
        const images = JSON.parse(localStorage.getItem('muapi_history') || '[]')
        all.push(...images.map(i => ({ ...i, _local: true })))
      } catch {}
      const seen = new Set()
      const merged = all.filter(a => { const k = a.url || a.image_url || a.id || Math.random(); if (seen.has(k)) return false; seen.add(k); return true })
      merged.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      setAssets(merged)
      setLoading(false)
    })()
  }, [])

  const filtered = assets.filter(a => {
    if (!search) return true
    const q = search.toLowerCase()
    return (a.prompt || a.name || '').toLowerCase().includes(q) || (a.model || '').toLowerCase().includes(q)
  })

  const deleteAsset = async (e, id) => {
    e.stopPropagation()
    try { await supabase.from('generations').delete().eq('id', id); setAssets(prev => prev.filter(a => a.id !== id)) } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, background: 'linear-gradient(135deg, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Images
        </h1>

        <div className="relative mb-6" style={{ maxWidth: 400 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images..."
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px 10px 36px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24">
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Image size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No images yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {filtered.map(asset => {
              const url = asset.image_url || asset.url || ''
              return (
                <div key={asset.id || asset._id} onClick={() => setLightbox(asset)}
                  style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                  className="hover-lift"
                >
                  <div style={{ aspectRatio: '1', background: 'var(--bg-page)' }}>
                    {url ? <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" loading="lazy" /> : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image size={24} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 200ms' }} className="hover-overlay">
                      <ZoomIn size={20} style={{ color: '#fff' }} />
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: 11, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginBottom: 2 }}>
                      {(asset.prompt || '').slice(0, 60) || 'Untitled'}
                    </p>
                    <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                      {asset.model && <span>{asset.model} · </span>}
                      <span>{formatDate(asset.created_at)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>{filtered.length} image{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: 10, cursor: 'pointer', color: '#fff', backdropFilter: 'blur(8px)' }}><X size={22} /></button>
          <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, maxWidth: '95vw', maxHeight: '95vh' }}>
            <img src={lightbox.image_url || lightbox.url || ''} style={{ maxWidth: '95vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain' }} alt="" />
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
      `}</style>
    </div>
  )
}
