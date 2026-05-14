'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'

const STORY_MODELS = [{ id: 'kling-v2.6-pro-t2v', name: 'Kling 3.0 Pro', creditCost: 30 }, { id: 'seedance-v2.0-t2v', name: 'Seedance 2.0', creditCost: 25 }]

export default function StoriesPage() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('muapi_key') : ''
  const [sections, setSections] = useState([
    { id: 'hook', label: 'Hook', prompt: '', result: null, loading: false },
    { id: 'problem', label: 'Problem', prompt: '', result: null, loading: false },
    { id: 'cta', label: 'CTA', prompt: '', result: null, loading: false },
  ])
  const [model, setModel] = useState(STORY_MODELS[0])
  const [error, setError] = useState('')

  function updateSection(id, val) { setSections(prev => prev.map(s => s.id === id ? { ...s, prompt: val } : s)) }

  async function generateSection(id) {
    const section = sections.find(s => s.id === id)
    if (!section?.prompt?.trim() || !apiKey) { setError('Enter a prompt for this section'); return }
    setError(''); setSections(prev => prev.map(s => s.id === id ? { ...s, loading: true } : s))
    try {
      const body = { prompt: section.prompt + ', story ad section, cinematic, high quality', aspect_ratio: '9:16', duration: 10, quality: 'high' }
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
          if (pd.status === 'succeeded' || pd.output || pd.url) { setSections(prev => prev.map(s => s.id === id ? { ...s, result: { url: pd.url || pd.output?.url || pd.output?.[0] }, loading: false } : s)); break }
          if (pd.status === 'failed') throw new Error('Failed')
        }
      } else if (data.url) setSections(prev => prev.map(s => s.id === id ? { ...s, result: { url: data.url }, loading: false } : s))
    } catch (e) { setError(e.message) } finally { setSections(prev => prev.map(s => s.id === id ? { ...s, loading: false } : s)) }
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>MARKETING STUDIO</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>STORY AD BUILDER</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Build high-converting short-form story ads for any platform</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {sections.map((s, idx) => (
          <div key={s.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: idx === 0 ? 'var(--accent-primary)' : idx === 1 ? 'var(--accent-secondary)' : 'var(--badge-top-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#000', fontWeight: 700 }}>{idx + 1}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.label}</span>
            </div>
            <div style={{ height: 200, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {s.result ? <video src={s.result.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : s.loading ? <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 600ms linear infinite' }} /> : <span style={{ fontSize: 28, color: 'var(--text-muted)' }}>{idx === 0 ? '🎣' : idx === 1 ? '💡' : '🎯'}</span>}
            </div>
            <div style={{ padding: '12px 14px' }}>
              <textarea value={s.prompt} onChange={e => updateSection(s.id, e.target.value)} placeholder={`Describe the ${s.label.toLowerCase()} section...`} rows={2} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 10px', color: 'var(--text-primary)', fontSize: 12, resize: 'none', outline: 'none', fontFamily: 'inherit', marginBottom: 8 }} />
              <button onClick={() => generateSection(s.id)} disabled={s.loading || !s.prompt.trim() || !apiKey} style={{ width: '100%', padding: '7px 0', background: s.result ? 'rgba(0,255,148,0.2)' : 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 11, fontWeight: 600, color: s.result ? '#00FF94' : 'var(--text-secondary)', cursor: 'pointer' }}>
                {s.loading ? 'Generating...' : s.result ? 'Regenerate' : `Generate ${s.label}`}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
        <select value={model.id} onChange={e => setModel(STORY_MODELS.find(m => m.id === e.target.value))} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
          {STORY_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        {error && <span style={{ fontSize: 11, color: '#fca5a5' }}>{error}</span>}
      </div>
    </div>
  )
}
