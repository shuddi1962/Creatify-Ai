'use client';

import { useState } from 'react';
import { Globe, TrendingUp } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const REGIONS = ['Worldwide', 'United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Japan', 'Brazil', 'Germany', 'France', 'Nigeria', 'South Korea'];

export default function RegionPage() {
  const [region, setRegion] = useState('Worldwide');
  const [trends, setTrends] = useState([]);

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="REGIONS">
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', background: region === r ? 'var(--accent-bg)' : 'none', border: 'none', cursor: 'pointer', borderRadius: 8, color: region === r ? 'var(--accent-text)' : 'var(--text-secondary)', fontSize: 13, textAlign: 'left' }}
              onMouseEnter={e => { if (region !== r) e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { if (region !== r) e.currentTarget.style.background = 'none'; }}
            >
              <Globe size={14} /> {r}
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
            Trending by Region
          </h1>
          <div style={{ zIndex: 1, marginTop: 16, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            {region} — Top trends will appear here
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Regional Trends">
          <div style={{ flex: 1 }} />
          <ControlButton>Last 24h</ControlButton>
          <ControlButton>Last 7d</ControlButton>
          <GenerateButton onClick={() => setTrends(['Trend 1', 'Trend 2', 'Trend 3'])}>Load Trends</GenerateButton>
        </DirectorBar>
      }
    />
  );
}
