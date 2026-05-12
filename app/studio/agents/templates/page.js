'use client';

import { useState } from 'react';
import { Bot, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const CATEGORIES = ['Content Creation', 'Marketing', 'Social Media', 'Bulk Generation', 'Research', 'Custom'];
const TEMPLATES = [
  { name: 'Daily Hook Generator', category: 'Content Creation', desc: 'Generate 10 viral hooks every morning', trigger: 'Schedule', actions: ['Hook Generation', 'Caption Writing'] },
  { name: 'UGC Ad Pipeline', category: 'Marketing', desc: 'URL → script → video → caption', trigger: 'Webhook', actions: ['URL Analysis', 'Script Gen', 'Video Gen'] },
  { name: 'Bulk Image Variants', category: 'Bulk Generation', desc: 'One prompt → 50 image variations', trigger: 'Manual', actions: ['Image Gen', 'Upscale', 'Export'] },
  { name: 'Competitor Watcher', category: 'Research', desc: 'Track and analyze competitor content daily', trigger: 'Schedule', actions: ['Scrape', 'Analysis', 'Report'] },
  { name: 'Podcast Clipper', category: 'Content Creation', desc: 'Long audio → clip-ready social posts', trigger: 'Webhook', actions: ['Transcribe', 'Clip Select', 'Caption Gen'] },
  { name: 'Product Review Bot', category: 'Marketing', desc: 'Auto-generate product review content', trigger: 'Webhook', actions: ['Data Fetch', 'Script Gen', 'Thumbnail'] },
];
const OPTIONS = ['All', ...CATEGORIES];

export default function AgentTemplatesPage() {
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
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                AGENT TEMPLATES
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12, marginTop: 8 }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--bg-input)', color: 'var(--text-muted)', borderRadius: 4 }}>{t.trigger}</span>
                      {t.actions.map(a => <span key={a} style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4 }}>{a}</span>)}
                    </div>
                    <button onClick={() => toast.success(`Template "${t.name}" loaded!`)} style={{
                      width: '100%', padding: '8px 16px', background: '#CCFF00', color: 'black',
                      fontSize: 12, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}><Zap size={12} /> Use Template</button>
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
