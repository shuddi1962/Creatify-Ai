'use client';

import { useState } from 'react';
import { Bot, Play, Edit, FileText, Trash2, Plus, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import Link from 'next/link';

const SAMPLE_AGENTS = [
  { id: 1, name: 'Daily Content Bot', emoji: '🤖', trigger: 'Schedule', lastRun: '2 hours ago', status: 'active', runs: 45 },
  { id: 2, name: 'Hook Generator', emoji: '🎯', trigger: 'Manual', lastRun: '1 day ago', status: 'active', runs: 23 },
  { id: 3, name: 'Product Showcase', emoji: '🎨', trigger: 'Webhook', lastRun: '3 days ago', status: 'paused', runs: 12 },
];
const OPTIONS = SAMPLE_AGENTS.map(a => a.name);

export default function MyAgentsPage() {
  const [agents, setAgents] = useState(SAMPLE_AGENTS);
  const [option, setOption] = useState('All');
  const [prompt, setPrompt] = useState('');

  const toggleStatus = (id) => {
    setAgents(agents.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));
    toast.success('Status updated');
  };

  const deleteAgent = (id) => {
    setAgents(agents.filter(a => a.id !== id));
    toast.success('Agent deleted');
  };

  const runNow = (name) => toast.success(`Running ${name}...`);

  const filtered = option === 'All' ? agents : agents.filter(a => a.name === option);

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="AGENTS">
            <button onClick={() => setOption('All')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: option === 'All' ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: option === 'All' ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >All Agents</button>
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
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                MY AGENTS
              </h1>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ width: 80, height: 80, background: 'var(--bg-input)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Bot size={32} color="var(--text-muted)" /></div>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>No agents yet</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Create an AI agent to automate your content workflow</p>
                  <Link href="/studio/agents/create" style={{ display: 'inline-block', padding: '10px 24px', background: '#CCFF00', color: 'black', fontWeight: 700, borderRadius: 12, textDecoration: 'none', fontSize: 14 }}>Create Agent</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 700, margin: '0 auto' }}>
                  {filtered.map(agent => (
                    <div key={agent.id} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontSize: 32 }}>{agent.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{agent.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                          <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4 }}>{agent.trigger}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{agent.runs} runs</span>
                          <span style={{
                            fontSize: 10, padding: '2px 8px', borderRadius: 4,
                            background: agent.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                            color: agent.status === 'active' ? '#10B981' : '#F59E0B',
                          }}>{agent.status}</span>
                        </div>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Last run: {agent.lastRun}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => runNow(agent.name)} style={{ padding: '8px 16px', background: '#CCFF00', color: 'black', fontSize: 12, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={12} /> Run Now</button>
                        <button onClick={() => toast.success('Opening agent editor...')} style={{ padding: '8px 12px', background: 'var(--bg-input)', color: 'var(--text-secondary)', fontSize: 12, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Edit size={12} /> Edit</button>
                        <button onClick={() => toast.success('Viewing logs...')} style={{ padding: '8px 12px', background: 'var(--bg-input)', color: 'var(--text-secondary)', fontSize: 12, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={12} /> Logs</button>
                        <button onClick={() => toggleStatus(agent.id)} style={{ padding: '8px', background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}>{agent.status === 'active' ? <span style={{ fontSize: 10 }}>Pause</span> : <span style={{ fontSize: 10 }}>Start</span>}</button>
                        <button onClick={() => deleteAgent(agent.id)} style={{ padding: '8px', background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
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
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Search agents..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <Link href="/studio/agents/create" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#CCFF00', color: 'black', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                <Plus size={16} /> Create Agent
              </Link>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
