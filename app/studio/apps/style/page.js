'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
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
    <StudioEditorLayout
      left={
        <LeftPanel title="STYLE TOOLS">
          {APPS.map(a => (
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
              STYLE & COLOR
            </h1>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {APPS.map((app, i) => (
                <AppCard key={app.id || i} app={app} isFavorite={favorites.includes(app.id)} onToggleFavorite={toggleFav} />
              ))}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <ControlButton>Filter</ControlButton>
          <StudioDropdown options={['Popular', 'Newest', 'A-Z']} value="Popular" onChange={() => {}} />
        </DirectorBar>
      }
    />
  );
}
