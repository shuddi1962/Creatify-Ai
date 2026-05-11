'use client';

import { UserPlus, Users, Shuffle, Group, Globe, Plus, Lightbulb, Layout } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: UserPlus, name: 'Create Character', desc: 'Build a reusable Soul ID character with consistent appearance', href: '/studio/characters/create' },
  { icon: Users, name: 'My Characters', desc: 'Browse and manage all your saved character profiles', href: '/studio/characters/mine' },
  { icon: Shuffle, name: 'Character Swap', desc: 'Replace or swap characters inside any existing video', href: '/studio/characters/swap' },
  { icon: Group, name: 'Multi-Character Scene', desc: 'Place multiple characters together in one scene', href: '/studio/characters/multi', badge: 'NEW' },
  { icon: Globe, name: 'My Worlds', desc: 'Browse and manage all saved world and scene presets', href: '/studio/characters/worlds' },
  { icon: Plus, name: 'Create a World', desc: 'Save a location or environment as a reusable preset', href: '/studio/characters/worlds/create' },
  { icon: Lightbulb, name: 'Lighting Presets', desc: 'Apply professional lighting setups to any scene', href: '/studio/characters/lighting' },
  { icon: Layout, name: 'Scene Templates', desc: 'Ready-made world and location templates for fast setup', href: '/studio/characters/templates' },
];

export default function CharactersPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <StudioHero icon={UserPlus} title="CHARACTERS & WORLDS" subtitle="8 tools for character creation, world building, lighting, and scene templates" backgroundImage="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1200" />
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
