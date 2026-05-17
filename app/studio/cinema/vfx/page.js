'use client'
import { useState, useRef } from 'react'
import { Upload, X, Download } from 'lucide-react'

const VFX_EFFECTS = [
  { id: 'explosion', name: 'Explosion', category: 'Fire & Explosion', credits: 50, muapiName: 'Explosion', desc: 'Massive explosion engulfs the scene' },
  { id: 'nuclear-blast', name: 'Nuclear Blast', category: 'Fire & Explosion', credits: 80, muapiName: 'Nuclear Blast', desc: 'Enormous shockwave mushroom cloud' },
  { id: 'car-explosion', name: 'Car Explosion', category: 'Fire & Explosion', credits: 45, muapiName: 'Car Explosion', desc: 'Vehicle explodes in a ball of fire' },
  { id: 'building-collapse', name: 'Building Collapse', category: 'Fire & Explosion', credits: 60, muapiName: 'Building Collapse', desc: 'Structure crumbles dramatically' },
  { id: 'fire-engulf', name: 'Fire Engulf', category: 'Fire & Explosion', credits: 40, muapiName: 'Fire Engulf', desc: 'Scene consumed by roaring flames' },
  { id: 'fire-tornado', name: 'Fire Tornado', category: 'Fire & Explosion', credits: 55, muapiName: 'Fire Tornado', desc: 'Spinning column of fire' },
  { id: 'lightning-strike', name: 'Lightning Strike', category: 'Weather', credits: 30, muapiName: 'Lightning Strike', desc: 'Powerful lightning bolt hits' },
  { id: 'thunder-storm', name: 'Thunder Storm', category: 'Weather', credits: 35, muapiName: 'Thunder Storm', desc: 'Dark stormy skies with thunder' },
  { id: 'heavy-rain', name: 'Heavy Rain', category: 'Weather', credits: 25, muapiName: 'Heavy Rain', desc: 'Torrential downpour' },
  { id: 'blizzard', name: 'Blizzard', category: 'Weather', credits: 30, muapiName: 'Blizzard', desc: 'Whiteout snowstorm' },
  { id: 'tornado', name: 'Tornado', category: 'Weather', credits: 45, muapiName: 'Tornado', desc: 'Destructive twister tears through' },
  { id: 'raven-transition', name: 'Raven Transition', category: 'Magic', credits: 40, muapiName: 'Raven Transition', desc: 'Transform into a flock of ravens' },
  { id: 'air-bending', name: 'Air Bending', category: 'Magic', credits: 35, muapiName: 'Air Bending', desc: 'Powerful air currents swirl' },
  { id: 'phoenix-rise', name: 'Phoenix Rise', category: 'Magic', credits: 60, muapiName: 'Phoenix Rise', desc: 'Majestic phoenix emerges from flames' },
  { id: 'portal-open', name: 'Portal Open', category: 'Magic', credits: 50, muapiName: 'Portal Open', desc: 'Glowing dimensional portal appears' },
  { id: 'shadow-smoke', name: 'Shadow Smoke', category: 'Magic', credits: 30, muapiName: 'Shadow Smoke', desc: 'Mysterious dark smoke tendrils' },
  { id: 'werewolf', name: 'Werewolf Transform', category: 'Creatures', credits: 65, muapiName: 'Werewolf', desc: 'Terrifying werewolf transformation' },
  { id: 'dragon-wings', name: 'Dragon Wings', category: 'Creatures', credits: 70, muapiName: 'Dragon Wings', desc: 'Dragon wings spread dramatically' },
  { id: 'animalization', name: 'Animalization', category: 'Creatures', credits: 55, muapiName: 'Animalization', desc: 'Transform into an animal form' },
  { id: 'matrix-rain', name: 'Matrix Rain', category: 'Technology', credits: 30, muapiName: 'Matrix Rain', desc: 'Green code rain falls' },
  { id: 'glitch-effect', name: 'Glitch Effect', category: 'Technology', credits: 25, muapiName: 'Glitch Effect', desc: 'Digital glitch distortion' },
  { id: 'hologram', name: 'Hologram', category: 'Technology', credits: 35, muapiName: 'Hologram', desc: 'Holographic projection flickers' },
  { id: 'laser-beams', name: 'Laser Beams', category: 'Technology', credits: 30, muapiName: 'Laser Beams', desc: 'Intense laser beams shoot out' },
  { id: 'galaxy-zoom', name: 'Galaxy Zoom', category: 'Space', credits: 55, muapiName: 'Galaxy Zoom Out', desc: 'Zoom out into the galaxy' },
  { id: 'solar-flare', name: 'Solar Flare', category: 'Space', credits: 50, muapiName: 'Solar Flare', desc: 'Massive solar flare erupts' },
  { id: 'black-hole', name: 'Black Hole', category: 'Space', credits: 60, muapiName: 'Black Hole', desc: 'Gravitational singularity appears' },
  { id: 'northern-lights', name: 'Northern Lights', category: 'Light & Color', credits: 35, muapiName: 'Northern Lights', desc: 'Aurora borealis shimmers' },
  { id: 'lens-flare', name: 'Lens Flare', category: 'Light & Color', credits: 20, muapiName: 'Lens Flare', desc: 'Cinematic lens flare burst' },
  { id: 'bloom-light', name: 'Bloom Light', category: 'Light & Color', credits: 25, muapiName: 'Bloom Light', desc: 'Dreamy light bloom diffusion' },
  { id: 'match-cut', name: 'Match Cut', category: 'Transition', credits: 30, muapiName: 'Match Cut', desc: 'Viral match cut transition' },
  { id: 'whip-pan', name: 'Whip Pan', category: 'Transition', credits: 25, muapiName: 'Whip Pan', desc: 'Fast horizontal pan transition' },
  { id: 'melt-transition', name: 'Melt Transition', category: 'Transition', credits: 35, muapiName: 'Melt Transition', desc: 'Scene melts into the next' },
  { id: 'tidal-wave', name: 'Tidal Wave', category: 'Destruction', credits: 60, muapiName: 'Tidal Wave', desc: 'Massive tsunami wave crashes' },
  { id: 'earthquake', name: 'Earthquake', category: 'Destruction', credits: 50, muapiName: 'Earthquake', desc: 'Ground splits and trembles' },
  { id: 'volcanic-eruption', name: 'Volcanic Eruption', category: 'Destruction', credits: 65, muapiName: 'Volcanic Eruption', desc: 'Volcano explodes with lava' },
  { id: 'dust-particles', name: 'Dust Particles', category: 'Nature', credits: 20, muapiName: 'Dust Particles', desc: 'Golden dust particles float' },
  { id: 'point-cloud', name: 'Point Cloud', category: 'Nature', credits: 40, muapiName: 'Point Cloud', desc: 'Subject dissolves into particles' },
]

const CATEGORIES = ['All', 'Fire & Explosion', 'Weather', 'Magic', 'Creatures', 'Technology', 'Space', 'Light & Color', 'Transition', 'Destruction', 'Nature']

export default function VFXPresetsPage() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('muapi_key') : ''
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedEffect, setSelectedEffect] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [quality, setQuality] = useState('medium')
  const [duration, setDuration] = useState(5)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const filtered = activeCategory === 'All' ? VFX_EFFECTS : VFX_EFFECTS.filter(e => e.category === activeCategory)

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedImage(URL.createObjectURL(file))
    if (apiKey) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('https://api.muapi.ai/v1/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}` }, body: fd })
        const data = await res.json()
        setUploadedImageUrl(data.url || data.file_url || '')
      } catch { setUploadedImageUrl('') }
    }
  }

  async function handleApplyVFX() {
    if (!apiKey) { setError('Add your Muapi API key in Settings.'); return }
    if (!selectedEffect) { setError('Select a VFX effect first.'); return }
    if (!uploadedImageUrl && !uploadedImage) { setError('Upload an image first.'); return }
    setError(''); setLoading(true); setResult(null)
    try {
      const effectPrompt = prompt.trim() ? `${selectedEffect.muapiName}: ${prompt.trim()}` : selectedEffect.muapiName
      const body = {
        prompt: effectPrompt, image_url: uploadedImageUrl || uploadedImage,
        name: selectedEffect.muapiName, aspect_ratio: aspectRatio, quality, duration,
      }
      const response = await fetch('https://api.muapi.ai/v1/vfx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      })
      if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.message || `Failed (${response.status})`) }
      const data = await response.json()
      const jobId = data.id || data.request_id
      if (jobId) {
        for (let i = 0; i < 120; i++) {
          await new Promise(r => setTimeout(r, 2500))
          const poll = await fetch(`https://api.muapi.ai/v1/predict/results/${jobId}`, { headers: { 'Authorization': `Bearer ${apiKey}` } })
          if (!poll.ok) continue
          const pd = await poll.json()
          if (pd.status === 'succeeded' || pd.output || pd.url) { setResult({ url: pd.url || pd.output?.url || pd.output?.[0] }); break }
          if (pd.status === 'failed') throw new Error('VFX generation failed')
        }
      } else if (data.url) { setResult({ url: data.url }) }
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>CINEMA STUDIO — VFX</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>VFX PRESETS</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{VFX_EFFECTS.length}+ one-click visual effects — explosions, magic, weather, creatures and more</p>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: activeCategory === cat ? 'var(--accent-primary)' : 'var(--bg-elevated)', color: activeCategory === cat ? '#000' : 'var(--text-secondary)', transition: 'all 150ms' }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {filtered.map(effect => (
            <div key={effect.id} onClick={() => { setSelectedEffect(effect); setResult(null); setError('') }} style={{ background: 'var(--bg-card)', border: selectedEffect?.id === effect.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)', borderRadius: 14, padding: '16px 14px', cursor: 'pointer', transition: 'all 150ms', position: 'relative' }}
              onMouseEnter={e => { if (selectedEffect?.id !== effect.id) e.currentTarget.style.borderColor = 'var(--border-default)' }}
              onMouseLeave={e => { if (selectedEffect?.id !== effect.id) e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>
              {selectedEffect?.id === effect.id && <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{effect.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>{effect.desc}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-primary)' }}>{effect.credits} credits</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '20px', position: 'sticky', top: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{selectedEffect ? `Apply: ${selectedEffect.name}` : 'Select an effect to start'}</h3>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Your image</div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
            {uploadedImage ? (
              <div style={{ position: 'relative' }}>
                <img src={uploadedImage} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }} />
                <button onClick={() => { setUploadedImage(null); setUploadedImageUrl('') }} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{ height: 130, border: '2px dashed var(--border-default)', borderRadius: 10, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--bg-input)', transition: 'border-color 150ms' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
                <Upload size={22} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Click or drag image here</span>
              </div>
            )}
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Scene context (optional)</div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g. A cinematic explosion in slow motion..." rows={2} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div><div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Aspect Ratio</div>
              <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '7px 10px', fontSize: 12, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                {['16:9','9:16','1:1','4:3'].map(r => <option key={r}>{r}</option>)}</select></div>
            <div><div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Duration</div>
              <select value={duration} onChange={e => setDuration(Number(e.target.value))} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '7px 10px', fontSize: 12, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                {[3,5,8,10].map(d => <option key={d} value={d}>{d}s</option>)}</select></div>
          </div>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fca5a5', marginBottom: 12 }}>{error}</div>}
          <button onClick={handleApplyVFX} disabled={loading || !selectedEffect} style={{ width: '100%', padding: '12px 0', background: !selectedEffect ? 'var(--bg-input)' : loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)', color: !selectedEffect ? 'var(--text-muted)' : 'var(--btn-generate-text)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: !selectedEffect ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #000', borderTopColor: 'transparent', animation: 'spin 600ms linear infinite' }} /> Applying VFX...</> : selectedEffect ? `Apply ${selectedEffect.name} · ${selectedEffect.credits} credits` : 'Select an effect first'}
          </button>
          {result && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Result</div>
              <video src={result.url} controls autoPlay loop style={{ width: '100%', borderRadius: 10 }} />
              <a href={result.url} download style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: '8px 0', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>
                <Download size={14} /> Download Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
