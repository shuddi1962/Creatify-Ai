'use client'
import { useAuth } from '@/src/lib/AuthProvider'

export default function CreditsSection() {
  const { user } = useAuth()
  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Credits Usage</div>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Monthly Usage</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>2,450 / 4,000</span>
          </div>
          <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ width: '61%', height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), #a78bfa)', borderRadius: 100 }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Resets on Apr 10, 2026</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { desc: 'Text to Image · Flux Pro', credits: 12, date: '2 hours ago' },
            { desc: 'Text to Video · Kling 1.6', credits: 45, date: '5 hours ago' },
            { desc: 'Image to Video · Veo 2', credits: 30, date: '1 day ago' },
            { desc: 'Lip Sync · Portrait Mode', credits: 8, date: '2 days ago' },
            { desc: 'Voiceover · ElevenLabs', credits: 3, date: '3 days ago' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{item.desc}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{item.date}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-primary)' }}>-{item.credits}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
