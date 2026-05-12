'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
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
    <StudioEditorLayout
      left={
        <LeftPanel title="FACE TOOLS">
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
              FACE & CHARACTER
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
