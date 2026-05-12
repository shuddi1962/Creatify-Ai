'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Music, Play, Pause, Download, Trash2, Loader2 } from 'lucide-react'
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

function formatDuration(seconds) {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function MediaAudioPage() {
  const [search, setSearch] = useState('')
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)

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
          .in('type', ['audio', 'lipsync'])
          .order('created_at', { ascending: false })
          .limit(100)
        setAssets(data || [])
      } else {
        setAssets([])
      }
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    if (!playing) { audioRef.current.pause(); return }
    const url = playing.audio_url || ''
    if (!url) return
    audioRef.current.src = url
    audioRef.current.play().catch(() => {})
  }, [playing])

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
      <audio ref={audioRef} onEnded={() => setPlaying(null)} style={{ display: 'none' }} />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, background: 'linear-gradient(135deg, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Audio
        </h1>

        <div className="relative mb-6" style={{ maxWidth: 400 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audio..."
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px 10px 36px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24">
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Music size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No audio files yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(asset => {
              const url = asset.audio_url || ''
              const isPlaying = playing?.id === asset.id
              return (
                <div key={asset.id || asset._id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: isPlaying ? 'var(--accent-bg)' : 'var(--bg-card)',
                    borderRadius: 12, border: `1px solid ${isPlaying ? 'var(--accent-text)' : 'var(--border-subtle)'}`,
                    padding: '12px 16px', transition: 'all 150ms',
                  }}
                >
                  <button onClick={() => setPlaying(isPlaying ? null : asset)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: isPlaying ? 'var(--accent-text)' : 'var(--bg-page)',
                      border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    {isPlaying ? <Pause size={14} style={{ color: '#fff' }} /> : <Play size={14} style={{ color: 'var(--text-primary)', marginLeft: 2 }} />}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {(asset.prompt || '').slice(0, 80) || 'Untitled'}
                    </p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
                      {asset.model && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{asset.model}</span>}
                      {asset.created_at && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{formatDate(asset.created_at)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {url && (
                      <a href={url} target="_blank" rel="noopener noreferrer"
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
              )
            })}
          </div>
        )}

        <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>{filtered.length} audio file{filtered.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  )
}
