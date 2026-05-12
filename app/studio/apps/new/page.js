'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
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
    <StudioEditorLayout
      left={
        <LeftPanel title="NEW APPS">
          {NEW_APPS.map(a => (
            <button key={a.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
                color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
              }}
            >{a.name}</button>
          ))}
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
              NEW THIS WEEK
            </h1>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {NEW_APPS.map((app, i) => (
                <AppCard key={app.id || i} app={app} isFavorite={favorites.includes(app.id)} onToggleFavorite={toggleFav} />
              ))}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <ControlButton>Sort</ControlButton>
          <StudioDropdown options={['Newest', 'Popular']} value="Newest" onChange={() => {}} />
        </DirectorBar>
      }
    />
  );
}
