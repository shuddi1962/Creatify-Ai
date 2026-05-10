'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import AppCard from '@/components/studio/AppCard';

const APPS = [
  { id: 'face1', name: 'Face Swap', desc: 'Swap faces in any image or video', badge: 'TOP', credits: 5, url: 'https://picsum.photos/seed/fs/300/200' },
  { id: 'face2', name: 'AI Headshot', desc: 'Studio-quality professional headshots', badge: 'TOP', credits: 10, url: 'https://picsum.photos/seed/hs/300/200' },
  { id: 'face3', name: 'Skin Enhancer', desc: 'AI-powered skin retouching', badge: null, credits: 4, url: 'https://picsum.photos/seed/se/300/200' },
  { id: 'face4', name: 'Relight Portrait', desc: 'Change lighting on face photos', badge: null, credits: 5, url: 'https://picsum.photos/seed/rp/300/200' },
  { id: 'face5', name: 'Face Animation', desc: 'Animate face with expressions', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/fa/300/200' },
  { id: 'face6', name: 'Expression Transfer', desc: 'Transfer expressions between faces', badge: null, credits: 6, url: 'https://picsum.photos/seed/et/300/200' },
  { id: 'face7', name: 'Age Filter', desc: 'See yourself younger or older', badge: null, credits: 3, url: 'https://picsum.photos/seed/ag/300/200' },
  { id: 'face8', name: 'Hair Color', desc: 'Try different hair colors', badge: null, credits: 3, url: 'https://picsum.photos/seed/hc/300/200' },
];

export default function FacePage() {
  const [favorites, setFavorites] = useState([]);
  const toggleFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  return (
    <div className="min-h-screen pb-12" style={{ background: '#000000' }}>
      <Toaster position="top-center" />
      <StudioHero icon={User} title="FACE & CHARACTER" subtitle="Face swap, headshot, skin enhancer and more" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16, paddingBottom: 40,
        }}>
          {APPS.map((app, i) => (
            <AppCard
              key={app.id || i}
              app={app}
              isFavorite={favorites.includes(app.id)}
              onToggleFavorite={toggleFav}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
