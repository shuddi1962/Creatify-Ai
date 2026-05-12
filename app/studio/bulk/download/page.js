'use client';

import { useState } from 'react';
import { Download, FileArchive, Check } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

export default function BulkDownloadPage() {
  const [loading, setLoading] = useState(false);

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="EXPORT">
          <div style={{ padding: '8px 4px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Select completed batch jobs to download all outputs as ZIP files.
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Batch Job #1', 'Batch Job #2', 'Batch Job #3'].map((job, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px', borderRadius: 6, cursor: 'pointer', background: 'var(--bg-hover)' }}>
                <input type="checkbox" style={{ accentColor: '#CCFF00' }} />
                <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{job}</span>
              </label>
            ))}
          </div>
          <button style={{ marginTop: 12, width: '100%', padding: '8px 0', background: 'var(--btn-generate-bg)', color: '#000', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Download size={14} /> Download Selected
          </button>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            Download ZIP
          </h1>
          <div style={{ zIndex: 1, marginTop: 24, display: 'flex', gap: 12 }}>
            <div style={{ padding: '16px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, textAlign: 'center' }}>
              <FileArchive size={32} style={{ color: 'var(--accent-primary)', marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>0</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Available Downloads</div>
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Bulk Download">
          <div style={{ flex: 1 }} />
          <GenerateButton onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>
            {loading ? 'Preparing...' : 'Download All'}
          </GenerateButton>
        </DirectorBar>
      }
    />
  );
}
