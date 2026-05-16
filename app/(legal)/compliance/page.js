'use client'
import Link from 'next/link'

export default function CompliancePage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px', color: '#e2f0' }}>
      <Link href="/studio" style={{ color: '#7C3AED', fontSize: 13, marginBottom: 24, display: 'inline-block' }}>&larr; Back to Studio</Link>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '16px 0 8px' }}>Data Compliance</h1>
      <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 32 }}>Last updated: May 16, 2026</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>GDPR Compliance</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We are committed to full compliance with the General Data Protection Regulation (GDPR). EU users have the right to access, rectify, erase, and port their data. Data processing is based on legitimate interest and consent. Our Data Protection Officer can be reached at dpo@creatify-ai.com.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>CCPA Compliance</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>California residents have the right to know what personal information is collected, request deletion, opt out of sales (we do not sell data), and non-discrimination for exercising these rights. Submit requests via privacy@creatify-ai.com.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>SOC 2 Type II</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We maintain SOC 2 Type II compliance for security, availability, and confidentiality. Our controls include access management, encryption, monitoring, incident response, and vendor management. Audit reports are available under NDA.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Data Processing Agreement</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>Enterprise customers can request a signed DPA. Our DPA covers: processing instructions, confidentiality, security measures, sub-processors, data subject rights, breach notification, and deletion upon termination. Request at legal@creatify-ai.com.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Sub-processors</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We use the following sub-processors: Supabase Inc. (database), Stripe Inc. (payments), Vercel Inc. (hosting), Google Cloud (AI services), Anthropic (AI services), OpenAI (AI services). All have DPA agreements in place.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Data Retention Schedule</h2>
        <ul style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db', paddingLeft: 20 }}>
          <li>Account data: retained until account deletion + 30 days</li>
          <li>Generation history: 90 days for free accounts, 365 days for paid</li>
          <li>Payment records: 7 years (legal requirement)</li>
          <li>Logs & analytics: 30 days</li>
          <li>Deleted content: purged within 30 days of deletion request</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Security Certifications</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>Encryption at rest (AES-256) and in transit (TLS 1.3). Regular penetration testing. Bug bounty program. Incident response plan with 72-hour breach notification. Access logged and audited monthly.</p>
      </section>
    </div>
  )
}
