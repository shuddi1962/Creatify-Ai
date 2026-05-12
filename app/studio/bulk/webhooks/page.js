'use client';

import { useState } from 'react';
import { Bell, Link2, Plus, Trash2 } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import toast from 'react-hot-toast';

export default function BulkWebhooksPage() {
  const [webhooks, setWebhooks] = useState([
    { id: 1, url: 'https://hooks.example.com/creatify', events: 'all', active: true },
  ]);

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="WEBHOOKS">
          <button style={{ width: '100%', padding: '8px 0', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Plus size={14} /> Add Webhook
          </button>
          {webhooks.map(w => (
            <div key={w.id} style={{ marginTop: 8, padding: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', wordBreak: 'break-all' }}>{w.url}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: w.active ? 'rgba(0,200,150,0.15)' : 'var(--bg-input)', color: w.active ? '#00c896' : 'var(--text-muted)' }}>{w.active ? 'Active' : 'Paused'}</span>
                <Trash2 size={12} style={{ color: '#ef4444', cursor: 'pointer', marginLeft: 'auto' }} />
              </div>
            </div>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', zIndex: 1,
          }}>
            Webhooks
          </h1>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Webhook Config">
          <div style={{ flex: 1, display: 'flex', gap: 8 }}>
            <input placeholder="https://your-server.com/webhook" style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
            <ControlButton onClick={() => toast.success('Webhook tested')}>Test</ControlButton>
          </div>
          <GenerateButton onClick={() => toast.success('Webhook saved')}>Save</GenerateButton>
        </DirectorBar>
      }
    />
  );
}
