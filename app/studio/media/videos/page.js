'use client';

import { useState } from 'react';
import { Video, Search, Play } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const VIDEOS = [
  { id: 1, url: 'https://picsum.photos/seed/vid1/400/225', name: 'product-reel.mp4', model: 'Seedance', date: 'May 9', size: '18.7 MB' },
  { id: 2, url: 'https://picsum.photos/seed/vid2/400/225', name: 'ad-clip.mp4', model: 'Kling', date: 'May 6', size: '24.3 MB' },
  { id: 3, url: 'https://picsum.photos/seed/vid3/400/225', name: 'tutorial.mp4', model: 'Seedance', date: 'May 4', size: '32.1 MB' },
  { id: 4, url: 'https://picsum.photos/seed/vid4/400/225', name: 'reel-2.mp4', model: 'Kling', date: 'May 2', size: '15.8 MB' },
];

export default function VideosPage() {
  const [videos] = useState(VIDEOS);
  const [search, setSearch] = useState('');
  const filtered = videos.filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="VIDEOS">
          <div style={{ padding: 8, color: 'var(--text-secondary)', fontSize: 12 }}>
            {videos.length} videos in library
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
              VIDEOS
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>{filtered.length} videos</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {filtered.map(vid => (
                <div key={vid.id} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bg-input)' }}>
                    <img src={vid.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={18} style={{ color: '#000', marginLeft: 2 }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 12 }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>{vid.name}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 4 }}>{vid.model} &middot; {vid.size}</p>
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos..."
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px 8px 32px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
            />
          </div>
        </DirectorBar>
      }
    />
  );
}
