'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'

export default function DeleteAccountPage() {
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleDelete() {
    if (confirm !== 'DELETE') { setError('Type DELETE to confirm'); return }
    setLoading(true)
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setError('Not authenticated'); setLoading(false); return }
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Deletion failed')
      }
      await supabase.auth.signOut()
      router.push('/studio/signup?deleted=true')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0F1E', padding: 20 }}>
      <div style={{ maxWidth: 440, width: '100%', background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>Delete Account</h1>
        <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20, lineHeight: 1.6 }}>
          This will permanently delete your account and all associated data including generations, saved ideas, characters, and settings. This action cannot be undone.
        </p>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: '#d1d5db', marginBottom: 6 }}>Type <strong>DELETE</strong> to confirm:</p>
          <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Type DELETE"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#F9FAFB', fontSize: 14, outline: 'none' }} />
        </div>
        {error && <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 12 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/studio/settings')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading || confirm !== 'DELETE'}
            style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 600, cursor: (loading || confirm !== 'DELETE') ? 'not-allowed' : 'pointer', opacity: (loading || confirm !== 'DELETE') ? 0.5 : 1 }}>
            {loading ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
