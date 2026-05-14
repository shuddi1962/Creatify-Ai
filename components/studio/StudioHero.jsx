'use client'

export default function StudioHero({ icon: Icon, featureName, subtitle }) {
  return (
    <div style={{
      position: 'relative',
      textAlign: 'center',
      padding: '64px 24px 48px',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 600px 300px at 50% 0%,
            rgba(0,194,255,0.08) 0%, transparent 70%)
        `,
        pointerEvents: 'none',
      }} />

      {Icon && (
        <div style={{
          position: 'relative',
          width: 72, height: 72, borderRadius: 20,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 0 0 1px rgba(0,194,255,0.1), 0 8px 24px rgba(0,0,0,0.2)',
        }}>
          <Icon size={32} style={{ color: 'var(--accent-primary)' }} />
          <div style={{
            position: 'absolute', top: -4, right: -4,
            width: 14, height: 14, borderRadius: '50%',
            background: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, color: '#000',
          }}>✦</div>
        </div>
      )}

      {featureName && (
        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 900, color: 'var(--text-primary)',
          textTransform: 'uppercase', letterSpacing: '0.02em',
          lineHeight: 1.1, marginBottom: 12,
        }}>
          {featureName}
        </h1>
      )}

      {subtitle && (
        <p style={{
          fontSize: 16, color: 'var(--text-secondary)',
          maxWidth: 500, margin: '0 auto',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
