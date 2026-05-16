'use client'
import { Gift } from 'lucide-react'

export default function GiftsSection() {
  const gifts = [
    { from: 'Sarah J.', plan: 'Pro Plan', date: 'Mar 12, 2026', status: 'active' },
    { from: 'Mike R.', plan: 'Plus Plan', date: 'Feb 28, 2026', status: 'active' },
    { from: 'Alex T.', plan: 'Free', date: 'Jan 5, 2026', status: 'expired' },
  ]
  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Gift size={20} style={{ color: 'var(--accent-primary)' }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Gifts Received</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Credits and plans gifted to you</div>
          </div>
        </div>
        {gifts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
            No gifts received yet. Share your referral link to earn credits!
          </div>
        ) : (
          gifts.map((g, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < gifts.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>From {g.from}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{g.plan} · {g.date}</div>
              </div>
              <span style={{ padding: '3px 8px', fontSize: 10, fontWeight: 600, borderRadius: 100, background: g.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.15)', color: g.status === 'active' ? '#22c55e' : '#6b7280' }}>
                {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
              </span>
            </div>
          ))
        )}
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Send a Gift</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>Gift credits or a subscription to another user</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="Recipient email" style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
          <select style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }}>
            <option>100 Credits ($4.99)</option>
            <option>500 Credits ($19.99)</option>
            <option>Plus Plan ($9.99/mo)</option>
            <option>Pro Plan ($29.00/mo)</option>
          </select>
          <button style={{ alignSelf: 'flex-start', padding: '8px 20px', fontSize: 13, fontWeight: 600, background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Send Gift</button>
        </div>
      </div>
    </div>
  )
}
