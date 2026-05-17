'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const GENRES = [
  { id: 'action', name: 'Action', desc: 'Explosions, chases, and high-octane thrills', styles: 'fast-paced, quick cuts, intense, dramatic lighting, explosive' },
  { id: 'horror', name: 'Horror', desc: 'Fear, tension, and supernatural suspense', styles: 'dark, eerie, shadowy, suspenseful, unsettling atmosphere' },
  { id: 'romance', name: 'Romance', desc: 'Love stories and emotional connections', styles: 'warm, soft lighting, intimate, dreamy, golden hour' },
  { id: 'scifi', name: 'Sci-Fi', desc: 'Futuristic worlds and advanced technology', styles: 'neon, metallic, futuristic, cyberpunk, high-tech, sleek' },
  { id: 'drama', name: 'Drama', desc: 'Character-driven emotional storytelling', styles: 'emotional, intimate, character-focused, naturalistic lighting' },
  { id: 'comedy', name: 'Comedy', desc: 'Humorous content and light-hearted fun', styles: 'bright, vibrant, energetic, colorful, upbeat' },
  { id: 'thriller', name: 'Thriller', desc: 'Suspenseful tension and twists', styles: 'tense, mysterious, shadowy, rapid editing, close-ups' },
  { id: 'documentary', name: 'Documentary', desc: 'Factual storytelling and real-world subjects', styles: 'natural, authentic, interview-style, verite, real footage feel' },
  { id: 'fantasy', name: 'Fantasy', desc: 'Magical realms and mythical creatures', styles: 'enchanted, ethereal, mystical, vibrant, epic' },
  { id: 'animation', name: 'Animation', desc: 'Animated visual storytelling', styles: 'stylized, colorful, illustrated, cartoon, artistic' },
  { id: 'music-video', name: 'Music Video', desc: 'Visual storytelling set to music', styles: 'rhythmic editing, stylized, artistic, experimental, beat-synced' },
  { id: 'commercial', name: 'Commercial', desc: 'Product and brand advertising', styles: 'polished, product-focused, professional, bright, clean' },
]

export default function GenresPage() {
  const router = useRouter()
  const [selectedGenre, setSelectedGenre] = useState(null)

  function handleSelect(genre) {
    setSelectedGenre(genre)
    localStorage.setItem('cinema_genre_style', genre.styles)
    router.push(`/studio/cinema/generate?genre=${genre.id}`)
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>CINEMA STUDIO — GENRES</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>GENRE PRESETS</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>One-click style presets for every cinematic genre — click to start generating</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {GENRES.map(g => (
          <div key={g.id} onClick={() => handleSelect(g)} style={{ background: 'var(--bg-card)', border: selectedGenre?.id === g.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)', borderRadius: 20, padding: '24px', cursor: 'pointer', transition: 'all 200ms', position: 'relative' }}
            onMouseEnter={e => { if (selectedGenre?.id !== g.id) e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
            onMouseLeave={e => { if (selectedGenre?.id !== g.id) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)' } }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{g.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{g.desc}</div>
            <div style={{ marginTop: 12, fontSize: 10, color: 'var(--accent-primary)', fontWeight: 600 }}>Click to start →</div>
          </div>
        ))}
      </div>
    </div>
  )
}
