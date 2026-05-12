'use client';

import { useState } from 'react';
import { Grid, Search, Heart, Sparkles, Zap } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import AppCard from '@/components/studio/AppCard';

const CATEGORIES = ['All', 'VFX', 'Face & Character', 'Style', 'Product', 'Meme & Social', 'New'];
const SORTS = ['Popular', 'Newest', 'A-Z'];
const APPS = [
  { id: 1, name: 'Face Swap', desc: 'Swap faces in any image or video', category: 'Face & Character', badge: 'TOP', credits: 5, url: 'https://picsum.photos/seed/fs/300/200', favorite: true },
  { id: 2, name: 'AI Headshot', desc: 'Studio-quality professional headshots', category: 'Face & Character', badge: 'TOP', credits: 10, url: 'https://picsum.photos/seed/hs/300/200', favorite: false },
  { id: 3, name: 'Match Cut', desc: 'Seamless transition between clips', category: 'VFX', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/mc/300/200', favorite: false },
  { id: 4, name: 'Neon Glow', desc: 'Add vibrant neon lighting effects', category: 'Style', badge: null, credits: 3, url: 'https://picsum.photos/seed/ng/300/200', favorite: true },
  { id: 5, name: 'Style Transfer', desc: 'Apply artistic styles to photos', category: 'Style', badge: 'TOP', credits: 5, url: 'https://picsum.photos/seed/st/300/200', favorite: false },
  { id: 6, name: 'Sticker Generator', desc: 'Create custom stickers from photos', category: 'Meme & Social', badge: 'NEW', credits: 2, url: 'https://picsum.photos/seed/sg/300/200', favorite: false },
  { id: 7, name: 'Product Placement', desc: 'Place products in scenes naturally', category: 'Product', badge: null, credits: 8, url: 'https://picsum.photos/seed/pp/300/200', favorite: false },
  { id: 8, name: 'Color Grading', desc: 'Professional color correction LUTs', category: 'Style', badge: null, credits: 4, url: 'https://picsum.photos/seed/cg/300/200', favorite: false },
  { id: 9, name: 'Meme Generator', desc: 'Trending meme templates with text', category: 'Meme & Social', badge: 'TOP', credits: 2, url: 'https://picsum.photos/seed/mg/300/200', favorite: true },
  { id: 10, name: 'Skin Enhancer', desc: 'AI-powered skin retouching', category: 'Face & Character', badge: null, credits: 4, url: 'https://picsum.photos/seed/se/300/200', favorite: false },
  { id: 11, name: 'Camera Angles', desc: 'Generate multiple camera angles', category: 'VFX', badge: null, credits: 6, url: 'https://picsum.photos/seed/ca/300/200', favorite: false },
  { id: 12, name: 'Effects Pack', desc: '100+ VFX effects in one app', category: 'VFX', badge: 'NEW', credits: 10, url: 'https://picsum.photos/seed/ep/300/200', favorite: false },
];

export default function AllAppsPage() {
  const [apps, setApps] = useState(APPS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Popular');

  const toggleFav = (idOrName) => {
    setApps(apps.map(a => {
      const match = a.id === idOrName || a.name === idOrName;
      return match ? { ...a, favorite: !a.favorite } : a;
    }));
  };

  const filteredApps = apps
    .filter(a => category === 'All' || a.category === category || (category === 'New' && a.badge === 'NEW'))
    .filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()));

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sort === 'Newest') return (b.id || 0) - (a.id || 0);
    if (sort === 'A-Z') return a.name.localeCompare(b.name);
    return (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1;
  });

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="CATEGORIES">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: category === c ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: category === c ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{c}</button>
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
              EXPLORE APPS
            </h1>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {sortedApps.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  isFavorite={app.favorite}
                  onToggleFavorite={toggleFav}
                />
              ))}
            </div>
            {sortedApps.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                <p style={{ fontSize: 14 }}>No apps found.</p>
              </div>
            )}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Browse">
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search apps..."
              style={{
                width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '8px 12px 8px 32px',
                color: 'var(--text-primary)', fontSize: 13, outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {SORTS.map(s => (
              <ControlButton key={s} onClick={() => setSort(s)}
                style={{
                  background: sort === s ? 'var(--accent-bg)' : 'var(--bg-input)',
                  color: sort === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                  borderColor: sort === s ? 'var(--accent-bg)' : 'var(--border-default)',
                }}
              >{s}</ControlButton>
            ))}
          </div>
        </DirectorBar>
      }
    />
  );
}
