'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'

function VerifyContent() {
  const [status, setStatus] = useState('verifying')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function verify() {
      const code = searchParams.get('code')
      if (!code) { setStatus('no_code'); return }
      try {
        const { error } = await supabase.auth.verifyOtp({
          type: 'email',
          token: code,
        })
        if (error) throw error
        setStatus('verified')
        setTimeout(() => router.push('/studio'), 2000)
      } catch (err) {
        setStatus('error')
      }
    }
    verify()
  }, [searchParams, router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0F1E', padding: 20 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        {status === 'verifying' && <p style={{ color: '#9CA3AF', fontSize: 14 }}>Verifying your email...</p>}
        {status === 'verified' && <p style={{ color: '#22c55e', fontSize: 14, fontWeight: 600 }}>Email verified! Redirecting...</p>}
        {status === 'no_code' && <p style={{ color: '#ef4444', fontSize: 14 }}>Invalid verification link.</p>}
        {status === 'error' && <p style={{ color: '#ef4444', fontSize: 14 }}>Verification failed. Try signing up again.</p>}
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0F1E' }}><p style={{ color: '#9CA3AF' }}>Loading...</p></div>}>
      <VerifyContent />
    </Suspense>
  )
}
