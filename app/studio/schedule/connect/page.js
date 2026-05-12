'use client';

import { useState } from 'react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const PLATFORMS = [
  { name: 'TikTok', color: '#FF0050', icon: '♪', connected: false },
  { name: 'Instagram', color: '#E4405F', icon: '◉', connected: false },
  { name: 'YouTube', color: '#FF0000', icon: '▶', connected: false },
  { name: 'LinkedIn', color: '#0A66C2', icon: 'in', connected: false },
  { name: 'Twitter', color: '#1DA1F2', icon: '✈', connected: false },
  { name: 'Pinterest', color: '#E60023', icon: '◐', connected: false },
  { name: 'Facebook', color: '#1877F2', icon: 'f', connected: false },
  { name: 'Snapchat', color: '#FFFC00', icon: '👻', connected: false },
];

export default function ConnectPage() {
  const [platforms, setPlatforms] = useState(PLATFORMS);
  const connect = (name) => setPlatforms(platforms.map(p => p.name === name ? { ...p, connected: true } : p));
  const disconnect = (name) => setPlatforms(platforms.map(p => p.name === name ? { ...p, connected: false } : p));

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="ACCOUNTS">
          {platforms.map(p => (
            <button key={p.name}
              onClick={() => p.connected ? disconnect(p.name) : connect(p.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: p.connected ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: p.connected ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >
              <span style={{ color: p.color }}>{p.icon}</span>
              {p.name} {p.connected ? '✓' : ''}
            </button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, padding: 24, width: '100%', maxHeight: '100%', overflowY: 'auto' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 24,
            }}>
              CONNECT ACCOUNTS
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>
              Link your social media accounts to schedule and publish directly
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, maxWidth: 600, margin: '0 auto' }}>
              {platforms.map(platform => (
                <div key={platform.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'var(--bg-card)', borderRadius: 12,
                  border: '1px solid var(--border-subtle)', padding: '12px 16px',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, background: `${platform.color}20` }}>
                    <span style={{ color: platform.color }}>{platform.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{platform.name}</p>
                    {platform.connected ? (
                      <span style={{ fontSize: 11, color: '#10B981' }}>Connected</span>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>Schedule and publish content</p>
                    )}
                  </div>
                  {platform.connected ? (
                    <button onClick={() => disconnect(platform.name)}
                      style={{ padding: '6px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: '#ef4444', fontSize: 11, cursor: 'pointer' }}
                    >Disconnect</button>
                  ) : (
                    <button onClick={() => connect(platform.name)}
                      style={{ padding: '6px 14px', background: '#CCFF00', border: 'none', borderRadius: 8, color: '#000', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}
                    >Connect</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Status">
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {platforms.filter(p => p.connected).length}/{platforms.length} connected
          </span>
        </DirectorBar>
      }
    />
  );
}
