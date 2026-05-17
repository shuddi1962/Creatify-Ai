'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'

const HOOK_STYLES = [
  { value: 'problem_solution', label: 'Problem / Solution', desc: 'Start with the pain point' },
  { value: 'before_after', label: 'Before / After', desc: 'Transformation story' },
  { value: 'testimonial', label: 'Testimonial', desc: 'Social proof first' },
  { value: 'tutorial', label: 'Tutorial / How-to', desc: 'Educational approach' },
  { value: 'unboxing', label: 'Unboxing', desc: 'Product reveal excitement' },
  { value: 'lifestyle', label: 'Lifestyle', desc: 'Aspirational living' },
  { value: 'urgent', label: 'Urgency / Scarcity', desc: 'Limited time offer' },
]

const TONES = ['Authentic & Raw', 'Energetic & Hype', 'Educational & Clear', 'Emotional & Heartfelt', 'Humorous & Fun', 'Urgent & Direct']
const CREATOR_STYLES = ['Female Creator', 'Male Creator', 'Voice-over Only', 'Text Animation', 'Screen Record + Voice', 'Talking Head']

const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok', ratio: '9:16', maxDur: 60 },
  { id: 'instagram', label: 'Instagram Reels', ratio: '9:16', maxDur: 90 },
  { id: 'youtube', label: 'YouTube Shorts', ratio: '9:16', maxDur: 60 },
  { id: 'facebook', label: 'Facebook', ratio: '16:9', maxDur: 120 },
  { id: 'linkedin', label: 'LinkedIn', ratio: '1:1', maxDur: 60 },
]

const UGC_MODELS = [
  { id: 'kling-v2.6-pro-t2v', name: 'Kling 3.0 Pro', creditCost: 30 },
  { id: 'seedance-v2.0-t2v', name: 'Seedance 2.0', creditCost: 25 },
  { id: 'veo3.1-text-to-video', name: 'Veo 3.1', creditCost: 40 },
  { id: 'wan2.5-text-to-video', name: 'WAN 2.5', creditCost: 12 },
]

export default function UGCGeneratorPage() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('muapi_key') : ''
  const [productDesc, setProductDesc] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['tiktok'])
  const [hookStyle, setHookStyle] = useState('problem_solution')
  const [tone, setTone] = useState('Authentic & Raw')
  const [duration, setDuration] = useState('30')
  const [creatorStyle, setCreatorStyle] = useState('Female Creator')
  const [variants, setVariants] = useState('1')
  const [selectedModel, setSelectedModel] = useState(UGC_MODELS[0])
  const [targetAudience, setTargetAudience] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  function togglePlatform(id) {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  function buildUGCPrompt(variantIndex = 0) {
    const hook = HOOK_STYLES.find(h => h.value === hookStyle)
    const platform = PLATFORMS.find(p => selectedPlatforms.includes(p.id))
    const hookPhrases = {
      problem_solution: `Start with a relatable problem, then reveal how ${productDesc} solves it`,
      before_after: `Show transformation: before using ${productDesc} vs after`,
      testimonial: `A real-feeling testimonial about ${productDesc} from a satisfied user`,
      tutorial: `Quick tutorial showing how to use ${productDesc} step by step`,
      unboxing: `Exciting unboxing reveal of ${productDesc}`,
      lifestyle: `${productDesc} seamlessly integrated into aspirational daily life`,
      urgent: `Limited time offer for ${productDesc}, act now`,
    }
    const twists = ['', ' with a surprising twist', ' using fast cuts', ' with emotional storytelling', ' with humor']
    return `${creatorStyle} creating a ${duration}-second ${tone.toLowerCase()} UGC advertisement for ${platform?.ratio || '9:16'} ${platform?.label || 'TikTok'}. ${hookPhrases[hookStyle]}${twists[variantIndex] || ''}. ${targetAudience ? `Target audience: ${targetAudience}.` : ''} Cinematic quality, authentic feel, mobile-optimized vertical format.`
  }

  async function handleGenerate() {
    if (!apiKey) { setError('Add your Muapi API key in Settings.'); return }
    if (!productDesc.trim()) { setError('Describe your product first.'); return }
    if (selectedPlatforms.length === 0) { setError('Select at least one platform.'); return }
    setError(''); setLoading(true); setResults([])
    const numVariants = parseInt(variants)
    try {
      const allResults = await Promise.allSettled(
        Array.from({ length: numVariants }, async (_, i) => {
          const prompt = buildUGCPrompt(i)
          const platform = PLATFORMS.find(p => selectedPlatforms[0] === p.id)
          const body = { prompt, aspect_ratio: platform?.ratio || '9:16', duration: parseInt(duration), quality: 'high' }
          const response = await fetch(`https://api.muapi.ai/v1/${selectedModel.id}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify(body),
          })
          if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.message || `Failed (${response.status})`) }
          const data = await response.json()
          const jobId = data.id || data.request_id
          if (!jobId && data.url) return { url: data.url, prompt, variantNum: i+1 }
          for (let attempt = 0; attempt < 120; attempt++) {
            await new Promise(r => setTimeout(r, 2500))
            const poll = await fetch(`https://api.muapi.ai/v1/predict/results/${jobId}`, { headers: { 'Authorization': `Bearer ${apiKey}` } })
            if (!poll.ok) continue
            const pd = await poll.json()
            if (pd.status === 'succeeded' || pd.output || pd.url) return { url: pd.url || pd.output?.url || pd.output?.[0], prompt, variantNum: i+1 }
            if (pd.status === 'failed') throw new Error('Generation failed')
          }
          throw new Error('Timed out')
        })
      )
      const successful = allResults.filter(r => r.status === 'fulfilled').map(r => r.value)
      setResults(successful)
      if (successful.length === 0) setError('All generations failed. Check your API key and credits.')
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>MARKETING STUDIO</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>UGC AD GENERATOR</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Create scroll-stopping UGC-style video ads that convert — powered by AI</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>PRODUCT / SERVICE</label>
            <textarea value={productDesc} onChange={e => setProductDesc(e.target.value)} placeholder="e.g. AI-powered skincare serum that reduces wrinkles in 7 days..." rows={3} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '12px 14px', color: 'var(--text-primary)', fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = 'var(--border-active)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>TARGET AUDIENCE (optional)</label>
            <input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="e.g. Women 25–45 interested in skincare..." style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>PLATFORMS</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => togglePlatform(p.id)} style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: selectedPlatforms.includes(p.id) ? 'var(--accent-primary)' : 'var(--bg-elevated)', color: selectedPlatforms.includes(p.id) ? '#000' : 'var(--text-secondary)', transition: 'all 150ms' }}>{p.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>HOOK STYLE</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {HOOK_STYLES.map(h => (
                <div key={h.value} onClick={() => setHookStyle(h.value)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', background: hookStyle === h.value ? 'var(--bg-active)' : 'var(--bg-elevated)', border: `1px solid ${hookStyle === h.value ? 'var(--border-active)' : 'transparent'}`, transition: 'all 150ms' }}>
                  <div><div style={{ fontSize: 13, fontWeight: 500, color: hookStyle === h.value ? 'var(--text-active)' : 'var(--text-primary)' }}>{h.label}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.desc}</div></div>
                  {hookStyle === h.value && <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[{ label: 'TONE', value: tone, setter: setTone, options: TONES }, { label: 'CREATOR STYLE', value: creatorStyle, setter: setCreatorStyle, options: CREATOR_STYLES }, { label: 'DURATION', value: duration, setter: setDuration, options: ['15','30','60'] }, { label: 'VARIANTS', value: variants, setter: setVariants, options: ['1','3','5','10'] }].map(({ label, value, setter, options }) => (
              <div key={label}><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</div>
                <select value={value} onChange={e => setter(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                  {options.map(o => <option key={o} value={o}>{o}{label === 'DURATION' ? 's' : ''}</option>)}</select></div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>AI MODEL</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {UGC_MODELS.map(m => (
                <div key={m.id} onClick={() => setSelectedModel(m)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, cursor: 'pointer', background: selectedModel.id === m.id ? 'var(--bg-active)' : 'var(--bg-elevated)', border: `1px solid ${selectedModel.id === m.id ? 'var(--border-active)' : 'transparent'}`, transition: 'all 150ms' }}>
                  <span style={{ fontSize: 13, color: selectedModel.id === m.id ? 'var(--text-active)' : 'var(--text-primary)', fontWeight: 500 }}>{m.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.creditCost} credits</span>
                </div>
              ))}
            </div>
          </div>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#fca5a5' }}>{error}</div>}
          <button onClick={handleGenerate} disabled={loading} style={{ width: '100%', padding: '14px 0', background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid #000',borderTopColor:'transparent',animation:'spin 600ms linear infinite' }} /> Generating {variants} variant{parseInt(variants)>1?'s':''}...</> : `Generate ${variants} UGC Ad${parseInt(variants)>1?'s':''} · ${selectedModel.creditCost * parseInt(variants)} credits`}
          </button>
        </div>
        <div>
          {results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Generated Ads ({results.length})</h3>
              {results.map((r, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden' }}>
                  <video src={r.url} controls autoPlay={i===0} loop muted={i>0} style={{ width: '100%', maxHeight: 400 }} />
                  <div style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Variant {r.variantNum} — {selectedModel.name}</div>
                    <a href={r.url} download style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}><Download size={14} /> Download</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-card)', border: '2px dashed var(--border-default)', borderRadius: 20, padding: '60px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16, color: 'var(--text-muted)' }}>&#9733;</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Your UGC ads appear here</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Fill in your product details and hit Generate</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
