'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ApiKeysSection() {
  const [newKeyName, setNewKeyName] = useState('')
  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>API Keys</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {[
            { name: 'Production Key', key: 'mk_prod_****...****f3a2', created: 'Jan 15, 2026' },
            { name: 'Development Key', key: 'mk_dev_****...****7b1c', created: 'Feb 20, 2026' },
          ].map((k, i) => (
            <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{k.name}</div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: 2 }}>{k.key}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>Created {k.created}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { navigator.clipboard.writeText(k.key); toast.success('Copied!') }} style={{ padding: '5px 12px', fontSize: 11, fontWeight: 500, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer' }}>Copy</button>
                <button style={{ padding: '5px 12px', fontSize: 11, fontWeight: 500, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#ef4444', cursor: 'pointer' }}>Revoke</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Create New Key</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="Key name..." style={{ flex: 1, padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
          <button onClick={() => { toast.success('API key created'); setNewKeyName('') }} style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Create</button>
        </div>
      </div>
    </div>
  )
}
