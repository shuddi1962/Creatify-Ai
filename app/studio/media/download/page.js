'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, CornerMarkers } from '@/components/studio/StudioEditorLayout';

export default function DownloadPage() {
  const [prompt, setPrompt] = useState('');

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="EXPORT">
          <div style={{ padding: 8, color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6 }}>
            Select assets from the Media Library to download individually or in bulk.
          </div>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, textAlign: 'center', padding: 24 }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 24,
            }}>
              EXPORT & DOWNLOAD
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 32 }}>
              Download your generated content individually or in bulk
            </p>
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 48, maxWidth: 400, margin: '0 auto' }}>
              <div style={{ width: 64, height: 64, background: 'var(--bg-input)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Download size={32} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Select assets from Media Library to download</p>
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Ready">
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            No assets selected
          </span>
        </DirectorBar>
      }
    />
  );
}
