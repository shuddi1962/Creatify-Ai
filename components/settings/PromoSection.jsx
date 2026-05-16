'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function PromoSection() {
  const [code, setCode] = useState('')
  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Redeem Promo Code</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>Enter a promo code to get credits, discounts, or plan upgrades</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Enter code..." style={{ flex: 1, padding: '10px 12px', fontSize: 13, fontFamily: 'monospace', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
          <button onClick={() => { if (code.trim()) toast.success(`Code "${code}" redeemed!`); else toast.error('Enter a code first') }} style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, background: code.trim() ? 'var(--btn-generate-bg)' : 'var(--bg-input)', color: code.trim() ? 'var(--btn-generate-text)' : 'var(--text-muted)', border: 'none', borderRadius: 8, cursor: code.trim() ? 'pointer' : 'default' }}>Redeem</button>
        </div>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Active Promos</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { code: 'WELCOME50', credits: 50, expires: 'Apr 1, 2026' },
            { code: 'LAUNCH25', credits: 25, expires: 'May 15, 2026' },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{p.code}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.credits} credits · Expires {p.expires}</div>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(p.code); toast.success('Copied!') }} style={{ padding: '4px 10px', fontSize: 11, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer' }}>Copy</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
