'use client'
import { useState } from 'react'
import { Search, Package, Download } from 'lucide-react'

const HOOK_STYLES = [{ value: 'problem_solution', label: 'Problem / Solution' }, { value: 'before_after', label: 'Before / After' }, { value: 'testimonial', label: 'Testimonial' }, { value: 'tutorial', label: 'Tutorial' }, { value: 'unboxing', label: 'Unboxing' }]
const PLATFORMS = [{ id: 'tiktok', label: 'TikTok', ratio: '9:16' }, { id: 'instagram', label: 'Instagram', ratio: '9:16' }, { id: 'youtube', label: 'YouTube', ratio: '16:9' }]
const AD_MODELS = [{ id: 'kling-v2.6-pro-t2v', name: 'Kling 3.0 Pro', creditCost: 30 }, { id: 'seedance-v2.0-t2v', name: 'Seedance 2.0', creditCost: 25 }]

export default function ProductUrlPage() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('muapi_key') : ''
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [product, setProduct] = useState(null)
  const [hookStyle, setHookStyle] = useState('problem_solution')
  const [platform, setPlatform] = useState(PLATFORMS[0])
  const [model, setModel] = useState(AD_MODELS[0])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleScan() {
    if (!url.trim()) return
    setScanning(true); setError(''); setProduct(null)
    try {
      const res = await fetch('/api/scrape-product', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url.trim() }) })
      if (!res.ok) throw new Error('Failed to scan')
      const data = await res.json()
      setProduct(data)
    } catch (e) { setError('Could not scan URL. Try entering product details manually.'); setProduct({ name: url.trim(), description: '', price: '', keyFeatures: [] }) }
    finally { setScanning(false) }
  }

  async function handleGenerate() {
    if (!apiKey) { setError('Add your Muapi API key.'); return }
    if (!product) { setError('Scan a product URL first.'); return }
    setError(''); setLoading(true); setResult(null)
    try {
      const prompt = `UGC advertisement for ${product.name}. ${product.description}. Key features: ${(product.keyFeatures || []).join(', ')}. ${hookStyle.replace('_', ' ')} style. ${platform.ratio} aspect ratio. Cinematic quality, authentic feel.`
      const body = { prompt, aspect_ratio: platform.ratio, duration: 30, quality: 'high' }
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
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>MARKETING STUDIO</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>PRODUCT URL TO AD</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Paste any product URL and get auto-generated video ads</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste product URL (Amazon, Shopify, etc.)" style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
            onKeyDown={e => e.key === 'Enter' && handleScan()} />
          <button onClick={handleScan} disabled={scanning || !url.trim()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: 'var(--accent-primary)', color: '#000', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Search size={14} /> {scanning ? 'Scanning...' : 'Scan Product'}
          </button>
        </div>
      </div>
      {product && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Package size={20} style={{ color: 'var(--accent-primary)' }} /><div><div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{product.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{product.price}</div></div></div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{product.description}</div>
          {product.keyFeatures?.length > 0 && (
            <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>KEY FEATURES</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{product.keyFeatures.map((f, i) => <span key={i} style={{ padding: '3px 10px', background: 'var(--bg-input)', borderRadius: 100, fontSize: 11, color: 'var(--text-secondary)' }}>{f}</span>)}</div></div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>HOOK STYLE</div>
              <select value={hookStyle} onChange={e => setHookStyle(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                {HOOK_STYLES.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}</select></div>
            <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>PLATFORM</div>
              <select value={platform.id} onChange={e => setPlatform(PLATFORMS.find(p => p.id === e.target.value))} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label} ({p.ratio})</option>)}</select></div>
            <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>MODEL</div>
              <select value={model.id} onChange={e => setModel(AD_MODELS.find(m => m.id === e.target.value))} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                {AD_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
          </div>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fca5a5' }}>{error}</div>}
          <button onClick={handleGenerate} disabled={loading} style={{ padding: '12px 0', background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Generating ad...' : `Generate Ad · ${model.creditCost} credits`}
          </button>
          {result && (
            <div><div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Result</div>
              <video src={result.url} controls autoPlay loop style={{ width: '100%', borderRadius: 10, maxHeight: 400 }} />
              <a href={result.url} download style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: '8px 0', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}><Download size={14} /> Download</a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
