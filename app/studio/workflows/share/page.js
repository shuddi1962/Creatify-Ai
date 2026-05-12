'use client';

import { useState } from 'react';
import { Share2, Globe, Lock, Eye } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const VISIBILITY = ['Public', 'Unlisted', 'Private'];
const MY_PUBLISHED = [
  { id: 1, name: 'Instant Headshot Studio', visibility: 'Public', forks: 42, rating: 4.8 },
  { id: 2, name: 'Viral Reels Maker', visibility: 'Unlisted', forks: 18, rating: 4.7 },
];
const OPTIONS = VISIBILITY;

export default function SharePage() {
  const [workflow, setWorkflow] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [published, setPublished] = useState(MY_PUBLISHED);
  const [option, setOption] = useState('Public');
  const [prompt, setPrompt] = useState('');

  const publish = () => {
    if (!workflow || !title) { toast.error('Fill in all fields'); return; }
    setPublished([...published, { id: Date.now(), name: title, visibility, forks: 0, rating: 0 }]);
    toast.success('Workflow published!');
    setTitle(''); setDesc('');
  };

  const filtered = option === 'All' ? published : published.filter(p => p.visibility === option);

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="VISIBILITY">
            <button onClick={() => setOption('All')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: option === 'All' ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: option === 'All' ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >All</button>
            {OPTIONS.map(p => (
              <button key={p} onClick={() => { setVisibility(p); setOption(p); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: visibility === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: visibility === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >{p}</button>
            ))}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '8px 0' }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '8px 12px' }}>Published</div>
            {filtered.map(p => (
              <div key={p.id} style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.name}</div>
            ))}
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
                color: 'transparent',
                background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                SHARE WORKFLOW
              </h1>
              <div style={{ width: '100%', maxWidth: 700 }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24, marginBottom: 32 }}>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>Publish a Workflow</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Select Workflow</label>
                      <select value={workflow} onChange={e => setWorkflow(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }}>
                        <option value="">Choose a workflow...</option>
                        <option>Image to Cinematic Video</option>
                        <option>Product Showcase Pipeline</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Title</label>
                      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your workflow a name" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Description</label>
                      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe what this workflow does..." style={{ width: '100%', height: 80, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', resize: 'none', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Visibility</label>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {VISIBILITY.map(v => (
                          <button key={v} onClick={() => setVisibility(v)} style={{
                            flex: 1, padding: '12px 16px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: visibility === v ? '#7C3AED' : 'var(--bg-input)',
                            color: visibility === v ? 'white' : 'var(--text-secondary)',
                            border: visibility === v ? 'none' : '1px solid var(--border-default)',
                            cursor: 'pointer',
                          }}>
                            {v === 'Public' && <Globe size={14} />}
                            {v === 'Unlisted' && <Eye size={14} />}
                            {v === 'Private' && <Lock size={14} />}
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={publish} style={{
                    width: '100%', marginTop: 24, padding: '12px 24px',
                    background: '#CCFF00', color: 'black', fontWeight: 700,
                    borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 16,
                  }}>Publish Workflow</button>
                </div>

                {published.length > 0 && (
                  <div>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>My Published Workflows</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {filtered.map(wf => (
                        <div key={wf.id} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{wf.name}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{wf.forks} forks</span>
                              <span style={{ fontSize: 10, color: '#F59E0B' }}>★ {wf.rating}</span>
                              <span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--bg-input)', color: 'var(--text-muted)', borderRadius: 4 }}>{wf.visibility}</span>
                            </div>
                          </div>
                          <button onClick={() => toast.success('Link copied!')} style={{ padding: '8px 16px', background: 'var(--bg-input)', color: 'var(--text-secondary)', fontSize: 12, borderRadius: 8, border: 'none', cursor: 'pointer' }}>Copy Link</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Actions">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Search published..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={publish}>Publish</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
