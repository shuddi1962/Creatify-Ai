'use client';

import { useState } from 'react';
import { Link2 } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

export default function DrivePage() {
  const [connected, setConnected] = useState(false);
  const handleConnect = () => setConnected(true);

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="DRIVE">
          <div style={{ padding: 8, color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6 }}>
            Connect your Google Drive to sync generated assets automatically.
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
              GOOGLE DRIVE
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 32 }}>
              Connect Google Drive to save and sync your generated content
            </p>
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 48, maxWidth: 400, margin: '0 auto' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(66,133,244,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Link2 size={32} style={{ color: '#4285F4' }} />
              </div>
              {connected ? (
                <div>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>Connected to Google Drive</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Your files are being synced</p>
                </div>
              ) : (
                <button onClick={handleConnect}
                  style={{ padding: '12px 32px', background: '#4285F4', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 12, fontSize: 14, cursor: 'pointer' }}
                >Connect Google Drive</button>
              )}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Status">
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {connected ? 'Connected' : 'Not connected'}
          </span>
        </DirectorBar>
      }
    />
  );
}
