'use client'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px', color: '#e2f0' }}>
      <Link href="/studio" style={{ color: '#7C3AED', fontSize: 13, marginBottom: 24, display: 'inline-block' }}>&larr; Back to Studio</Link>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '16px 0 8px' }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 32 }}>Last updated: May 16, 2026</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>1. Information We Collect</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We collect information you provide directly: name, email, profile information, payment data (processed by Stripe), and content you create. We also collect usage data: page views, feature usage, generation history, and error reports.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>2. How We Use Your Information</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We use your information to: provide and maintain the Platform, process payments, send service notifications, improve our AI models, detect abuse, and comply with legal obligations. We do not sell your personal data.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>3. Cookies and Tracking</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We use essential cookies for authentication and session management. We use analytics cookies to understand usage patterns. You can control cookie preferences in your browser settings.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>4. Data Sharing</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We share data with: Supabase (database hosting), Stripe (payment processing), Vercel (hosting), and AI providers (for content generation). All providers are contractually bound to protect your data.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>5. Data Retention</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We retain your data for as long as your account is active. Account deletion triggers complete data removal within 30 days. Generation data may be retained anonymously for model improvement.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>6. Your Rights</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>You have the right to: access your data, correct inaccurate data, delete your data, export your data, object to processing, and withdraw consent. Exercise these rights via account settings or by contacting privacy@creatify-ai.com.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>7. Security</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We implement encryption at rest and in transit, regular security audits, access controls, and incident response procedures. However, no system is 100% secure. We will notify you of any data breaches within 72 hours.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>8. Third-Party Services</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>The Platform integrates with third-party AI providers. Content you generate may be processed by these providers according to their own privacy policies. We recommend reviewing their policies before use.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>9. International Transfers</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>Your data may be transferred to and processed in the United States and other countries where our service providers operate. We ensure appropriate safeguards are in place for international data transfers.</p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>10. Contact</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>Data Protection Officer: dpo@creatify-ai.com. Privacy inquiries: privacy@creatify-ai.com. Mailing address: 123 Innovation Drive, Wilmington, DE 19801, USA.</p>
      </section>
    </div>
  )
}
