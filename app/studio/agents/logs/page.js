'use client';

import { useState } from 'react';
import { FileText, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const LOGS = [
  { id: 'LOG-001', agent: 'Daily Content Bot', triggered: 'Schedule', start: 'May 10, 9:00 AM', duration: '4.2s', status: 'success', steps: [
    { name: 'Generate Hooks', status: 'success', output: '10 hooks generated', time: '0.3s' },
    { name: 'Select Best Hook', status: 'success', output: 'Hook #3 selected', time: '0.1s' },
    { name: 'Generate Script', status: 'success', output: '60s script ready', time: '1.8s' },
    { name: 'Generate Video', status: 'success', output: 'Video saved to library', time: '2.0s' },
  ]},
  { id: 'LOG-002', agent: 'UGC Ad Pipeline', triggered: 'Webhook', start: 'May 10, 8:45 AM', duration: '12.3s', status: 'success', steps: [
    { name: 'Fetch Product', status: 'success', output: 'Product data loaded', time: '0.5s' },
    { name: 'Generate Script', status: 'success', output: 'Script created', time: '5.2s' },
    { name: 'Generate Video', status: 'success', output: 'Video complete', time: '6.4s' },
    { name: 'Generate Caption', status: 'success', output: 'Caption with hashtags', time: '0.2s' },
  ]},
  { id: 'LOG-003', agent: 'Bulk Image Variants', triggered: 'Manual', start: 'May 9, 3:20 PM', duration: '89.5s', status: 'error', steps: [
    { name: 'Load Prompt', status: 'success', output: 'Prompt parsed', time: '0.1s' },
    { name: 'Generate Images', status: 'error', output: 'API timeout', time: '89.3s' },
  ]},
];
const OPTIONS = ['All', 'Success', 'Error'];

export default function LogsPage() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All');
  const [prompt, setPrompt] = useState('');

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  const filtered = LOGS.filter(l => filter === 'All' || l.status === filter.toLowerCase());

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="FILTER">
            {OPTIONS.map(p => (
              <button key={p} onClick={() => setFilter(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: filter === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: filter === p ? 'var(--accent-text)' : 'var(--text-secondary)',
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
                AGENT LOGS
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 700, margin: '0 auto' }}>
                {filtered.map(log => (
                  <div key={log.id} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                    <div onClick={() => toggleExpand(log.id)} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: log.status === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                      }}>
                        {log.status === 'success' ? <CheckCircle size={16} color="#10B981" /> : <XCircle size={16} color="red" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{log.agent}</span>
                          <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4 }}>{log.triggered}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{log.id}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{log.start}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{log.duration}</span>
                        </div>
                      </div>
                      <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: expanded === log.id ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
                    </div>

                    {expanded === log.id && (
                      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 16, background: '#0a0a0a' }}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Steps</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {log.steps.map((step, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', borderRadius: 8, padding: 12 }}>
                              {step.status === 'success' ? <CheckCircle size={14} color="#10B981" /> : <XCircle size={14} color="red" />}
                              <div style={{ flex: 1 }}>
                                <p style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{step.name}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: 10 }}>{step.output}</p>
                              </div>
                              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{step.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Logs">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Search logs..." />
          </DirectorBar>
        }
      />
    </>
  );
}
