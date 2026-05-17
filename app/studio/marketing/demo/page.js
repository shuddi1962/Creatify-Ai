'use client'
import { useState, useRef } from 'react'
import { Upload, X, Download } from 'lucide-react'

const DEMO_STYLES = ['Unboxing', 'Feature Walkthrough', '360° Spin', 'In-Use Demo', 'Comparison', 'Unpackaging', 'Slow Motion Showcase']
const SCENES = ['Studio White', 'Living Room', 'Kitchen', 'Office', 'Outdoor', 'Beach', 'Urban Street', 'Nature']
const DEMO_MODELS = [{ id: 'kling-v2.6-pro-t2v', name: 'Kling 3.0 Pro', creditCost: 30 }, { id: 'seedance-v2.0-t2v', name: 'Seedance 2.0', creditCost: 25 }]

export default function DemoPage() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('muapi_key') : ''
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [demoStyle, setDemoStyle] = useState('Unboxing')
  const [scene, setScene] = useState('Studio White')
  const [voiceover, setVoiceover] = useState(false)
  const [model, setModel] = useState(DEMO_MODELS[0])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedImage(URL.createObjectURL(file))
    if (apiKey) {
      const fd = new FormData(); fd.append('file', file)
      try {
        const res = await fetch('https://api.muapi.ai/v1/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}` }, body: fd })
        const data = await res.json()
        setUploadedUrl(data.url || data.file_url || '')
      } catch { setUploadedUrl('') }
    }
  }

  async function handleGenerate() {
    if (!apiKey) { setError('Add API key'); return }
    if (!uploadedImage) { setError('Upload a product image'); return }
    setError(''); setLoading(true); setResult(null)
    try {
      const prompt = `Product demo video: ${demoStyle} style, ${scene} setting. ${voiceover ? 'With professional voiceover narration.' : ''} High quality product presentation, cinematic lighting, smooth camera movement. Showcase product details and features. 30 seconds.`
      const body = { prompt, aspect_ratio: '16:9', duration: 30, quality: 'high', image_url: uploadedUrl || uploadedImage }
      const response = await fetch(`https://api.muapi.ai/v1/${model.id}`, {
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
          if (pd.status === 'failed') throw new Error('Failed')
        }
      } else if (data.url) setResult({ url: data.url })
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>MARKETING STUDIO</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>PRODUCT DEMO</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Showcase your product in motion with stunning AI video demos</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
        {uploadedImage ? (
          <div style={{ position: 'relative' }}>
            <img src={uploadedImage} style={{ width: '100%', height: 200, objectFit: 'contain', borderRadius: 10, background: 'var(--bg-input)' }} />
            <button onClick={() => { setUploadedImage(null); setUploadedUrl('') }} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={14} /></button>
          </div>
        ) : (
          <div onClick={() => fileRef.current?.click()} style={{ height: 160, border: '2px dashed var(--border-default)', borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--bg-input)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
            <Upload size={28} style={{ color: 'var(--text-muted)' }} /><span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Upload product image</span>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>DEMO STYLE</div>
            <select value={demoStyle} onChange={e => setDemoStyle(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
              {DEMO_STYLES.map(s => <option key={s}>{s}</option>)}</select></div>
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>SCENE SETTING</div>
            <select value={scene} onChange={e => setScene(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
              {SCENES.map(s => <option key={s}>{s}</option>)}</select></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={voiceover} onChange={e => setVoiceover(e.target.checked)} style={{ accentColor: 'var(--accent-primary)' }} /> Voiceover narration
          </label>
          <select value={model.id} onChange={e => setModel(DEMO_MODELS.find(m => m.id === e.target.value))} style={{ marginLeft: 'auto', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
            {DEMO_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fca5a5' }}>{error}</div>}
        <button onClick={handleGenerate} disabled={loading || !uploadedImage} style={{ padding: '12px 0', background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
          {loading ? 'Generating demo...' : 'Generate Product Demo'}
        </button>
        {result && (
          <div><div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Result</div>
            <video src={result.url} controls autoPlay loop style={{ width: '100%', borderRadius: 10 }} />
            <a href={result.url} download style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: '8px 0', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}><Download size={14} /> Download</a>
          </div>
        )}
      </div>
    </div>
  )
}
