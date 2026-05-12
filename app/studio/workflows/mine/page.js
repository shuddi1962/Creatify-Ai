'use client';

import { useState } from 'react';
import { GitBranch, Play, Copy, Share2, Trash2, Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import Link from 'next/link';

const SAMPLE_WORKFLOWS = [
  { id: 1, name: 'Image to Cinematic Video', nodes: 5, lastRun: '2 hours ago', status: 'active', runs: 23 },
  { id: 2, name: 'Product Showcase Pipeline', nodes: 8, lastRun: '1 day ago', status: 'active', runs: 15 },
  { id: 3, name: 'Meme Generator Chain', nodes: 3, lastRun: '3 days ago', status: 'paused', runs: 8 },
  { id: 4, name: 'Bulk Character Animation', nodes: 6, lastRun: '5 days ago', status: 'active', runs: 31 },
];
const OPTIONS = SAMPLE_WORKFLOWS.map(w => w.name);

export default function MyWorkflowsPage() {
  const [workflows, setWorkflows] = useState(SAMPLE_WORKFLOWS);
  const [option, setOption] = useState('All');
  const [prompt, setPrompt] = useState('');

  const handleDelete = (id) => { setWorkflows(workflows.filter(w => w.id !== id)); toast.success('Deleted'); };
  const handleDuplicate = (name) => { setWorkflows([...workflows, { id: Date.now(), name: `${name} (copy)`, nodes: 5, lastRun: 'Just now', status: 'active', runs: 0 }]); toast.success('Duplicated!'); };

  const filtered = option === 'All' ? workflows : workflows.filter(w => w.name === option);

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="WORKFLOWS">
            <button onClick={() => setOption('All')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: option === 'All' ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: option === 'All' ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >All Workflows</button>
            {OPTIONS.map(p => (
              <button key={p} onClick={() => setOption(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: option === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: option === p ? 'var(--accent-text)' : 'var(--text-secondary)',
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
                MY WORKFLOWS
              </h1>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ width: 80, height: 80, background: 'var(--bg-input)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><GitBranch size={32} color="var(--text-muted)" /></div>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>No workflows yet</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Create your first workflow to automate generation</p>
                  <Link href="/studio/workflows/canvas" style={{ display: 'inline-block', padding: '10px 24px', background: '#CCFF00', color: 'black', fontWeight: 700, borderRadius: 12, textDecoration: 'none', fontSize: 14 }}>Create Workflow</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 700, margin: '0 auto' }}>
                  {filtered.map(wf => (
                    <div key={wf.id} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <h3 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{wf.name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{wf.nodes} nodes</span>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{wf.runs} runs</span>
                            <span style={{
                              fontSize: 10, padding: '2px 8px', borderRadius: 4,
                              background: wf.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                              color: wf.status === 'active' ? '#10B981' : '#F59E0B',
                            }}>{wf.status}</span>
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 16 }}>Last run: {wf.lastRun}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => toast.success('Opening workflow...')} style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-input)', color: '#CCFF00', fontSize: 12, fontWeight: 600, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Play size={12} /> Run</button>
                        <button onClick={() => toast.success('Editing workflow...')} style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-input)', color: 'var(--text-secondary)', fontSize: 12, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><GitBranch size={12} /> Open</button>
                        <button onClick={() => handleDuplicate(wf.name)} style={{ padding: '8px', background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}><Copy size={14} /></button>
                        <button onClick={() => toast.success('Sharing workflow...')} style={{ padding: '8px', background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}><Share2 size={14} /></button>
                        <button onClick={() => handleDelete(wf.id)} style={{ padding: '8px', background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Actions">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Search workflows..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <Link href="/studio/workflows/canvas" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#CCFF00', color: 'black', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                <Plus size={16} /> New Workflow
              </Link>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
