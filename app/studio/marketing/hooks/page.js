'use client'
import { useState } from 'react'
import { Copy, Sparkles } from 'lucide-react'

const HOOK_TONES = ['Funny', 'Inspirational', 'Urgent', 'Curious', 'Shocking', 'Educational', 'Relatable']
const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter/X']

export default function HooksPage() {
  const [niche, setNiche] = useState('')
  const [audience, setAudience] = useState('')
  const [platform, setPlatform] = useState('TikTok')
  const [tone, setTone] = useState('Curious')
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState([])

  async function handleGenerate() {
    if (!niche.trim()) return
    setLoading(true)
    // Simulated hook generation (use Claude API when available)
    await new Promise(r => setTimeout(r, 1500))
    const sampleHooks = [
      `Stop scrolling if you ${niche.toLowerCase().includes('product') ? 'want to save money' : 'love ' + niche}`,
      `I tried ${niche} for 30 days and here's what happened`,
      `The #1 mistake people make with ${niche}`,
      `Nobody tells you this about ${niche}`,
      `This ${niche} hack changed everything`,
      `Why ${niche} is blowing up right now`,
      `3 ${niche} secrets they don't want you to know`,
      `Your ${niche} routine is wrong. Here's why`,
      `I wish I knew this about ${niche} sooner`,
      `The truth about ${niche} nobody talks about`,
      `${niche} experts hate this one simple trick`,
      `What they don't teach you about ${niche}`,
      `${tone} ${audience || 'viewers'} — this ${niche} tip will blow your mind`,
      `${niche} in 2026: what's changed and what hasn't`,
      `Everything you know about ${niche} is a lie`,
      `How ${niche} changed my life in 7 days`,
      `The ${niche} trend everyone's talking about`,
      `Don't start ${niche} until you watch this`,
      `This ${niche} strategy got me 1M views`,
      `Why ${niche} is the future of ${platform}`,
    ].sort(() => Math.random() - 0.5).slice(0, 10)
    setHooks(sampleHooks)
    setLoading(false)
  }

  function copyHook(hook) {
    navigator.clipboard.writeText(hook)
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>MARKETING STUDIO</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>HOOK GENERATOR</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Generate proven viral opening hooks for any niche or product</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '24px', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>NICHE / TOPIC</div>
            <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. Fitness, Skincare, SaaS..." style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} /></div>
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>TARGET AUDIENCE (optional)</div>
            <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Busy moms, Startup founders..." style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>PLATFORM</div>
            <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}</select></div>
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>TONE</div>
            <select value={tone} onChange={e => setTone(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
              {HOOK_TONES.map(t => <option key={t}>{t}</option>)}</select></div>
        </div>
        <button onClick={handleGenerate} disabled={loading || !niche.trim()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
          <Sparkles size={16} /> {loading ? 'Generating hooks...' : 'Generate 10 Hooks'}
        </button>
      </div>
      {hooks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {hooks.map((hook, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, width: 20 }}>{i + 1}.</span>
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{hook}</span>
              </div>
              <button onClick={() => copyHook(hook)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, flexShrink: 0 }} title="Copy hook"><Copy size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
