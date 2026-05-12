'use client';

import { useState } from 'react';
import { LayoutTemplate, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const CATEGORIES = ['All', 'Image Pipelines', 'Video Pipelines', 'Marketing', 'Content Creation', 'Audio', 'Social Media', 'Advanced'];
const TEMPLATES = [
  { name: 'Instant Portrait', category: 'Image Pipelines', desc: 'Upload photo → AI headshot style', nodes: 4, usage: 2840 },
  { name: 'Product Launch Video', category: 'Video Pipelines', desc: 'Generate showcase reel from product images', nodes: 7, usage: 1950 },
  { name: 'UGC Ad Generator', category: 'Marketing', desc: 'Script → hook → video → caption', nodes: 9, usage: 3200 },
  { name: 'Bulk Image Variants', category: 'Image Pipelines', desc: 'One prompt → 20 variations', nodes: 3, usage: 4100 },
  { name: 'Cinematic Script to Video', category: 'Video Pipelines', desc: 'Script → scenes → storyboard → video', nodes: 12, usage: 1680 },
  { name: 'Podcast Clip Maker', category: 'Content Creation', desc: 'Audio → transcript → clips → captions', nodes: 6, usage: 2250 },
  { name: 'Music Visualizer', category: 'Audio', desc: 'Audio file → animated visuals', nodes: 5, usage: 890 },
  { name: 'Viral Tweet Generator', category: 'Social Media', desc: 'Topic → hooks → tweet → image', nodes: 8, usage: 3100 },
];
const OPTIONS = CATEGORIES;

export default function WorkflowTemplatesPage() {
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
                WORKFLOW TEMPLATES
              </h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 700, margin: '0 auto' }}>
                {filtered.map((t, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{t.name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{t.desc}</p>
                      </div>
                      <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4, whiteSpace: 'nowrap' }}>{t.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.nodes} nodes · {t.usage.toLocaleString()} uses</span>
                      <button onClick={() => toast.success(`Template "${t.name}" loaded!`)} style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '8px 16px', background: '#CCFF00', color: 'black',
                        fontSize: 12, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                      }}><Play size={12} /> Use Template</button>
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
