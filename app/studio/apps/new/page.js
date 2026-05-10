'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import AppCard from '@/components/studio/AppCard';

const NEW_APPS = [
  { id: 'new1', name: 'Match Cut', desc: 'Seamless transition between clips', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/mc/300/200' },
  { id: 'new2', name: 'Effects Pack', desc: '100+ VFX effects in one app', badge: 'NEW', credits: 10, url: 'https://picsum.photos/seed/ep/300/200' },
  { id: 'new3', name: 'Sticker Generator', desc: 'Create custom stickers from photos', badge: 'NEW', credits: 2, url: 'https://picsum.photos/seed/sg/300/200' },
  { id: 'new4', name: 'Face Animation', desc: 'Animate face with expressions', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/fa/300/200' },
  { id: 'new5', name: '360 Product', desc: 'Generate 360 product spin', badge: 'NEW', credits: 10, url: 'https://picsum.photos/seed/360/300/200' },
  { id: 'new6', name: 'Reaction GIF', desc: 'Create reaction GIFs instantly', badge: 'NEW', credits: 4, url: 'https://picsum.photos/seed/rg/300/200' },
];

export default function NewPage() {
  const [favorites, setFavorites] = useState([]);
  const toggleFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  return (
    <div className="min-h-screen pb-12" style={{ background: '#000000' }}>
      <Toaster position="top-center" />
      <StudioHero icon={Sparkles} title="NEW THIS WEEK" subtitle="The latest apps added to the platform" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16, paddingBottom: 40,
        }}>
          {NEW_APPS.map((app, i) => (
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
