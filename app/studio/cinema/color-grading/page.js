'use client'
import { useState, useRef } from 'react'
import { Upload, X, Download } from 'lucide-react'

const GRADE_STYLES = [
  { id: 'warm', name: 'Warm Golden', preset: { exposure: 0.2, contrast: 0.1, saturation: 0.3, temperature: 15, tint: 0 } },
  { id: 'cool', name: 'Cool Blue', preset: { exposure: 0, contrast: 0.2, saturation: -0.1, temperature: -20, tint: 5 } },
  { id: 'teal-orange', name: 'Teal & Orange', preset: { exposure: 0.1, contrast: 0.3, saturation: 0.2, temperature: -10, tint: 15 } },
  { id: 'vintage', name: 'Vintage Film', preset: { exposure: -0.1, contrast: 0.4, saturation: -0.2, temperature: 10, tint: -5 } },
  { id: 'bw', name: 'Black & White', preset: { exposure: 0, contrast: 0.5, saturation: -1, temperature: 0, tint: 0 } },
  { id: 'neon', name: 'Neon Cyber', preset: { exposure: 0.2, contrast: 0.3, saturation: 0.5, temperature: -15, tint: 20 } },
  { id: 'muted', name: 'Muted Film', preset: { exposure: -0.1, contrast: 0.1, saturation: -0.4, temperature: 5, tint: 0 } },
  { id: 'hdr', name: 'HDR Punch', preset: { exposure: 0.3, contrast: 0.5, saturation: 0.3, temperature: 0, tint: 0 } },
]

export default function ColorGradingPage() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('muapi_key') : ''
  const [uploadedVideo, setUploadedVideo] = useState(null)
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('')
  const [selectedGrade, setSelectedGrade] = useState(GRADE_STYLES[0])
  const [exposure, setExposure] = useState(0)
  const [contrast, setContrast] = useState(0.2)
  const [saturation, setSaturation] = useState(0)
  const [temperature, setTemperature] = useState(0)
  const [tint, setTint] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()

  function applyPreset(p) {
    setSelectedGrade(p); setExposure(p.preset.exposure); setContrast(p.preset.contrast)
    setSaturation(p.preset.saturation); setTemperature(p.preset.temperature); setTint(p.preset.tint)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedVideo(URL.createObjectURL(file))
    if (apiKey) {
      const fd = new FormData(); fd.append('file', file)
      try {
        const res = await fetch('https://api.muapi.ai/v1/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}` }, body: fd })
        const data = await res.json()
        setUploadedVideoUrl(data.url || data.file_url || '')
      } catch { setUploadedVideoUrl('') }
    }
  }

  async function handleApply() {
    if (!apiKey) { setError('Add your Muapi key in Settings.'); return }
    if (!uploadedVideo && !uploadedVideoUrl) { setError('Upload a video first.'); return }
    setError(''); setLoading(true); setResult(null)
    try {
      const body = { prompt: `Apply ${selectedGrade.name} color grade`, video_url: uploadedVideoUrl || uploadedVideo, effect: 'color_grade', grade_params: { exposure, contrast, saturation, temperature, tint } }
      const response = await fetch('https://api.muapi.ai/v1/ai-video-effects', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error(`Failed (${response.status})`)
      const data = await response.json()
      const jobId = data.id || data.request_id
      if (jobId) {
        for (let i = 0; i < 120; i++) {
          await new Promise(r => setTimeout(r, 2500))
          const poll = await fetch(`https://api.muapi.ai/v1/predict/results/${jobId}`, { headers: { 'Authorization': `Bearer ${apiKey}` } })
          if (!poll.ok) continue
          const pd = await poll.json()
          if (pd.status === 'succeeded' || pd.output || pd.url) { setResult({ url: pd.url || pd.output?.url || pd.output?.[0] }); break }
          if (pd.status === 'failed') throw new Error('Grading failed')
        }
      } else if (data.url) setResult({ url: data.url })
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>CINEMA STUDIO — COLOR GRADING</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>COLOR GRADING</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Apply professional color grading presets to any video instantly</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
            {GRADE_STYLES.map(g => (
              <div key={g.id} onClick={() => applyPreset(g)} style={{ background: 'var(--bg-card)', border: selectedGrade.id === g.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)', borderRadius: 14, padding: '16px', cursor: 'pointer', textAlign: 'center', transition: 'all 150ms' }}
                onMouseEnter={e => { if (selectedGrade.id !== g.id) e.currentTarget.style.borderColor = 'var(--border-default)' }}
                onMouseLeave={e => { if (selectedGrade.id !== g.id) e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '24px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Manual Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Exposure', value: exposure, set: setExposure, min: -1, max: 1, step: 0.05 },
                { label: 'Contrast', value: contrast, set: setContrast, min: -1, max: 1, step: 0.05 },
                { label: 'Saturation', value: saturation, set: setSaturation, min: -1, max: 1, step: 0.05 },
                { label: 'Temperature', value: temperature, set: setTemperature, min: -50, max: 50, step: 1 },
                { label: 'Tint', value: tint, set: setTint, min: -50, max: 50, step: 1 },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', width: 80, flexShrink: 0 }}>{s.label}</div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.set(parseFloat(e.target.value))} style={{ flex: 1, accentColor: 'var(--accent-primary)' }} />
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>{s.value > 0 ? '+' : ''}{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '20px', position: 'sticky', top: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{uploadedVideo ? 'Uploaded video' : 'Upload your video'}</h3>
          <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleUpload} />
          {uploadedVideo ? (
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <video src={uploadedVideo} controls style={{ width: '100%', borderRadius: 10, maxHeight: 200 }} />
              <button onClick={() => { setUploadedVideo(null); setUploadedVideoUrl('') }} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
            </div>
          ) : (
            <div onClick={() => fileRef.current?.click()} style={{ height: 130, border: '2px dashed var(--border-default)', borderRadius: 10, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--bg-input)', marginBottom: 16 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
              <Upload size={22} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Click to upload video</span>
            </div>
          )}
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fca5a5', marginBottom: 12 }}>{error}</div>}
          <button onClick={handleApply} disabled={loading || !uploadedVideo} style={{ width: '100%', padding: '12px 0', background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: loading || !uploadedVideo ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Applying grade...' : `Apply ${selectedGrade.name}`}
          </button>
          {result && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Result</div>
              <video src={result.url} controls autoPlay loop style={{ width: '100%', borderRadius: 10 }} />
              <a href={result.url} download style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: '8px 0', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}><Download size={14} /> Download</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
