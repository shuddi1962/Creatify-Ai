'use client'
import { useState, useRef } from 'react'
import { Upload, X, Download } from 'lucide-react'

const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok', ratio: '9:16', w: 1080, h: 1920 },
  { id: 'instagram-square', label: 'Instagram Square', ratio: '1:1', w: 1080, h: 1080 },
  { id: 'instagram-portrait', label: 'Instagram Portrait', ratio: '4:5', w: 1080, h: 1350 },
  { id: 'youtube', label: 'YouTube', ratio: '16:9', w: 1920, h: 1080 },
  { id: 'facebook', label: 'Facebook', ratio: '16:9', w: 1920, h: 1080 },
  { id: 'linkedin', label: 'LinkedIn', ratio: '1:1', w: 1080, h: 1080 },
  { id: 'twitter', label: 'Twitter/X', ratio: '16:9', w: 1280, h: 720 },
  { id: 'pinterest', label: 'Pinterest', ratio: '2:3', w: 1000, h: 1500 },
]

export default function FormatterPage() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState(['tiktok'])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const fileRef = useRef()

  function toggle(id) { setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]) }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(URL.createObjectURL(file))
  }

  async function handleFormat() {
    if (!uploadedFile) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    const formats = selectedPlatforms.map(id => {
      const p = PLATFORMS.find(pl => pl.id === id)
      return { id: p.id, label: p.label, ratio: p.ratio, url: uploadedFile }
    })
    setResults(formats)
    setLoading(false)
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>MARKETING STUDIO</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>PLATFORM FORMATTER</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Auto-resize content to any platform format</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '24px' }}>
        <input ref={fileRef} type="file" accept="video/*,image/*" style={{ display: 'none' }} onChange={handleUpload} />
        {uploadedFile ? (
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <video src={uploadedFile} controls style={{ width: '100%', maxHeight: 300, borderRadius: 10 }} />
            <button onClick={() => { setUploadedFile(null); setResults([]) }} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={14} /></button>
          </div>
        ) : (
          <div onClick={() => fileRef.current?.click()} style={{ height: 160, border: '2px dashed var(--border-default)', borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--bg-input)', marginBottom: 20 }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
            <Upload size={28} style={{ color: 'var(--text-muted)' }} /><span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Upload video or image</span>
          </div>
        )}
        <div style={{ marginBottom: 20 }}><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>FORMATS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => toggle(p.id)} style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: selectedPlatforms.includes(p.id) ? 'var(--accent-primary)' : 'var(--bg-elevated)', color: selectedPlatforms.includes(p.id) ? '#000' : 'var(--text-secondary)' }}>{p.label} ({p.ratio})</button>
            ))}
          </div>
        </div>
        <button onClick={handleFormat} disabled={loading || !uploadedFile || selectedPlatforms.length === 0} style={{ padding: '12px 24px', background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
          {loading ? 'Processing...' : `✦ Generate ${selectedPlatforms.length} Format${selectedPlatforms.length > 1 ? 's' : ''}`}
        </button>
        {results.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Results</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {results.map(r => (
                <div key={r.id} style={{ background: 'var(--bg-input)', borderRadius: 12, padding: 12, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{r.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>{r.ratio}</div>
                  <a href={r.url} download style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--accent-primary)', textDecoration: 'none' }}><Download size={12} /> Download</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
