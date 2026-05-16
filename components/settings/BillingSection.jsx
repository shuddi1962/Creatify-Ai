'use client'
export default function BillingSection() {
  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Payment Method</div>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 32, borderRadius: 6, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-primary)' }}>VISA</div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>•••• •••• •••• 4242</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Expires 12/2027</div>
          </div>
          <button style={{ marginLeft: 'auto', padding: '5px 12px', fontSize: 11, fontWeight: 500, background: 'transparent', border: '1px solid var(--border-default)', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer' }}>Update</button>
        </div>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Billing History</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { date: 'Mar 10, 2026', amount: '$29.00', plan: 'Pro Plan' },
            { date: 'Feb 10, 2026', amount: '$29.00', plan: 'Pro Plan' },
            { date: 'Jan 10, 2026', amount: '$29.00', plan: 'Pro Plan' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{b.date}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.plan}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{b.amount}</span>
                <button style={{ fontSize: 11, color: 'var(--accent-text)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
