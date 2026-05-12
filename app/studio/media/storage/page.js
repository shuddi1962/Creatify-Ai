'use client';

import { useState } from 'react';
import { HardDrive, Trash2, Link2 } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const USAGE = { used: 4.2, total: 10, breakdown: { images: 1.2, videos: 2.8, audio: 0.2 } };

export default function StoragePage() {
  const [cleaning, setCleaning] = useState(false);
  const [connected, setConnected] = useState({ drive: false, dropbox: false });

  const handleCleanUp = () => {
    setCleaning(true);
    setTimeout(() => { setCleaning(false); }, 3000);
  };

  const connectDrive = () => setConnected({ ...connected, drive: true });
  const connectDropbox = () => setConnected({ ...connected, dropbox: true });

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="STORAGE">
          <div style={{ padding: 8, color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6 }}>
            Manage your storage usage and connected services.
          </div>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, padding: 24, width: '100%', maxWidth: 500, margin: '0 auto' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 24,
            }}>
              STORAGE MANAGER
            </h1>
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <HardDrive size={20} style={{ color: '#CCFF00' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{USAGE.used} GB used of {USAGE.total} GB</span>
                </div>
                <button onClick={handleCleanUp} disabled={cleaning}
                  style={{ padding: '6px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {cleaning ? <div style={{ width: 12, height: 12, border: '2px solid var(--border-default)', borderTopColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <Trash2 size={12} />}
                  Clean Up
                </button>
              </div>
              <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-bg), #CCFF00)', borderRadius: 4, width: `${(USAGE.used / USAGE.total) * 100}%` }} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 8 }}>{((USAGE.used / USAGE.total) * 100).toFixed(1)}% used</p>
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 20, marginBottom: 16 }}>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Usage Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(USAGE.breakdown).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13, textTransform: 'capitalize' }}>{key}</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>{val} GB</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 20 }}>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Connected Storage</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: 'Google Drive', color: '#4285F4', key: 'drive', connected: connected.drive, handler: connectDrive },
                  { name: 'Dropbox', color: '#0061FF', key: 'dropbox', connected: connected.dropbox, handler: connectDropbox },
                ].map(svc => (
                  <div key={svc.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-input)', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Link2 size={14} style={{ color: svc.color }} />
                      <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>{svc.name}</span>
                    </div>
                    {svc.connected ? (
                      <span style={{ fontSize: 10, color: '#10B981', padding: '2px 8px', background: 'rgba(16,185,129,0.2)', borderRadius: 4 }}>Connected</span>
                    ) : (
                      <button onClick={svc.handler} style={{ padding: '4px 12px', background: `${svc.color}20`, color: svc.color, border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Connect</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Overview">
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {USAGE.total - USAGE.used} GB available
          </span>
        </DirectorBar>
      }
    />
  );
}
