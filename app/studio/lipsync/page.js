'use client';

import { Image, Video, Layers, User, Languages } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: Image, name: 'Portrait Lip Sync', desc: 'Animate any portrait photo with any audio file', href: '/studio/lipsync/portrait' },
  { icon: Video, name: 'Video Lip Sync', desc: 'Sync lips perfectly on existing video with new audio', href: '/studio/lipsync/video' },
  { icon: Layers, name: 'Bulk Lip Sync', desc: 'One character × 100 audio files = 100 talking videos', href: '/studio/lipsync/bulk', badge: 'NEW' },
  { icon: User, name: 'Talking Avatar', desc: 'Build and save persistent reusable talking avatars', href: '/studio/lipsync/avatar' },
  { icon: Languages, name: 'Multi-language Dubbing', desc: 'Dub any video into any language with AI voice and lip sync', href: '/studio/lipsync/dubbing', badge: 'NEW' },
];

export default function LipSyncPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: '#000000' }}>
      <StudioHero icon={Image} title="LIP SYNC STUDIO" subtitle="5 tools for realistic lip syncing, avatar creation, and multi-language dubbing" backgroundImage="https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=1200" />
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
