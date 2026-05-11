'use client';

import { Clapperboard, Sparkles, Palette, Layout, Brain, VenetianMask } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: Clapperboard, name: 'Cinematic Generator', desc: 'Full cinematic video generation with Hollywood quality', href: '/studio/cinema/generate' },
  { icon: Sparkles, name: 'VFX Presets Library', desc: '200+ one-click visual effects for any video', href: '/studio/cinema/vfx', badge: 'NEW' },
  { icon: Palette, name: 'Color Grading', desc: 'Professional color grading presets with custom LUTs', href: '/studio/cinema/color-grading' },
  { icon: Layout, name: 'Storyboard Builder', desc: 'Plan and visualize scenes before generating', href: '/studio/cinema/storyboard' },
  { icon: Brain, name: 'Scene Composition', desc: 'Director-level control over every scene element', href: '/studio/cinema/scene' },
  { icon: VenetianMask, name: 'Genre Presets', desc: 'One-click style presets for every film genre', href: '/studio/cinema/genres' },
];

export default function CinemaStudioPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <StudioHero icon={Clapperboard} title="CINEMA STUDIO" subtitle="6 professional filmmaking tools — VFX, color grading, storyboarding, and genre presets" backgroundImage="https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=1200" />
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
