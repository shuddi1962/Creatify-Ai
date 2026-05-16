'use client'
import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.includes('@')) { setError('Enter a valid email address'); return }
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      if (err) throw err
      setSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset email')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0F1E', padding: 20 }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F9FAFB', marginBottom: 8, textAlign: 'center' }}>Reset Password</h1>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: '#7C3AED/20', border: '1px solid #7C3AED/30', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>&#9993;</div>
            <p style={{ fontSize: 14, color: '#9CA3AF' }}>Check your email for a password reset link. It may take a few minutes to arrive.</p>
            <button onClick={() => setSent(false)} style={{ marginTop: 16, background: 'none', border: 'none', color: '#7C3AED', cursor: 'pointer', fontSize: 13 }}>Send again</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Enter your email and we&apos;ll send you a password reset link.</p>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#F9FAFB', fontSize: 14, outline: 'none' }}
            />
            {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding: '10px 0', borderRadius: 10, border: 'none', background: '#7C3AED', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
