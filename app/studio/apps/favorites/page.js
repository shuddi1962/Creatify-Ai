'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import AppCard from '@/components/studio/AppCard';
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

  const toggleFav = (id) => {
    setFavoriteIds(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('creatify_fav_apps', JSON.stringify(next));
      if (prev.includes(id)) toast.success('Removed from favorites');
      return next;
    });
  };

  const favorites = ALL_APPS.filter(a => favoriteIds.includes(a.id));

  return (
    <div className="min-h-screen pb-12" style={{ background: '#000000' }}>
      <Toaster position="top-center" />
      <StudioHero icon={Heart} title="FAVORITE APPS" subtitle="Your pinned and most-used apps" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: 80, height: 80, background: '#1a1a1a', borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Heart size={32} style={{ color: '#444' }} />
            </div>
            <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: 8 }}>No favorites yet</h3>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>Heart any app to save it here</p>
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
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16, paddingBottom: 40,
            }}>
              {favorites.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  isFavorite={true}
                  onToggleFavorite={toggleFav}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
