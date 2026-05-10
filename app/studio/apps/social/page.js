'use client';

import { useState } from 'react';
import { Laugh } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import AppCard from '@/components/studio/AppCard';

const APPS = [
  { id: 'soc1', name: 'Meme Generator', desc: 'Trending meme templates with text', badge: 'TOP', credits: 2, url: 'https://picsum.photos/seed/mg/300/200' },
  { id: 'soc2', name: 'Sticker Generator', desc: 'Create custom stickers from photos', badge: 'NEW', credits: 2, url: 'https://picsum.photos/seed/sg/300/200' },
  { id: 'soc3', name: 'Match Cut', desc: 'Seamless transition between clips', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/mc/300/200' },
  { id: 'soc4', name: 'Reaction GIF', desc: 'Create reaction GIFs instantly', badge: null, credits: 4, url: 'https://picsum.photos/seed/rg/300/200' },
  { id: 'soc5', name: 'Quote Card', desc: 'Create shareable quote images', badge: null, credits: 2, url: 'https://picsum.photos/seed/qc/300/200' },
  { id: 'soc6', name: 'Caption Overlay', desc: 'Add stylish captions to images', badge: null, credits: 2, url: 'https://picsum.photos/seed/co/300/200' },
];

export default function SocialPage() {
  const [favorites, setFavorites] = useState([]);
  const toggleFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  return (
    <div className="min-h-screen pb-12" style={{ background: '#000000' }}>
      <Toaster position="top-center" />
      <StudioHero icon={Laugh} title="MEME & SOCIAL" subtitle="Meme maker, sticker generator, and match cut apps" />
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
