'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PLAN_HREF = {
  'BASIC': '/studio/signup?plan=free',
  'PLUS': '/studio/signup?plan=plus',
  'ULTRA': '/studio/signup?plan=ultra',
  'BUSINESS': '/studio/signup?plan=business',
};

const PLANS = [
  {
    name: 'BASIC',
    badge: { text: 'FREE', bg: '#10b981', color: '#fff' },
    color: null, highlight: false,
    tagline: 'Get started with 20 free credits',
    monthly: 0, annual: 0,
    credits: '20 credits on signup',
    saveBadge: null,
    cta: 'Sign Up Free',
    ctaStyle: 'outline',
    features: [
      '20 free credits on signup',
      'Access to 10+ AI models',
      '480p image resolution',
      '5-second video duration',
      'Standard queue',
      '1 GB storage',
    ],
    unlimitedModels: ['SDXL', 'GPT Image', 'Flux Lite'],
    payPerUseNote: 'PAY-PER-USE MODELS:',
    payPerUse: ['Seedance 2.0 Cinema', 'Kling 3.0 Cinema', 'Nano Banana Pro'],
  },
  {
    name: 'PLUS',
    badge: { text: 'GOOD VALUE', bg: '#a3e635', color: '#000' },
    color: null, highlight: false,
    tagline: 'For creators leveling up',
    monthly: 55, annual: 39,
    credits: '1,500 credits/month',
    saveBadge: 'Save $192 compared to monthly',
    cta: 'Get Plan', ctaStyle: 'outline',
    features: [
      '1,500 credits/month',
      'HD image generation (up to 4K)',
      '30-second video duration',
      'Access to 50+ AI models',
      'Bulk generate (500 rows)',
      'Voice cloning (5 voices)',
      '50 GB storage',
    ],
    unlimitedModels: [
      'Nano Banana 2',
      { name: 'Nano Banana Pro', badge: 'NEW' },
      { name: 'Kling 3.0', badge: 'NEW' },
      'Kling Lite',
    ],
    payPerUseNote: '360 GPU UNLIMITED & PAY-PER-USE:',
    payPerUse: ['Seedance 2.0 Cinema', 'Kling 3.0 Cinema', 'LTX', 'Turbo Nano', 'Nano Banana 2', 'GPT Image'],
  },
  {
    name: 'ULTRA',
    badge: { text: '# MOST POPULAR', bg: '#22c55e', color: '#fff' },
    color: '#ec4899', highlight: true,
    tagline: 'For power creators',
    monthly: 148, annual: 99,
    credits: '5,000 credits/month',
    saveBadge: 'Save $588 compared to monthly',
    cta: 'Get Plan', ctaStyle: 'pink',
    features: [
      '5,000 credits/month',
      '4K image generation',
      '60-second video duration',
      'Access to all 200+ models',
      'Parallel generations (4 videos, 8 images)',
      'Priority queue',
      'API access',
      '200 GB storage',
    ],
    unlimitedModels: [
      { name: 'Nano Banana Pro', badge: 'NEW' },
      { name: 'Kling 3.0', badge: 'NEW' },
      'Nano Banana 2', 'Kling Lite',
    ],
    payPerUseNote: '360 GPU UNLIMITED & PAY-PER-USE:',
    payPerUse: ['Seedance 2.0 Cinema', 'Kling 3.0 Cinema', 'LTX', 'Turbo Nano', 'Nano Banana 2', 'GPT Image'],
  },
  {
    name: 'BUSINESS',
    badge: { text: '# BEST VALUE', bg: '#6366f1', color: '#fff' },
    color: '#6366f1', highlight: false,
    tagline: 'For agencies and studios',
    monthly: 225, annual: 162,
    credits: '2,000 credits to start',
    saveBadge: 'Save $756 compared to monthly',
    cta: 'Get Plan', ctaStyle: 'indigo',
    teamNote: '2 seats',
    features: [
      '2,000 credits to start + monthly top-ups',
      'Unlimited generations',
      'Parallel generations (8 videos, 16 images)',
      'All 200+ AI models',
      'Team workspace (2 seats)',
      'API access with full endpoints',
      'Priority 24/7 support',
      '2 TB storage',
    ],
    teamFeatures: [
      'Shareable elements and fixed CTL',
      'Drag analytics and branding',
      'Shared projects with integrated data',
      'More coming soon',
    ],
    unlimitedModels: [
      { name: 'Nano Banana Pro', badge: 'NEW' },
      { name: 'Kling 3.0', badge: 'NEW' },
      'Seedance Lite', 'Nano Banana 2', 'Kling Lite', 'Kling 3.0',
      'Kling Full HD', 'Kling Full HD Pro', 'Wan 2.2', 'Wan 2.2 Pro', 'Grok T2V',
    ],
    payPerUseNote: '360 GPU UNLIMITED & PAY-PER-USE:',
    payPerUse: ['Seedance 2.0 Cinema', 'Kling 3.0 Cinema', 'LTX', 'Turbo Nano', 'Nano Banana 2', 'GPT Image'],
  },
];

const COMPARE_DATA = {
  categories: [
    {
      name: 'Generations',
      rows: [
        { feature: 'Credits per month', free: '20', basic: '90', plus: '1,500', ultra: '5,000', business: '2,000+' },
        { feature: 'Image resolution', free: '480p', basic: '720p', plus: '4K', ultra: '4K', business: '4K' },
        { feature: 'Video duration', free: '5s', basic: '10s', plus: '30s', ultra: '60s', business: 'Unlimited' },
        { feature: 'Parallel generations', free: '1', basic: '1', plus: '2', ultra: '4', business: '8' },
      ],
    },
    {
      name: 'Models & Access',
      rows: [
        { feature: 'AI Models Available', free: '10+', basic: '25+', plus: '50+', ultra: '150+', business: '200+' },
        { feature: 'Bulk Generate', free: '\u2014', basic: '\u2014', plus: '500 rows', ultra: '2,000 rows', business: '\u221E' },
        { feature: 'Content Ideas', free: '10/day', basic: '50/day', plus: '\u221E', ultra: '\u221E', business: '\u221E' },
        { feature: 'Voice Cloning', free: '\u2014', basic: '1 voice', plus: '5 voices', ultra: '10 voices', business: '\u221E' },
        { feature: 'API Access', free: '\u2014', basic: '\u2014', plus: '\u2713', ultra: '\u2713', business: '\u2713' },
        { feature: 'Custom Brand Kit', free: '\u2014', basic: '1', plus: '5', ultra: '20', business: '\u221E' },
        { feature: 'Remove Watermark', free: '\u2014', basic: '\u2713', plus: '\u2713', ultra: '\u2713', business: '\u2713' },
      ],
    },
    {
      name: 'Storage & Support',
      rows: [
        { feature: 'Storage', free: '1 GB', basic: '10 GB', plus: '50 GB', ultra: '200 GB', business: '2 TB' },
        { feature: 'Queue Priority', free: 'Standard', basic: 'Standard', plus: 'Standard', ultra: 'Priority', business: 'Priority' },
        { feature: 'Support', free: 'Community', basic: 'Email', plus: 'Email', ultra: 'Priority', business: '24/7 Dedicated' },
        { feature: 'Team Seats', free: '1', basic: '1', plus: '1', ultra: '1', business: '5' },
      ],
    },
  ],
};

const FAQS = [
  { q: 'What are credits?', a: 'Credits are used for each generation. Images use 1\u20133 credits, videos use 10\u201325 depending on model and duration.' },
  { q: 'Do unused credits roll over?', a: 'No \u2014 credits reset at the start of each billing period.' },
  { q: 'Can I change my plan?', a: 'Yes. Upgrade or downgrade any time. Changes take effect at the next billing cycle.' },
  { q: 'Is there a free trial?', a: 'Yes \u2014 sign up free and get 20 credits to try any feature with no credit card required.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards via Stripe. Enterprise plans support invoicing.' },
  { q: 'Can I get a refund?', a: 'We offer a 7-day refund on first purchases. Contact support within 7 days of purchase.' },
];

const COL_KEYS = ['free', 'basic', 'plus', 'ultra', 'business'];
const COL_LABELS = ['Free', 'Basic', 'Plus', 'Ultra', 'Business'];

function CtaColors(col) {
  const m = { ultra: '#ec4899', business: '#6366f1' };
  return m[col] || 'var(--bg-input)';
}

function PriceLabel(col, annual) {
  const prices = { free: '0', basic: '5', plus: annual ? '39' : '55', ultra: annual ? '99' : '148', business: annual ? '162' : '225' };
  return prices[col];
}

function PricingCard({ plan, annual, onClick }) {
  const price = annual ? plan.annual : plan.monthly;
  return (
    <div style={{
      background: plan.highlight ? 'linear-gradient(180deg, #1a0020 0%, #0d0015 100%)' : 'var(--bg-card)',
      border: plan.highlight ? '1px solid rgba(236,72,153,0.4)' : plan.color === '#6366f1' ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border-default)',
      borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
    }}>
      {(plan.highlight || plan.color === '#6366f1') && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${plan.highlight ? '#ec4899' : '#6366f1'}, transparent)` }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: plan.highlight ? '#ec4899' : plan.color === '#6366f1' ? '#818cf8' : 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{plan.name}</span>
        {plan.badge && <span style={{ background: plan.badge.bg, color: plan.badge.color, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{plan.badge.text}</span>}
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{plan.tagline}</p>
      <div style={{ marginBottom: 4 }}>
        {plan.monthly !== plan.annual && <span style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: 6 }}>${annual ? plan.monthly : plan.annual}</span>}
        <span style={{ fontSize: 36, fontWeight: 800, color: plan.highlight ? '#ec4899' : plan.color === '#6366f1' ? '#818cf8' : 'var(--text-primary)' }}>${price}</span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 4 }}>{annual ? '/mo billed annually' : '/mo billed monthly'}</span>
      </div>
      {annual && plan.saveBadge && <div style={{ fontSize: 11, color: '#10b981', marginBottom: 16 }}>{plan.saveBadge}</div>}
      <button style={{ width: '100%', padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 16,
        background: plan.ctaStyle === 'pink' ? '#ec4899' : plan.ctaStyle === 'indigo' ? '#6366f1' : 'transparent',
        color: plan.ctaStyle === 'outline' ? 'var(--text-primary)' : '#fff',
        border: plan.ctaStyle === 'outline' ? '1px solid var(--border-default)' : 'none',
        transition: 'opacity 150ms',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        onClick={onClick}
      >{plan.cta}</button>
      <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0 0 14px' }} />
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span style={{ color: '#10b981', fontSize: 14, marginTop: 0, flexShrink: 0 }}>{'\u2713'}</span>
            {f}
          </li>
        ))}
      </ul>
      {plan.teamNote && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          {'\uD83D\uDC65'} {plan.teamNote}
        </div>
      )}
      {plan.teamFeatures && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {plan.teamFeatures.map((f, i) => (
            <li key={i} style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 12, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>{'\u00B7'}</span>
              {f}
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>7 CLIP UNLIMITED</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {plan.unlimitedModels.map((m, i) => {
            const name = typeof m === 'string' ? m : m.name;
            const badge = typeof m === 'object' ? m.badge : null;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
                <span>{name}</span>
                {badge && <span style={{ background: plan.highlight ? '#ec4899' : '#6366f1', color: '#fff', fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3 }}>{badge}</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{plan.payPerUseNote}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {plan.payPerUse.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
              <span>{m}</span>
              <button onClick={onClick} style={{
                background: plan.highlight ? '#ec4899' : plan.color === '#6366f1' ? '#6366f1' : 'var(--bg-input)',
                color: plan.highlight || plan.color === '#6366f1' ? '#fff' : 'var(--text-muted)',
                border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600, cursor: 'pointer',
              }}>Unlock</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const router = useRouter();

  return (
    <div style={{ background: 'var(--bg-page)', color: 'var(--text-primary)', paddingBottom: 60, minHeight: '100%' }}>

      {/* SECTION 1 — Promo Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0030 0%, #2d0050 40%, #1a0030 100%)',
        border: '1px solid rgba(168,85,247,0.3)', borderRadius: 16,
        padding: '20px 28px', margin: '24px 24px 0', position: 'relative',
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%', background: 'radial-gradient(ellipse at right, rgba(168,85,247,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: 100, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: '#c084fc', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            {'\u2726'} AI SPECIAL RELEASE
          </div>
          <div style={{ fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: 4 }}>
            NANO BANANA PRO & NANO BANANA 2 UNLIMITED.
          </div>
          <div style={{ fontSize: 'clamp(14px, 1.5vw, 18px)', fontWeight: 700, color: '#c084fc', marginBottom: 10 }}>
            KLING 3.0 UNLIMITED WITH 30% OFF
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            Get Nano Banana 2 & Pro Unlimited on Ultra plan for 7 days after signup. GPU tokens applied.
          </div>
        </div>
        <div style={{ width: 80, height: 80, borderRadius: 16, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0, zIndex: 1 }}>
          {'\u2726'}
        </div>
      </div>

      {/* SECTION 2 — Header */}
      <div style={{ textAlign: 'center', padding: '40px 24px 24px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 8 }}>
          PICK YOUR PLAN
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
          Scale creativity with higher limits, priority access, and early features
        </p>
      </div>

      {/* SECTION 3 — Billing Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
        <span style={{ fontSize: 14, color: annual ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: annual ? 400 : 600 }}>Monthly</span>
        <button onClick={() => setAnnual(a => !a)} style={{ width: 48, height: 26, borderRadius: 100, background: annual ? '#6366f1' : 'var(--bg-input)', border: '1px solid var(--border-default)', position: 'relative', cursor: 'pointer', transition: 'background 200ms' }}>
          <div style={{ position: 'absolute', top: 3, left: annual ? 24 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)', transition: 'left 200ms ease' }} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, color: annual ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: annual ? 600 : 400 }}>Annual</span>
          <span style={{ background: '#10b981', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100 }}>SAVE 20%</span>
        </div>
      </div>

      {/* SECTION 4 — Pricing Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '0 24px', maxWidth: 1400, margin: '0 auto' }}>
        {PLANS.map(plan => <PricingCard key={plan.name} plan={plan} annual={annual} onClick={() => router.push(PLAN_HREF[plan.name])} />)}
      </div>
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 16, padding: '0 24px' }}>
        Prices exclude VAT and local taxes. All plans are billed in USD. Unlimited usage is subject to our fair use policy. Unused credits expire at end of billing period. Early access features may change before general availability.
      </p>

      {/* SECTION 5 — Enterprise Block */}
      <div style={{ maxWidth: 1400, margin: '32px auto', padding: '0 24px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 20, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '32px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Everything on Business Plan plus...
            </div>
            <h2 style={{ fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.3 }}>
              Enterprise AI video infrastructure for teams that produce at scale
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
              Custom workflows, dedicated support, seamless onboarding, full control at scale, and no trading on your data.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              {[
                { icon: '\uD83D\uDEE1\uFE0F', title: 'Security & Compliance', desc: 'SOC 2 Type II compliance, GDPR, CCPA, and custom data retention policies.' },
                { icon: '\uD83D\uDCCA', title: 'Data & usage rights', desc: 'Full ownership of outputs. We guarantee no training on your generations without explicit consent.' },
                { icon: '\uD83D\uDC51', title: 'SSO & admin control', desc: 'SAML SSO, user provisioning, usage analytics, and team-level permission controls from a single admin portal.' },
              ].map((f, i) => (
                <div key={i}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', borderLeft: '1px solid var(--border-subtle)', padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {['Unlimited members', 'Custom credit limits', 'Dedicated onboarding', 'Access to all models on the platform', 'Volume-based discounts off the best rates', 'Priority queue for faster bulk processing'].map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ color: '#10b981', fontSize: 16 }}>{'\u2713'}</span>
                  {f}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => router.push('/studio/home')} style={{ width: '100%', padding: '12px 0', background: '#ffffff', color: '#000000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'opacity 150ms' }}>Contact Sales</button>
              <button onClick={() => router.push('/studio/home')} style={{ width: '100%', padding: '10px 0', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>Learn More</button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6 — Compare Plans Table */}
      <div style={{ maxWidth: 1400, margin: '40px auto 24px', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 32 }}>
          COMPARE PLANS
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 16, overflow: 'hidden', minWidth: 720 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px 20px', textAlign: 'left', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Monthly</span>
                      <button onClick={() => setAnnual(a => !a)} style={{ width: 40, height: 22, borderRadius: 100, background: annual ? '#6366f1' : 'var(--bg-input)', border: '1px solid var(--border-default)', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                        <div style={{ position: 'absolute', top: 2, left: annual ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 200ms' }} />
                      </button>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Annual</span>
                      <span style={{ background: '#10b981', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 100 }}>20% OFF</span>
                    </div>
                  </th>
                  {COL_KEYS.map(col => (
                    <th key={col} style={{ padding: '16px 12px', textAlign: 'center', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)', minWidth: 120 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: col === 'ultra' ? '#ec4899' : col === 'business' ? '#818cf8' : 'var(--text-primary)', marginBottom: 4 }}>{COL_LABELS[COL_KEYS.indexOf(col)]}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>${PriceLabel(col, annual)}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 10 }}>{col === 'free' ? 'Free forever' : '/mo'}</div>
                      <button onClick={() => router.push(PLAN_HREF[COL_LABELS[COL_KEYS.indexOf(col)]])} style={{ width: '100%', padding: '7px 0', background: CtaColors(col), color: col === 'ultra' || col === 'business' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Get Plan</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_DATA.categories.map(cat => [
                  <tr key={cat.name + '_h'}>
                    <td colSpan={6} style={{ padding: '14px 20px 6px', background: 'var(--bg-elevated)', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', borderTop: '1px solid var(--border-subtle)' }}>{cat.name}</td>
                  </tr>,
                  ...cat.rows.map((row, i) => (
                    <tr key={row.feature}
                      style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-hover)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--bg-hover)'}
                    >
                      <td style={{ padding: '10px 20px', fontSize: 13, color: 'var(--text-secondary)', borderRight: '1px solid var(--border-subtle)', borderTop: '1px solid var(--border-subtle)' }}>{row.feature}</td>
                      {COL_KEYS.map(col => (
                        <td key={col} style={{ padding: '10px 12px', textAlign: 'center', fontSize: 13, color: row[col] === '\u2014' ? 'var(--text-muted)' : 'var(--text-primary)', borderRight: '1px solid var(--border-subtle)', borderTop: '1px solid var(--border-subtle)' }}>
                          {row[col] === '\u2713' ? <span style={{ color: '#10b981', fontSize: 16 }}>{'\u2713'}</span>
                            : row[col] === '\u2014' ? <span style={{ color: 'var(--text-muted)' }}>{'\u2014'}</span>
                            : row[col] === '\u221E' ? <span style={{ color: col === 'ultra' ? '#ec4899' : col === 'business' ? '#818cf8' : 'var(--text-primary)', fontWeight: 700 }}>{'\u221E'}</span>
                            : row[col]}
                        </td>
                      ))}
                    </tr>
                  )),
                ])}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 7 — FAQ */}
      <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 32 }}>
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, textAlign: 'left' }}>
                <span>{faq.q}</span>
                <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }} />
              </button>
              {openFaq === i && <div style={{ padding: '0 20px 16px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
