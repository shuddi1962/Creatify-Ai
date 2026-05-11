'use client';

import { Video, Image, Sparkles, Shuffle, Film, Clock, Palette, User, Maximize, Volume2, Layers, Camera } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: Video, name: 'Text to Video', desc: 'Generate high-quality video clips from any text prompt', href: '/studio/video/text-to-video', badge: 'TOP' },
  { icon: Image, name: 'Image to Video', desc: 'Animate any still image into smooth cinematic video', href: '/studio/video/image-to-video' },
  { icon: Sparkles, name: 'Smart Shot', desc: 'AI plans the storyboard then generates each scene', href: '/studio/video/smart-shot', badge: 'NEW' },
  { icon: Shuffle, name: 'Motion Sync', desc: 'Transfer motion patterns from reference video', href: '/studio/video/motion-sync' },
  { icon: Film, name: 'Edit Video', desc: 'Inpaint and regenerate specific video regions', href: '/studio/video/edit' },
  { icon: Clock, name: 'Extend Video', desc: 'Seamlessly add more seconds to any video', href: '/studio/video/extend' },
  { icon: Palette, name: 'Restyle Video', desc: 'Apply completely new visual styles to any video', href: '/studio/video/restyle' },
  { icon: User, name: 'Replace Character', desc: 'Swap out characters inside any video clip', href: '/studio/video/replace-character', badge: 'NEW' },
  { icon: Maximize, name: 'Video Upscale', desc: 'Enhance any video to HD or 4K resolution', href: '/studio/video/upscale' },
  { icon: Volume2, name: 'Add Sound Effects', desc: 'Layer AI-generated sound effects onto videos', href: '/studio/video/sound-effects' },
  { icon: Layers, name: 'Mixed Media', desc: 'Blend real footage with AI-generated visuals', href: '/studio/video/mixed-media' },
  { icon: Camera, name: 'Camera Motion', desc: 'Apply professional camera movements to any video', href: '/studio/video/camera-motion' },
];

export default function VideoStudioPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <StudioHero icon={Video} title="VIDEO STUDIO" subtitle="12 professional video tools — from text to video, editing, motion sync, and camera control" backgroundImage="https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=1200" />
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
