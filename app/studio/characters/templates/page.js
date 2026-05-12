'use client';

import { useState } from 'react';
import { LayoutTemplate, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const CATEGORIES = ['Urban', 'Nature', 'Interior', 'Fantasy', 'Sci-Fi', 'Historical', 'Abstract', 'Studio'];
const TEMPLATES = [
  { name: 'City Street', category: 'Urban', desc: 'Downtown urban environment', nodes: 5, url: 'https://picsum.photos/seed/city/400/225' },
  { name: 'Tropical Beach', category: 'Nature', desc: 'Sunny beach paradise', nodes: 4, url: 'https://picsum.photos/seed/beach/400/225' },
  { name: 'Modern Office', category: 'Interior', desc: 'Contemporary workspace', nodes: 6, url: 'https://picsum.photos/seed/office/400/225' },
  { name: 'Enchanted Forest', category: 'Fantasy', desc: 'Magical woodland scene', nodes: 7, url: 'https://picsum.photos/seed/forest/400/225' },
  { name: 'Space Station', category: 'Sci-Fi', desc: 'Futuristic orbital base', nodes: 8, url: 'https://picsum.photos/seed/space/400/225' },
  { name: 'Ancient Ruins', category: 'Historical', desc: 'Weathered stone temple', nodes: 5, url: 'https://picsum.photos/seed/ruins/400/225' },
  { name: 'Neon Void', category: 'Abstract', desc: 'Surreal light installation', nodes: 4, url: 'https://picsum.photos/seed/neonvoid/400/225' },
  { name: 'White Studio', category: 'Studio', desc: 'Clean infinite white', nodes: 3, url: 'https://picsum.photos/seed/white/400/225' },
];
const OPTIONS = ['All', ...CATEGORIES];

export default function TemplatesPage() {
  const [category, setCategory] = useState('All');
  const [prompt, setPrompt] = useState('');

  const filtered = category === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.category === category);

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="CATEGORIES">
            {OPTIONS.map(p => (
              <button key={p} onClick={() => setCategory(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: category === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: category === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >{p}</button>
            ))}
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '40px' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
                color: 'transparent',
                background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                SCENE TEMPLATES
              </h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 700, margin: '0 auto' }}>
                {filtered.map((t, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                    <img src={t.url} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} alt="" />
                    <div style={{ padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div>
                          <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{t.name}</h4>
                          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{t.desc}</p>
                        </div>
                        <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4, whiteSpace: 'nowrap' }}>{t.category}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.nodes} nodes</span>
                        <button onClick={() => toast.success(`Template "${t.name}" applied!`)} style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '8px 16px', background: '#CCFF00', color: 'black',
                          fontSize: 12, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                        }}><Play size={12} /> Use Template</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Templates">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Search templates..." />
          </DirectorBar>
        }
      />
    </>
  );
}
