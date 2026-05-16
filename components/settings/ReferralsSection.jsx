'use client'
import { useAuth } from '@/src/lib/AuthProvider'
import toast from 'react-hot-toast'

export default function ReferralsSection() {
  const { user } = useAuth()
  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Referrals</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Share your unique referral link and earn credits</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input readOnly value={`https://creatify.ai/ref/${user?.id || 'user123'}`} style={{ flex: 1, padding: '10px 12px', fontSize: 12, fontFamily: 'monospace', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
          <button onClick={() => { navigator.clipboard.writeText(`https://creatify.ai/ref/${user?.id || 'user123'}`); toast.success('Copied!') }} style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Copy Link</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { value: '47', label: 'Total Referred' },
            { value: '235', label: 'Credits Earned', accent: true },
            { value: '12', label: 'Pending' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.accent ? 'var(--btn-generate-bg)' : 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Earn 5 credits for every referral who upgrades to Pro</div>
      </div>
    </div>
  )
}
