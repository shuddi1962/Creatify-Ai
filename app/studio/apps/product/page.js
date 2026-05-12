'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import AppCard from '@/components/studio/AppCard';

const APPS = [
  { id: 'prod1', name: 'Product Placement', desc: 'Place products in scenes naturally', badge: null, credits: 8, url: 'https://picsum.photos/seed/pp/300/200' },
  { id: 'prod2', name: 'Fashion Generator', desc: 'AI-generated fashion outfits', badge: 'TOP', credits: 6, url: 'https://picsum.photos/seed/fg/300/200' },
  { id: 'prod3', name: '360 Product', desc: 'Generate 360 product spin', badge: 'NEW', credits: 10, url: 'https://picsum.photos/seed/360/300/200' },
  { id: 'prod4', name: 'Product Upscale', desc: 'Enhance product photo quality', badge: null, credits: 4, url: 'https://picsum.photos/seed/pu/300/200' },
  { id: 'prod5', name: 'White Background', desc: 'Remove bg, white backdrop', badge: null, credits: 3, url: 'https://picsum.photos/seed/wb/300/200' },
  { id: 'prod6', name: 'Shadow Generator', desc: 'Add realistic drop shadows', badge: null, credits: 2, url: 'https://picsum.photos/seed/sg/300/200' },
];

export default function ProductPage() {
  const [favorites, setFavorites] = useState([]);
  const toggleFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="PRODUCT TOOLS">
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
              PRODUCT & FASHION
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
