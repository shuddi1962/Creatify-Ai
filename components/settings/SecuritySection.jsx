'use client'
import toast from 'react-hot-toast'

export default function SecuritySection() {
  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Change Password</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="password" placeholder="Current password" style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
          <input type="password" placeholder="New password" style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
          <input type="password" placeholder="Confirm new password" style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
          <button style={{ alignSelf: 'flex-start', padding: '8px 20px', fontSize: 13, fontWeight: 600, background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 4 }} onClick={() => toast.success('Password updated')}>Update Password</button>
        </div>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Two-Factor Authentication</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>Add an extra layer of security to your account</div>
        <button style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Set Up 2FA</button>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Active Sessions</div>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>Chrome on MacOS</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>New York, US · 2 hours ago</div>
          </div>
          <button style={{ padding: '4px 10px', fontSize: 11, background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Revoke</button>
        </div>
      </div>
      <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>Danger Zone</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>Permanently delete your account and all data</div>
        <button style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
        >Delete Account</button>
      </div>
    </div>
  )
}
