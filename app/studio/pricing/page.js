'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ChevronDown } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AI generation',
    color: '#555',
    features: [
      { label: 'AI Models Available', value: '10+ models' },
      { label: 'Generations per day', value: '20' },
      { label: 'Image Resolution', value: '720p' },
      { label: 'Video Duration', value: '5 seconds' },
      { label: 'Bulk Generate', value: false },
      { label: 'Content Ideas', value: false },
      { label: 'Voice Cloning', value: false },
      { label: 'API Access', value: false },
      { label: 'Priority Support', value: false },
      { label: 'Custom Brand Kit', value: false },
    ],
    cta: 'Get Started Free',
    href: '/studio/home',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For creators who need more power',
    color: '#00C896',
    features: [
      { label: 'AI Models Available', value: '50+ models' },
      { label: 'Generations per day', value: '500' },
      { label: 'Image Resolution', value: '4K' },
      { label: 'Video Duration', value: '30 seconds' },
      { label: 'Bulk Generate', value: '500 rows' },
      { label: 'Content Ideas', value: 'Unlimited' },
      { label: 'Voice Cloning', value: '5 voices' },
      { label: 'API Access', value: true },
      { label: 'Priority Support', value: true },
      { label: 'Custom Brand Kit', value: true },
    ],
    cta: 'Start Pro Trial',
    href: '/studio/home',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For teams and businesses at scale',
    color: '#CCFF00',
    features: [
      { label: 'AI Models Available', value: '200+ models' },
      { label: 'Generations per day', value: 'Unlimited' },
      { label: 'Image Resolution', value: '4K+' },
      { label: 'Video Duration', value: '60 seconds' },
      { label: 'Bulk Generate', value: 'Unlimited' },
      { label: 'Content Ideas', value: 'Unlimited' },
      { label: 'Voice Cloning', value: 'Unlimited' },
      { label: 'API Access', value: 'Full API' },
      { label: 'Priority Support', value: '24/7 Dedicated' },
      { label: 'Custom Brand Kit', value: 'Unlimited' },
    ],
    cta: 'Contact Sales',
    href: '/studio/home',
    popular: false,
  },
];

const COMPARISON = [
  { feature: 'AI Models', free: '10+', pro: '50+', enterprise: '200+' },
  { feature: 'Daily Generations', free: '20', pro: '500', enterprise: 'Unlimited' },
  { feature: 'Max Image Resolution', free: '720p', pro: '4K', enterprise: '4K+' },
  { feature: 'Max Video Duration', free: '5s', pro: '30s', enterprise: '60s' },
  { feature: 'Bulk Generate', free: <X size={16} style={{ color: '#ff4d4d' }} />, pro: '500 rows', enterprise: <Check size={16} style={{ color: '#00C896' }} /> },
  { feature: 'Content Ideas', free: <X size={16} style={{ color: '#ff4d4d' }} />, pro: 'Unlimited', enterprise: <Check size={16} style={{ color: '#00C896' }} /> },
  { feature: 'Voice Cloning', free: <X size={16} style={{ color: '#ff4d4d' }} />, pro: '5 voices', enterprise: 'Unlimited' },
  { feature: 'API Access', free: <X size={16} style={{ color: '#ff4d4d' }} />, pro: <Check size={16} style={{ color: '#00C896' }} />, enterprise: <Check size={16} style={{ color: '#00C896' }} /> },
  { feature: 'Priority Support', free: <X size={16} style={{ color: '#ff4d4d' }} />, pro: <Check size={16} style={{ color: '#00C896' }} />, enterprise: '24/7 Dedicated' },
  { feature: 'Custom Brand Kit', free: <X size={16} style={{ color: '#ff4d4d' }} />, pro: <Check size={16} style={{ color: '#00C896' }} />, enterprise: <Check size={16} style={{ color: '#00C896' }} /> },
  { feature: 'Team Members', free: '1', pro: 'Up to 5', enterprise: 'Unlimited' },
  { feature: 'Storage', free: '1 GB', pro: '50 GB', enterprise: '1 TB' },
];

const FAQS = [
  { q: 'Can I upgrade or downgrade anytime?', a: 'Yes. You can change your plan at any time. Upgrades take effect immediately, downgrades apply at the next billing cycle.' },
  { q: 'Is there a free trial for Pro?', a: 'Yes. We offer a 7-day free trial on the Pro plan with full access to all features. No credit card required.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and cryptocurrency payments through our partners.' },
  { q: 'Can I use the API on the Free plan?', a: 'API access is available on Pro and Enterprise plans only. The Free plan includes web-based generation.' },
  { q: 'How many models can I access?', a: 'Free tier includes 10+ models. Pro unlocks 50+ models. Enterprise gives you access to all 200+ models.' },
  { q: 'Is there a team plan?', a: 'Enterprise plan supports unlimited team members with shared billing, workspaces, and collaboration features.' },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: '#000', minHeight: '100%', paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#00C896', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Pricing
        </span>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: 15, color: '#888', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
          Start for free, upgrade when you need more. All plans include access to 200+ AI models.
        </p>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        {PLANS.map(plan => (
          <div key={plan.name} style={{
            position: 'relative',
            background: plan.popular ? 'rgba(0,200,150,0.06)' : '#0D0D0D',
            border: plan.popular ? '1px solid rgba(0,200,150,0.3)' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            padding: '32px 24px',
            transition: 'all 200ms',
          }}>
            {plan.popular && (
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: '#00C896', color: '#000', fontSize: 10, fontWeight: 700,
                padding: '3px 14px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                Most Popular
              </div>
            )}
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{plan.name}</h3>
            <p style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>{plan.description}</p>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{plan.price}</span>
              <span style={{ fontSize: 13, color: '#666', marginLeft: 4 }}>{plan.period}</span>
            </div>
            <Link href={plan.href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', padding: '10px 0', borderRadius: 8,
              background: plan.popular ? '#00C896' : 'rgba(255,255,255,0.06)',
              color: plan.popular ? '#000' : '#fff',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              marginBottom: 24, transition: 'opacity 150ms',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {plan.cta}
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.features.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#999' }}>
                  {f.value === false ? (
                    <X size={14} style={{ color: '#ff4d4d', flexShrink: 0 }} />
                  ) : f.value === true ? (
                    <Check size={14} style={{ color: '#00C896', flexShrink: 0 }} />
                  ) : (
                    <Check size={14} style={{ color: '#00C896', flexShrink: 0 }} />
                  )}
                  <span>{f.label}</span>
                  <span style={{ marginLeft: 'auto', color: '#ccc', fontWeight: 500 }}>{f.value === true ? 'Yes' : f.value === false ? '—' : f.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div style={{ maxWidth: 800, margin: '60px auto 0', padding: '0 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 8 }}>Compare plans in detail</h2>
        <p style={{ fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 32 }}>Everything you need to know about each plan</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#888', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', color: '#888', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', color: '#00C896', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pro</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', color: '#CCFF00', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px', color: '#ccc' }}>{row.feature}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#888' }}>{row.free}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#ccc' }}>{row.pro}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#ccc' }}>{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 640, margin: '60px auto 0', padding: '0 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 32 }}>Frequently asked questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{
              background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden',
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ccc', fontSize: 13, fontWeight: 500, textAlign: 'left',
                }}
              >
                <span>{faq.q}</span>
                <ChevronDown size={16} style={{ color: '#666', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }} />
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 16px', fontSize: 12, color: '#888', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '60px 24px 0' }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Still have questions?</p>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Contact our sales team for a custom plan</p>
        <Link href="/studio/home" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '10px 24px', borderRadius: 8,
          background: '#00C896', color: '#000', fontSize: 13, fontWeight: 700, textDecoration: 'none',
        }}>
          Contact Sales
        </Link>
      </div>
    </div>
  );
}
