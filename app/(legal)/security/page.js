'use client'
import Link from 'next/link'

export default function SecurityPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px', color: '#e2f0' }}>
      <Link href="/studio" style={{ color: '#7C3AED', fontSize: 13, marginBottom: 24, display: 'inline-block' }}>&larr; Back to Studio</Link>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '16px 0 8px' }}>Authorization & Security</h1>
      <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 32 }}>How we protect your account and data</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Authentication</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We use Supabase Auth with email/password and OAuth providers (Google, GitHub). Passwords are hashed with bcrypt. Session tokens are JWT-based with configurable expiry. OAuth tokens are never stored on our servers.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Authorization Model</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>Row-Level Security (RLS) enforces data access at the database level. Users can only access their own data. Admin roles are managed through the admin_roles table. API keys are scoped to specific permissions.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>API Security</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>API routes are protected with rate limiting (60 requests/minute by default). Muapi proxy adds x-api-key headers server-side. All API keys are stored encrypted in the database. CORS is restricted to allowed origins.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Session Management</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>
          - Session timeout: 24 hours (configurable)<br />
          - Refresh tokens rotate on use<br />
          - Concurrent sessions: unlimited (configurable)<br />
          - Session revocation on password change<br />
          - Force logout all sessions available in settings
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Rate Limiting</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>API endpoints are rate-limited per IP address. Limits vary by endpoint: auth routes (5/min), generation (30/min), search (60/min). Rate limit headers are returned with every response. Exceeded limits return 429 status.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Data Encryption</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>All data in transit is encrypted with TLS 1.3. Data at rest is encrypted with AES-256. API keys stored in the database are encrypted. Backups are encrypted. We use HSM-backed keys for critical operations.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Incident Response</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>Our incident response plan includes: detection & analysis, containment, eradication, recovery, and post-incident review. Security incidents are reported to affected users within 72 hours. We maintain a public status page at status.creatify-ai.com.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Reporting Vulnerabilities</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We operate a responsible disclosure program. Report security vulnerabilities to security@creatify-ai.com. We commit to acknowledging reports within 24 hours and addressing critical issues within 7 days.</p>
      </section>
    </div>
  )
}
