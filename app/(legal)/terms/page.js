'use client'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px', color: '#e2e8f0' }}>
      <Link href="/studio" style={{ color: '#7C3AED', fontSize: 13, marginBottom: 24, display: 'inline-block' }}>&larr; Back to Studio</Link>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '16px 0 8px' }}>Terms of Service</h1>
      <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 32 }}>Last updated: May 16, 2026</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>1. Acceptance of Terms</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>By accessing or using Creatify AI (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>2. Service Description</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>Creatify AI provides AI-powered content creation tools including image, video, audio, and text generation. Services are provided &quot;as is&quot; and may be modified or discontinued at any time.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>3. User Accounts</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years old to use the Platform. Accounts found violating these terms may be suspended or terminated.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>4. Acceptable Use</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>You agree not to use the Platform for: generating illegal content, harassing others, spamming, violating intellectual property rights, circumventing security measures, or interfering with Platform operations.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>5. Content Ownership</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>You retain ownership of content you create. By using the Platform, you grant us a license to process your content solely for providing the service. We do not claim ownership of your generated content.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>6. Limitation of Liability</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>Creatify AI is not liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability is limited to the amount you paid us in the preceding 12 months.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>7. Termination</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We reserve the right to suspend or terminate accounts for violations of these terms. You may delete your account at any time via your account settings. Termination does not relieve you of obligations incurred before termination.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>8. Changes to Terms</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>We may update these terms at any time. Continued use after changes constitutes acceptance. We will notify you of material changes via email or platform notice.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>9. Governing Law</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>These terms are governed by the laws of the State of Delaware, United States. Any disputes shall be resolved in the courts of Delaware.</p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>10. Contact</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#d1d5db' }}>For questions about these terms, contact legal@creatify-ai.com or visit our GitHub repository.</p>
      </section>
    </div>
  )
}
