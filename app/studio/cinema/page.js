'use client';

import { Clapperboard, Sparkles, Palette, Layout, Brain, VenetianMask, Shirt } from 'lucide-react';
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
    <div className="min-h-screen pb-16" style={{ background: '#000000' }}>
      <StudioHero icon={Clapperboard} title="CINEMA STUDIO" subtitle="6 professional filmmaking tools — VFX, color grading, storyboarding, and genre presets" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12, paddingBottom: 40,
        }}>
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: 16, position: 'relative',
                transition: 'border-color 200ms, transform 200ms', cursor: 'pointer',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {f.badge && (
                  <span style={{ position: 'absolute', top: 8, right: 8, background: f.badge === 'TOP' ? '#CCFF00' : '#7C3AED', color: f.badge === 'TOP' ? '#000' : '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>{f.badge}</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, background: '#1a1a1a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={18} style={{ color: '#CCFF00' }} />
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>{f.name}</h3>
                </div>
                <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
