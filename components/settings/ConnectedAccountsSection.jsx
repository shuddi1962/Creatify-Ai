'use client'
export default function ConnectedAccountsSection() {
  const accounts = [
    { platform: 'TikTok', connected: true, user: '@creatifyai' },
    { platform: 'Instagram', connected: true, user: 'creatify_official' },
    { platform: 'YouTube', connected: false },
    { platform: 'LinkedIn', connected: false },
    { platform: 'Google Drive', connected: true, user: 'user@gmail.com' },
    { platform: 'Dropbox', connected: false },
  ]
  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Connected Accounts</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {accounts.map((acc, i) => (
            <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{acc.platform}</div>
                {acc.connected && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{acc.user}</div>}
              </div>
              {acc.connected ? (
                <button style={{ padding: '5px 12px', fontSize: 11, fontWeight: 500, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: '#ef4444', cursor: 'pointer' }}>Disconnect</button>
              ) : (
                <button style={{ padding: '5px 12px', fontSize: 11, fontWeight: 600, background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Connect</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
