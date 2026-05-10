'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
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
    <div className="min-h-screen pb-12" style={{ background: '#000000' }}>
      <Toaster position="top-center" />
      <StudioHero icon={ShoppingBag} title="PRODUCT & FASHION" subtitle="Fashion generator, product placement, and brand apps" />
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
