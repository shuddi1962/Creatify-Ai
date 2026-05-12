'use client'

import { useState, useEffect } from 'react'
import { Search, Video, Play, Download, Trash2, X, Loader2 } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  const diff = (Date.now() - date) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString()
}

export default function MediaVideosPage() {
  const [search, setSearch] = useState('')
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [player, setPlayer] = useState(null)

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      let session
      try {
        const { data: s } = await supabase.auth.getSession()
        session = s?.session
      } catch { session = null }

      if (session) {
        const { data } = await supabase
          .from('generations')
          .select('*')
          .in('type', ['video', 'i2v', 'v2v'])
          .order('created_at', { ascending: false })
          .limit(100)
        setAssets(data || [])
      } else {
        try {
          const videos = JSON.parse(localStorage.getItem('video_history') || '[]')
            .filter(v => v.type === 'video' || v.type === 'i2v')
          videos.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
          setAssets(videos)
        } catch { setAssets([]) }
      }
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
          Videos
        </h1>

        <div className="relative mb-6" style={{ maxWidth: 400 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos..."
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px 10px 36px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24">
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Video size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No videos yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map(asset => {
              const thumb = asset.image_url || asset.url || ''
              const videoUrl = asset.video_url || ''
              return (
                <div key={asset.id || asset._id}
                  style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bg-page)', cursor: 'pointer' }}
                    onClick={() => setPlayer(asset)}
                  >
                    {thumb ? (
                      <img src={thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Video size={24} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={18} style={{ color: '#fff', marginLeft: 2 }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 12 }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {(asset.prompt || '').slice(0, 80) || 'Untitled'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                        <span>{asset.model || ''}</span>
                        {asset.created_at && <><span> · </span><span>{formatDate(asset.created_at)}</span></>}
                      </div>
                      <div className="flex items-center gap-1">
                        {(videoUrl || thumb) && (
                          <a href={videoUrl || thumb} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ padding: 4, borderRadius: 4, color: 'var(--text-muted)', cursor: 'pointer' }}
                          >
                            <Download size={13} />
                          </a>
                        )}
                        {asset.id && (
                          <button onClick={e => deleteAsset(e, asset.id)}
                            style={{ padding: 4, borderRadius: 4, border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>{filtered.length} video{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {player && (
        <div onClick={() => setPlayer(null)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, cursor: 'pointer' }}>
          <button onClick={() => setPlayer(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff' }}><X size={20} /></button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw' }}>
            <video controls autoPlay style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }} src={player.video_url || player.image_url || player.url || ''} />
            <div style={{ marginTop: 12, color: '#ccc', fontSize: 12, textAlign: 'center' }}>
              <p>{(player.prompt || '').slice(0, 200)}</p>
              <p style={{ color: '#888', marginTop: 4 }}>{player.model || ''} · {formatDate(player.created_at)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
