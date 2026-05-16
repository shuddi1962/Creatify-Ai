'use client'
export default function NotificationsSection() {
  const toggles = [
    { label: 'Generation complete', desc: 'When any generation finishes', enabled: true },
    { label: 'Bulk job done', desc: 'When a bulk batch completes', enabled: true },
    { label: 'Credits low', desc: 'When credits fall below 10%', enabled: true },
    { label: 'Weekly summary', desc: 'Your weekly activity report', enabled: false },
    { label: 'Product updates', desc: 'New features and improvements', enabled: false },
    { label: 'Marketing emails', desc: 'Promotions and offers', enabled: false },
  ]
  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Notification Preferences</div>
        {toggles.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < toggles.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{t.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.desc}</div>
            </div>
            <button style={{ width: 36, height: 20, borderRadius: 100, position: 'relative', background: t.enabled ? 'var(--accent-primary)' : 'var(--bg-input)', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: t.enabled ? 16 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 150ms' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
