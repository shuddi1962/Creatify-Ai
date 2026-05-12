'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import Link from 'next/link';

const ALL_APPS = [
  { id: 1, name: 'Face Swap', desc: 'Swap faces in any image or video', credits: 5, url: 'https://picsum.photos/seed/fs/300/200' },
  { id: 2, name: 'AI Headshot', desc: 'Studio-quality professional headshots', credits: 10, url: 'https://picsum.photos/seed/hs/300/200' },
  { id: 3, name: 'Match Cut', desc: 'Seamless transition between clips', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/mc/300/200' },
  { id: 4, name: 'Neon Glow', desc: 'Add vibrant neon lighting effects', credits: 3, url: 'https://picsum.photos/seed/ng/300/200' },
  { id: 5, name: 'Style Transfer', desc: 'Apply artistic styles to photos', badge: 'TOP', credits: 5, url: 'https://picsum.photos/seed/st/300/200' },
  { id: 6, name: 'Sticker Generator', desc: 'Create custom stickers from photos', badge: 'NEW', credits: 2, url: 'https://picsum.photos/seed/sg/300/200' },
  { id: 9, name: 'Meme Generator', desc: 'Trending meme templates with text', badge: 'TOP', credits: 2, url: 'https://picsum.photos/seed/mg/300/200' },
  { id: 10, name: 'Skin Enhancer', desc: 'AI-powered skin retouching', credits: 4, url: 'https://picsum.photos/seed/se/300/200' },
  { id: 12, name: 'Effects Pack', desc: '100+ VFX effects in one app', badge: 'NEW', credits: 10, url: 'https://picsum.photos/seed/ep/300/200' },
];

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('creatify_fav_apps');
    if (stored) {
      try { setFavoriteIds(JSON.parse(stored)); } catch {}
    }
  }, []);

  const favorites = ALL_APPS.filter(a => favoriteIds.includes(a.id));

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="FILTERS">
          <div style={{ padding: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
            {favorites.length} favorites
          </div>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, padding: 24, width: '100%', maxHeight: '100%', overflowY: 'auto' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 24,
            }}>
              FAVORITE APPS
            </h1>
            {favorites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{
                  width: 80, height: 80, background: 'var(--bg-card)', borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Heart size={32} style={{ color: 'var(--text-muted)' }} />
                </div>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>No favorites yet</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Heart any app to save it here</p>
                <Link href="/studio/apps/all"
                  style={{
                    display: 'inline-block', padding: '10px 24px',
                    background: '#CCFF00', color: '#000', fontWeight: 700,
                    fontSize: 13, borderRadius: 12, textDecoration: 'none',
                  }}
                >
                  Browse Apps
                </Link>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16,
              }}>
                {favorites.map(app => (
                  <div key={app.id} style={{
                    background: 'var(--bg-card)', borderRadius: 12,
                    border: '1px solid var(--border-subtle)', overflow: 'hidden',
                  }}>
                    <img src={app.url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                    <div style={{ padding: 12 }}>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{app.name}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{app.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {favorites.length} saved apps
          </span>
        </DirectorBar>
      }
    />
  );
}
