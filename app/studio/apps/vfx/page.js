'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
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
    <StudioEditorLayout
      left={
        <LeftPanel title="VFX TOOLS">
          {APPS.map(a => (
            <button key={a.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
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
              VFX & EFFECTS
            </h1>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
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
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <ControlButton>Filter</ControlButton>
            <StudioDropdown options={['Popular', 'Newest', 'A-Z']} value="Popular" onChange={() => {}} />
          </div>
        </DirectorBar>
      }
    />
  );
}
