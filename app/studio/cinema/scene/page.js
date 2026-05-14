'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const COMPOSITIONS = ['Rule of Thirds', 'Golden Ratio', 'Leading Lines', 'Symmetry', 'Frame within Frame', 'Center Composition', 'Diagonal', 'Negative Space']
const LIGHTINGS = ['Golden Hour', 'Studio Soft', 'Natural Daylight', 'Dramatic Side', 'Rim Light', 'Backlight', 'Neon Night', 'Candlelight']
const WEATHERS = ['Clear', 'Overcast', 'Rainy', 'Stormy', 'Snowy', 'Foggy', 'Windy', 'Humid']
const TIMES = ['Sunrise', 'Morning', 'Noon', 'Afternoon', 'Golden Hour', 'Sunset', 'Twilight', 'Night', 'Midnight']

export default function ScenePage() {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [background, setBackground] = useState('')
  const [foreground, setForeground] = useState('')
  const [lighting, setLighting] = useState('Golden Hour')
  const [weather, setWeather] = useState('Clear')
  const [timeOfDay, setTimeOfDay] = useState('Golden Hour')
  const [composition, setComposition] = useState('Rule of Thirds')

  function buildPrompt() {
    const parts = []
    if (subject.trim()) parts.push(`Subject: ${subject.trim()}`)
    if (background.trim()) parts.push(`Background: ${background.trim()}`)
    if (foreground.trim()) parts.push(`Foreground: ${foreground.trim()}`)
    parts.push(`Lighting: ${lighting}`)
    parts.push(`Weather: ${weather}`)
    parts.push(`Time: ${timeOfDay}`)
    parts.push(`Composition: ${composition}`)
    parts.push('cinematic quality, film-grade')
    return parts.join('. ')
  }

  function handleGenerate() {
    const prompt = buildPrompt()
    localStorage.setItem('cinema_scene_prompt', prompt)
    router.push('/studio/cinema/generate')
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>CINEMA STUDIO — SCENE COMPOSITION</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>SCENE COMPOSITION</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Director-level control over every element in your scene</p>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { label: 'SUBJECT', value: subject, set: setSubject, placeholder: 'e.g. A lone warrior in silver armor' },
          { label: 'BACKGROUND', value: background, set: setBackground, placeholder: 'e.g. Misty mountain range at dawn' },
          { label: 'FOREGROUND', value: foreground, set: setForeground, placeholder: 'e.g. Crumbling stone pillars with vines' },
        ].map(f => (
          <div key={f.label}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{f.label}</div>
            <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'LIGHTING', value: lighting, set: setLighting, options: LIGHTINGS },
            { label: 'WEATHER', value: weather, set: setWeather, options: WEATHERS },
            { label: 'TIME OF DAY', value: timeOfDay, set: setTimeOfDay, options: TIMES },
            { label: 'COMPOSITION', value: composition, set: setComposition, options: COMPOSITIONS },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</div>
              <select value={s.value} onChange={e => s.set(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                {s.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: '14px', marginTop: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>COMPOUND PROMPT PREVIEW</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{buildPrompt()}</div>
        </div>
        <button onClick={handleGenerate} style={{ padding: '14px 0', background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
          ✦ Open in Cinema Generator
        </button>
      </div>
    </div>
  )
}
