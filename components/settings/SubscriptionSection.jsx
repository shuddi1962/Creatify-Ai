'use client'
export default function SubscriptionSection() {
  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Subscription</div>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Pro Plan</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>$29/month, renews on Mar 10, 2026</div>
            </div>
            <span style={{ padding: '4px 10px', fontSize: 10, fontWeight: 700, background: 'rgba(34,197,94,0.15)', color: '#22c55e', borderRadius: 100 }}>Active</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { value: '2,450', label: 'Credits Remaining', bar: 61 },
              { value: '4.2 GB', label: 'Storage Used' },
              { value: '12,840', label: 'API Calls' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                {s.bar && <div style={{ height: 4, background: 'var(--bg-input)', borderRadius: 100, marginTop: 8 }}>
                  <div style={{ width: `${s.bar}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: 100 }} />
                </div>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '8px 20px', fontSize: 12, fontWeight: 600, background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Upgrade Plan</button>
            <button style={{ padding: '8px 20px', fontSize: 12, fontWeight: 500, background: 'transparent', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer' }}>Downgrade</button>
          </div>
        </div>
      </div>
    </div>
  )
}
