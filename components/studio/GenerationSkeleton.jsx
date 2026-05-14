'use client'

export default function GenerationSkeleton({ count = 4 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 16, maxWidth: 900, margin: '0 auto', padding: '0 24px 32px',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{
            paddingTop: '75%',
            background: 'linear-gradient(90deg, var(--bg-card) 0%, var(--bg-elevated) 50%, var(--bg-card) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
          <div style={{ padding: '10px 12px' }}>
            <div style={{
              height: 12, background: 'var(--bg-elevated)',
              borderRadius: 6, marginBottom: 6, width: '80%',
              animation: 'shimmer 1.5s infinite',
            }} />
            <div style={{
              height: 10, background: 'var(--bg-elevated)',
              borderRadius: 6, width: '50%',
              animation: 'shimmer 1.5s infinite',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}
