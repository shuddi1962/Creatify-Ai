'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'

const BATCH_MODELS = [{ id: 'kling-v2.6-pro-t2v', name: 'Kling 3.0 Pro', creditCost: 30 }, { id: 'wan2.5-text-to-video', name: 'WAN 2.5', creditCost: 12 }]

export default function BatchPage() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('muapi_key') : ''
  const [product, setProduct] = useState('')
  const [count, setCount] = useState('5')
  const [model, setModel] = useState(BATCH_MODELS[0])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState([])
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  async function handleBatch() {
    if (!apiKey) { setError('Add API key'); return }
    if (!product.trim()) { setError('Describe product'); return }
    setError(''); setLoading(true); setProgress([]); setResults([])
    const total = parseInt(count)
    setProgress(Array(total).fill('queued'))

    const variants = ['hook style', 'fast cuts', 'emotional angle', 'humor twist', 'testimonial style',
      'comparison angle', 'problem focus', 'lifestyle focus', 'urgent cta', 'educational angle']
    const jobs = Array.from({ length: total }, async (_, i) => {
      const desc = `${product} — ${variants[i % variants.length]}`
      setProgress(prev => { const n = [...prev]; n[i] = 'generating'; return n })
      try {
        const body = { prompt: `UGC ad for ${desc}. High quality, cinematic, ${i % 2 === 0 ? '9:16 vertical' : '16:9 landscape'}, 30 seconds.`, aspect_ratio: i % 2 === 0 ? '9:16' : '16:9', duration: 30, quality: 'high' }
        const response = await fetch(`https://api.muapi.ai/v1/${model.id}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify(body),
        })
        if (!response.ok) { setProgress(prev => { const n = [...prev]; n[i] = 'failed'; return n }); return null }
        const data = await response.json()
        const jobId = data.id || data.request_id
        if (jobId) {
          for (let a = 0; a < 120; a++) {
            await new Promise(r => setTimeout(r, 2500))
            const poll = await fetch(`https://api.muapi.ai/v1/predict/results/${jobId}`, { headers: { 'Authorization': `Bearer ${apiKey}` } })
            if (!poll.ok) continue
            const pd = await poll.json()
            if (pd.status === 'succeeded' || pd.output || pd.url) { setProgress(prev => { const n = [...prev]; n[i] = 'done'; return n }); return { url: pd.url || pd.output?.url || pd.output?.[0], variant: i + 1 } }
            if (pd.status === 'failed') { setProgress(prev => { const n = [...prev]; n[i] = 'failed'; return n }); return null }
          }
        } else if (data.url) { setProgress(prev => { const n = [...prev]; n[i] = 'done'; return n }); return { url: data.url, variant: i + 1 } }
      } catch { setProgress(prev => { const n = [...prev]; n[i] = 'failed'; return n }) }
      return null
    })
    const done = await Promise.all(jobs)
    setResults(done.filter(Boolean))
    setLoading(false)
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>MARKETING STUDIO</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>BATCH AD GENERATOR</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Create multiple ad variants from one product in one click</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>PRODUCT DESCRIPTION</div>
          <textarea value={product} onChange={e => setProduct(e.target.value)} placeholder="Describe the product you're advertising..." rows={3} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>VARIANTS</div>
            <select value={count} onChange={e => setCount(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
              {['5', '10', '20'].map(c => <option key={c}>{c}</option>)}</select></div>
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>MODEL</div>
            <select value={model.id} onChange={e => setModel(BATCH_MODELS.find(m => m.id === e.target.value))} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
              {BATCH_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fca5a5' }}>{error}</div>}
        <button onClick={handleBatch} disabled={loading} style={{ padding: '12px 0', background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
          {loading ? `Generating ${count} ads...` : `Generate ${count} Ad Variants`}
        </button>
        {progress.length > 0 && (
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>PROGRESS</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {progress.map((p, i) => (
                <div key={i} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: p === 'done' ? 'rgba(0,255,148,0.2)' : p === 'failed' ? 'rgba(239,68,68,0.2)' : p === 'generating' ? 'rgba(0,194,255,0.2)' : 'var(--bg-input)', color: p === 'done' ? '#00FF94' : p === 'failed' ? '#fca5a5' : p === 'generating' ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                  #{i + 1} {p === 'done' ? 'OK' : p === 'failed' ? 'X' : p === 'generating' ? '..' : '..'}
                </div>
              ))}
            </div>
          </div>
        )}
        {results.length > 0 && (
          <div><div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Results ({results.length})</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {results.map((r, i) => (
                <div key={i} style={{ background: 'var(--bg-input)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <video src={r.url} style={{ width: '100%', height: 160, objectFit: 'cover' }} muted />
                  <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-primary)' }}>Variant {r.variant}</span>
                    <a href={r.url} download style={{ color: 'var(--accent-primary)', fontSize: 11, textDecoration: 'none' }}><Download size={12} /></a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
