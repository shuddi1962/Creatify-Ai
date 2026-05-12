'use client';

import { useState } from 'react';
import { Image, Search, Download, Trash2 } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const IMAGES = [
  { id: 1, url: 'https://picsum.photos/seed/img1/400/300', name: 'hero-banner.png', model: 'Flux', date: 'May 10', size: '2.4 MB' },
  { id: 2, url: 'https://picsum.photos/seed/img2/400/300', name: 'thumbnail-1.png', model: 'Flux', date: 'May 8', size: '1.2 MB' },
  { id: 3, url: 'https://picsum.photos/seed/img3/400/300', name: 'social-post.png', model: 'Flux', date: 'May 7', size: '980 KB' },
  { id: 4, url: 'https://picsum.photos/seed/img4/400/300', name: 'headshot.png', model: 'Realistic', date: 'May 5', size: '1.8 MB' },
  { id: 5, url: 'https://picsum.photos/seed/img5/400/300', name: 'product-shot.png', model: 'Flux', date: 'May 4', size: '2.1 MB' },
  { id: 6, url: 'https://picsum.photos/seed/img6/400/300', name: 'banner-2.png', model: 'Flux', date: 'May 3', size: '1.5 MB' },
];

export default function ImagesPage() {
  const [images] = useState(IMAGES);
  const [search, setSearch] = useState('');
  const filtered = images.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="IMAGES">
          <div style={{ padding: 8, color: 'var(--text-secondary)', fontSize: 12 }}>
            {images.length} images in library
          </div>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, padding: 24, width: '100%', height: '100%', overflowY: 'auto' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 6,
            }}>
              IMAGES
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>{filtered.length} images</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {filtered.map(img => (
                <div key={img.id} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '1', background: 'var(--bg-input)' }}>
                    <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  </div>
                  <div style={{ padding: 8 }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: 11, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{img.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 10 }}>{img.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Search">
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images..."
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px 8px 32px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
            />
          </div>
        </DirectorBar>
      }
    />
  );
}
