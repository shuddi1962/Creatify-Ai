'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import AppCard from '@/components/studio/AppCard';

const APPS = [
  { id: 'style1', name: 'Style Transfer', desc: 'Apply artistic styles to photos', badge: 'TOP', credits: 5, url: 'https://picsum.photos/seed/st/300/200' },
  { id: 'style2', name: 'Color Grading', desc: 'Professional color correction', badge: null, credits: 4, url: 'https://picsum.photos/seed/cg/300/200' },
  { id: 'style3', name: 'Film Grain', desc: 'Add authentic film grain texture', badge: null, credits: 2, url: 'https://picsum.photos/seed/fg/300/200' },
  { id: 'style4', name: 'Vintage Filter', desc: 'Classic vintage photo look', badge: null, credits: 2, url: 'https://picsum.photos/seed/vf/300/200' },
  { id: 'style5', name: 'Neon Effect', desc: 'Add vibrant neon glow effects', badge: null, credits: 3, url: 'https://picsum.photos/seed/ne/300/200' },
  { id: 'style6', name: 'Anime Filter', desc: 'Transform into anime style', badge: null, credits: 4, url: 'https://picsum.photos/seed/af/300/200' },
  { id: 'style7', name: 'Cartoon Filter', desc: 'Cartoon-style rendering', badge: null, credits: 3, url: 'https://picsum.photos/seed/cf/300/200' },
  { id: 'style8', name: 'Sketch Effect', desc: 'Convert photo to pencil sketch', badge: null, credits: 2, url: 'https://picsum.photos/seed/sk/300/200' },
];

export default function StylePage() {
  const [favorites, setFavorites] = useState([]);
  const toggleFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  return (
    <div className="min-h-screen pb-12" style={{ background: '#000000' }}>
      <Toaster position="top-center" />
      <StudioHero icon={Palette} title="STYLE & COLOR" subtitle="Color grading, artistic styles, and filter apps" />
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
