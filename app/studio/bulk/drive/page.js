'use client';

import { Cloud, Check, X } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import toast from 'react-hot-toast';

export default function BulkDrivePage() {
  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="CONNECT">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {['Google Drive', 'Dropbox', 'OneDrive'].map((svc, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: i === 0 ? 'rgba(0,200,150,0.06)' : 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Cloud size={16} style={{ color: i === 0 ? '#00c896' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{svc}</span>
                </div>
                {i === 0 ? <Check size={14} style={{ color: '#00c896' }} /> : <button style={{ fontSize: 10, padding: '2px 8px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Connect</button>}
              </div>
            ))}
          </div>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', zIndex: 1,
          }}>
            Push to Drive
          </h1>
          <div style={{ zIndex: 1, marginTop: 24, padding: '16px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, textAlign: 'center' }}>
            <Cloud size={40} style={{ color: '#00c896', marginBottom: 8 }} />
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Auto-sync outputs to your connected cloud storage</div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Drive Sync">
          <div style={{ flex: 1 }} />
          <GenerateButton onClick={() => toast.success('Syncing to Drive...')}>Sync Now</GenerateButton>
        </DirectorBar>
      }
    />
  );
}
