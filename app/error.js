'use client'
import { useEffect } from 'react'
import { logger } from '@/lib/log'

export default function Error({ error, reset }) {
  useEffect(() => {
    logger.error('Page error', { message: error?.message, stack: error?.stack })
  }, [error])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0F1E', padding: 20 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>&#9888;</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#F9FAFB', marginBottom: 8 }}>Something went wrong</h2>
        <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20 }}>{error?.message || 'An unexpected error occurred'}</p>
        <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#7C3AED', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Try again
        </button>
      </div>
    </div>
  )
}
