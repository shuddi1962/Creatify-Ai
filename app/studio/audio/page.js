'use client';

import { Mic, Copy, Music, Volume2, Subtitles, Ear, Disc } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: Mic, name: 'Text to Voiceover', desc: 'Generate natural voiceovers from text in 100+ voices', href: '/studio/audio/voiceover' },
  { icon: Copy, name: 'Voice Cloning', desc: 'Clone any voice from a 10-second sample', href: '/studio/audio/voice-clone', badge: 'NEW' },
  { icon: Music, name: 'Text to Music', desc: 'Generate full music tracks by genre, mood, and BPM', href: '/studio/audio/music' },
  { icon: Volume2, name: 'Sound Effects', desc: 'Create any sound effect from a text description', href: '/studio/audio/sfx' },
  { icon: Subtitles, name: 'Audio to Subtitles', desc: 'Auto-transcribe audio to accurate subtitle text', href: '/studio/audio/subtitles' },
  { icon: Ear, name: 'ASMR Generator', desc: 'Generate soothing high-quality ASMR audio', href: '/studio/audio/asmr', badge: 'NEW' },
  { icon: Disc, name: 'Background Music', desc: 'Auto-score background music matched to your video', href: '/studio/audio/background-music' },
];

export default function AudioStudioPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <StudioHero icon={Mic} title="AUDIO STUDIO" subtitle="7 audio tools — voiceovers, music generation, cloning, and sound effects" backgroundImage="https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=1200" />
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
