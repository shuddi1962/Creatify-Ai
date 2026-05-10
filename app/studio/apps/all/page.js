'use client';

import { useState } from 'react';
import { Grid, Search, Heart, Sparkles, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
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
    <div className="min-h-screen pb-12" style={{ background: '#000000' }}>
      <Toaster position="top-center" />
      <StudioHero icon={Grid} title="EXPLORE APPS" subtitle="150+ one-click creative apps for every creative use case" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Search + Sort */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 400 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search apps..."
                style={{
                  width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '10px 14px 10px 38px',
                  color: '#fff', fontSize: 14, outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {SORTS.map(s => (
                <button key={s} onClick={() => setSort(s)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                    transition: 'all 150ms',
                    background: sort === s ? '#CCFF00' : '#111',
                    color: sort === s ? '#000' : '#6B7280',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: 'flex', gap: 4, flexWrap: 'wrap', overflowX: 'auto',
            background: '#111', borderRadius: 100, padding: 4, width: 'fit-content',
          }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                style={{
                  padding: '8px 16px', fontSize: 13, whiteSpace: 'nowrap',
                  borderRadius: 100, border: 'none', cursor: 'pointer',
                  transition: 'all 150ms',
                  background: category === c ? '#CCFF00' : 'transparent',
                  color: category === c ? '#000' : '#6B7280',
                  fontWeight: category === c ? 700 : 400,
                }}
                onMouseEnter={(e) => { if (category !== c) e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { if (category !== c) e.currentTarget.style.color = '#6B7280'; }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
          paddingBottom: 40,
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
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
            <p style={{ fontSize: 14 }}>No apps found.</p>
          </div>
        )}

        {/* Muapi Ecosystem Footer */}
        <div style={{
          textAlign: 'center', padding: '24px 0 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: 12, color: '#444' }}>
            Muapi Ecosystem — More templates coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
