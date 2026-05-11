'use client';

import { Megaphone, Link2, Book, Crop, Lightbulb, Layers, FileVideo, Play } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: Megaphone, name: 'UGC Ad Generator', desc: 'Create scroll-stopping UGC-style video ads', href: '/studio/marketing/ugc', badge: 'TOP' },
  { icon: Link2, name: 'Product URL to Ad', desc: 'Paste any product URL — AI scrapes and generates ads', href: '/studio/marketing/product-url', badge: 'NEW' },
  { icon: Book, name: 'Brand Kit Manager', desc: 'Upload brand assets once — auto-applied to all outputs', href: '/studio/marketing/brand-kit' },
  { icon: Crop, name: 'Platform Formatter', desc: 'Auto-resize content to perfect dimensions per platform', href: '/studio/marketing/formatter' },
  { icon: Lightbulb, name: 'Hook Generator', desc: 'Generate 20 proven viral opening hooks for any niche', href: '/studio/marketing/hooks' },
  { icon: Layers, name: 'Batch Ad Generator', desc: 'Create 10 different ad variants from one product', href: '/studio/marketing/batch', badge: 'NEW' },
  { icon: FileVideo, name: 'Story Ad Builder', desc: 'Build high-converting short-form story ads', href: '/studio/marketing/stories' },
  { icon: Play, name: 'Product Demo', desc: 'Showcase your product with stunning AI video demos', href: '/studio/marketing/demo' },
];

export default function MarketingStudioPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <StudioHero icon={Megaphone} title="MARKETING STUDIO" subtitle="8 marketing tools — UGC ads, brand kits, hook generation, and product demos" />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 12, paddingBottom: 40,
        }}>
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
              <div className="home-section-card" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 12, padding: 16, position: 'relative',
                transition: 'all 200ms ease', cursor: 'pointer',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {f.badge && (
                  <span className={f.badge === 'TOP' ? 'badge-top' : 'badge-new'} style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>{f.badge}</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, background: 'var(--bg-input)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={18} style={{ color: 'var(--btn-generate-bg)' }} />
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{f.name}</h3>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
