'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import AppCard from '@/components/studio/AppCard';

const APPS = [
  { id: 'vfx1', name: 'Match Cut', desc: 'Seamless transition between clips', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/mc/300/200' },
  { id: 'vfx2', name: 'Camera Angles', desc: 'Generate multiple camera angles', badge: null, credits: 6, url: 'https://picsum.photos/seed/ca/300/200' },
  { id: 'vfx3', name: 'Effects Pack', desc: '100+ VFX effects in one app', badge: 'NEW', credits: 10, url: 'https://picsum.photos/seed/ep/300/200' },
  { id: 'vfx4', name: 'Color Grading', desc: 'Professional color correction', badge: null, credits: 4, url: 'https://picsum.photos/seed/cg/300/200' },
  { id: 'vfx5', name: 'Relight', desc: 'Change lighting in any scene', badge: null, credits: 5, url: 'https://picsum.photos/seed/rl/300/200' },
  { id: 'vfx6', name: 'Motion Blur', desc: 'Add cinematic motion blur', badge: null, credits: 3, url: 'https://picsum.photos/seed/mb/300/200' },
];

export default function VFXPage() {
  const [favorites, setFavorites] = useState([]);
  const toggleFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  return (
    <div className="min-h-screen pb-12" style={{ background: '#000000' }}>
      <Toaster position="top-center" />
      <StudioHero icon={Sparkles} badge="TOP" title="VFX & EFFECTS" subtitle="All VFX presets in app card format" />
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
