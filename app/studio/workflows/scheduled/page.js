'use client';

import { useState } from 'react';
import { Calendar, Play, Pause, Edit, Trash2, Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const SCHEDULED_RUNS = [
  { id: 1, workflow: 'Image to Cinematic Video', schedule: '0 9 * * *', lastRun: '2 hours ago', nextRun: 'Tomorrow 9:00 AM', status: 'active' },
  { id: 2, workflow: 'Product Showcase Pipeline', schedule: '0 */4 * * *', lastRun: '4 hours ago', nextRun: 'In 4 hours', status: 'active' },
  { id: 3, workflow: 'UGC Ad Generator', schedule: '0 18 * * 1,3,5', lastRun: '1 day ago', nextRun: 'Monday 6:00 PM', status: 'paused' },
];
const OPTIONS = ['All', 'Active', 'Paused'];

export default function ScheduledPage() {
  const [runs, setRuns] = useState(SCHEDULED_RUNS);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [prompt, setPrompt] = useState('');

  const toggleStatus = (id) => {
    setRuns(runs.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r));
    toast.success('Status updated');
  };

  const deleteRun = (id) => {
    setRuns(runs.filter(r => r.id !== id));
    toast.success('Scheduled run deleted');
  };

  const createScheduled = (workflow, schedule) => {
    setRuns([...runs, { id: Date.now(), workflow, schedule, lastRun: 'Never', nextRun: 'Soon', status: 'active' }]);
    setShowModal(false);
    toast.success('Scheduled run created!');
  };

  const filtered = filter === 'All' ? runs : runs.filter(r => r.status === filter.toLowerCase());

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="FILTERS">
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
                background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                SCHEDULED RUNS
              </h1>
              <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden', maxWidth: 900, margin: '0 auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ textAlign: 'left', padding: 16, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Workflow</th>
                      <th style={{ textAlign: 'left', padding: 16, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Schedule</th>
                      <th style={{ textAlign: 'left', padding: 16, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Last Run</th>
                      <th style={{ textAlign: 'left', padding: 16, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Next Run</th>
                      <th style={{ textAlign: 'left', padding: 16, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: 16, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(run => (
                      <tr key={run.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: 16, color: 'var(--text-primary)', fontSize: 14, fontWeight: 500 }}>{run.workflow}</td>
                        <td style={{ padding: 16, color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'monospace' }}>{run.schedule}</td>
                        <td style={{ padding: 16, color: 'var(--text-muted)', fontSize: 12 }}>{run.lastRun}</td>
                        <td style={{ padding: 16, color: 'var(--text-muted)', fontSize: 12 }}>{run.nextRun}</td>
                        <td style={{ padding: 16 }}>
                          <span style={{
                            fontSize: 10, padding: '2px 8px', borderRadius: 4,
                            background: run.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                            color: run.status === 'active' ? '#10B981' : '#F59E0B',
                          }}>{run.status}</span>
                        </td>
                        <td style={{ padding: 16 }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => toggleStatus(run.id)} style={{ padding: 6, background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}>{run.status === 'active' ? <Pause size={14} /> : <Play size={14} />}</button>
                            <button onClick={() => toast.success('Opening editor...')} style={{ padding: 6, background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}><Edit size={14} /></button>
                            <button onClick={() => deleteRun(run.id)} style={{ padding: 6, background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setShowModal(false)}>
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24, width: '100%', maxWidth: 440 }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>New Scheduled Run</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Workflow</label>
                        <select style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }}>
                          <option>Image to Cinematic Video</option>
                          <option>Product Showcase Pipeline</option>
                          <option>UGC Ad Generator</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Cron Schedule</label>
                        <input defaultValue="0 9 * * *" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 14, outline: 'none' }} />
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Format: minute hour day month weekday</p>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#CCFF00' }} defaultChecked />
                        <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Send notification on completion</span>
                      </label>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                      <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-input)', color: 'var(--text-secondary)', fontWeight: 600, borderRadius: 12, border: 'none', cursor: 'pointer' }}>Cancel</button>
                      <button onClick={() => createScheduled('New Workflow', '0 9 * * *')} style={{ flex: 1, padding: '10px 16px', background: '#CCFF00', color: 'black', fontWeight: 700, borderRadius: 12, border: 'none', cursor: 'pointer' }}>Create</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Schedules">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Filter schedules..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <button onClick={() => setShowModal(true)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', background: '#CCFF00', color: 'black',
                fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                <Plus size={16} /> New Scheduled Run
              </button>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
