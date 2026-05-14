'use client'
import { useState } from 'react'

const BRAND_VOICES = ['Professional', 'Friendly', 'Luxury', 'Playful', 'Bold', 'Minimal', 'Technical', 'Empathetic']

export default function BrandKitPage() {
  const [brandName, setBrandName] = useState('')
  const [tagline, setTagline] = useState('')
  const [colors, setColors] = useState({ primary: '#6366f1', secondary: '#06b6d4', accent: '#f59e0b', background: '#ffffff' })
  const [fonts, setFonts] = useState({ heading: 'Inter', body: 'Inter' })
  const [voice, setVoice] = useState('Professional')
  const [logo, setLogo] = useState(null)

  function handleLogoUpload(e) {
    const file = e.target.files?.[0]
    if (file) setLogo(URL.createObjectURL(file))
  }

  function handleSave() {
    const kit = { brandName, tagline, colors, fonts, voice, logo }
    localStorage.setItem('brand_kit', JSON.stringify(kit))
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>MARKETING STUDIO</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>BRAND KIT</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Upload logo, colors, and fonts once — applied to all outputs</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 16, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
            {logo ? <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 24, color: 'var(--text-muted)' }}>📎</span>}
          </div>
          <div><label htmlFor="logo-upload" style={{ display: 'inline-block', padding: '7px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>Upload Logo</label>
            <input id="logo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>BRAND NAME</div>
            <input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Your brand name" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} /></div>
          <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>TAGLINE</div>
            <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Your brand tagline" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} /></div>
        </div>
        <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>BRAND COLORS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {Object.entries(colors).map(([key, val]) => (
              <div key={key}><div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: 4 }}>{key}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="color" value={val} onChange={e => setColors(c => ({ ...c, [key]: e.target.value }))} style={{ width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer', padding: 0 }} />
                  <input value={val} onChange={e => setColors(c => ({ ...c, [key]: e.target.value }))} style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace' }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>BRAND VOICE</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BRAND_VOICES.map(v => (
              <button key={v} onClick={() => setVoice(v)} style={{ padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: voice === v ? 'var(--accent-primary)' : 'var(--bg-elevated)', color: voice === v ? '#000' : 'var(--text-secondary)', transition: 'all 150ms' }}>{v}</button>
            ))}
          </div>
        </div>
        <button onClick={handleSave} style={{ padding: '12px 0', background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>✦ Save Brand Kit</button>
      </div>
    </div>
  )
}
