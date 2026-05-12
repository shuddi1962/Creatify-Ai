'use client';

import { useState } from 'react';
import { Users, Search, Star, GitFork, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const COMMUNITY_WORKFLOWS = [
  { id: 1, name: 'Pro Headshot Studio', creator: '@aiportrait', desc: 'Studio-quality headshots from any photo', nodes: 5, runs: 15420, rating: 4.9 },
  { id: 2, name: 'Viral Reels Maker', creator: '@contentking', desc: 'Hook → script → video → caption', nodes: 8, runs: 12800, rating: 4.8 },
  { id: 3, name: 'Bulk Product Showcase', creator: '@ecomguru', desc: 'Upload product → 20 ad variants', nodes: 6, runs: 9800, rating: 4.7 },
  { id: 4, name: 'Anime Style Transfer', creator: '@animeai', desc: 'Apply anime style to any image', nodes: 4, runs: 22400, rating: 4.9 },
  { id: 5, name: 'Cinematic LUT Generator', creator: '@filmmaker', desc: 'Create custom color grades', nodes: 3, runs: 7600, rating: 4.6 },
  { id: 6, name: 'Talking Avatar Pipeline', creator: '@avatarshop', desc: 'Script → avatar → video', nodes: 7, runs: 11300, rating: 4.8 },
];
const OPTIONS = ['All', 'Image', 'Video', 'Audio', 'Marketing'];

export default function CommunityPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [prompt, setPrompt] = useState('');

  const filtered = COMMUNITY_WORKFLOWS.filter(w => {
    const matchSearch = !search || w.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || w.name.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCat;
  });

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
                COMMUNITY WORKFLOWS
              </h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 700, margin: '0 auto' }}>
                {filtered.map((wf, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{wf.name}</h4>
                        <p style={{ fontSize: 10, color: '#7C3AED', marginTop: 2 }}>{wf.creator}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B' }}>
                        <Star size={12} fill="#F59E0B" />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{wf.rating}</span>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 16 }}>{wf.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{wf.nodes} nodes · {wf.runs.toLocaleString()} runs</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => toast.success('Forked!')} style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '6px 12px', background: 'var(--bg-input)',
                          color: 'var(--text-secondary)', fontSize: 12, borderRadius: 8, border: 'none', cursor: 'pointer',
                        }}><GitFork size={12} /> Fork</button>
                        <button onClick={() => toast.success('Running workflow...')} style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '6px 16px', background: '#CCFF00', color: 'black',
                          fontSize: 12, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                        }}><Play size={12} /> Use</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Browse">
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 0, top: 3, color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workflows..."
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, paddingLeft: 22 }} />
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
