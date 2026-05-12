'use client';

import { useState } from 'react';
import { Hash, TrendingUp, Music, Video, Image } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter/X', 'Pinterest'];

export default function PlatformPage() {
  const [platform, setPlatform] = useState('TikTok');

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="PLATFORMS">
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', background: platform === p ? 'var(--accent-bg)' : 'none', border: 'none', cursor: 'pointer', borderRadius: 8, color: platform === p ? 'var(--accent-text)' : 'var(--text-secondary)', fontSize: 13, textAlign: 'left' }}
              onMouseEnter={e => { if (platform !== p) e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { if (platform !== p) e.currentTarget.style.background = 'none'; }}
            >
              {p === 'TikTok' && <Music size={14} />}
              {p === 'Instagram' && <Image size={14} />}
              {p === 'YouTube' && <Video size={14} />}
              {(p === 'LinkedIn' || p === 'Twitter/X' || p === 'Pinterest') && <Hash size={14} />}
              {p}
            </button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', zIndex: 1,
          }}>
            Trends by Platform
          </h1>
          <div style={{ zIndex: 1, marginTop: 16, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            {platform} trending content will appear here
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Platform Trends">
          <div style={{ flex: 1 }} />
          <ControlButton>Trending</ControlButton>
          <ControlButton>Rising</ControlButton>
          <GenerateButton>Load {platform} Trends</GenerateButton>
        </DirectorBar>
      }
    />
  );
}
