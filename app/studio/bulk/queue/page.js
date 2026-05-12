'use client';

import { useState } from 'react';
import { Clock, Eye, Download, RotateCcw, X, Trash2, Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const SAMPLE_JOBS = [
  { id: 'job_001', type: 'bulk-image', items: 50, completed: 50, failed: 0, status: 'completed', started: '2 hours ago', duration: '12m 34s', credits: 500, zip_url: '#' },
  { id: 'job_002', type: 'bulk-video', items: 25, completed: 18, failed: 1, status: 'running', started: '15 min ago', duration: '3m 22s', credits: 250, zip_url: null },
  { id: 'job_003', type: 'bulk-lipsync', items: 100, completed: 0, failed: 0, status: 'queued', started: 'Just now', duration: '-', credits: 1000, zip_url: null },
  { id: 'job_004', type: 'bulk-image', items: 20, completed: 20, failed: 0, status: 'completed', started: 'Yesterday', duration: '4m 10s', credits: 200, zip_url: '#' },
  { id: 'job_005', type: 'bulk-voiceover', items: 75, completed: 74, failed: 1, status: 'completed', started: '2 days ago', duration: '8m 45s', credits: 150, zip_url: '#' },
  { id: 'job_006', type: 'bulk-video', items: 10, completed: 0, failed: 0, status: 'failed', started: '1 hour ago', duration: 'Failed', credits: 100, zip_url: null, error: 'API timeout' },
];

const STATUS_COLORS = {
  completed: { bg: 'rgba(74,222,128,0.2)', color: '#4ade80' },
  running: { bg: 'rgba(204,255,0,0.2)', color: '#CCFF00' },
  queued: { bg: 'rgba(124,58,237,0.2)', color: '#7C3AED' },
  failed: { bg: 'rgba(248,113,113,0.2)', color: '#f87171' },
};

const STATUS_FILTERS = ['all', 'running', 'queued', 'completed', 'failed'];

export default function BulkQueuePage() {
  const [filter, setFilter] = useState('all');
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = jobs.filter(j => filter === 'all' || j.status === filter);

  const running = jobs.filter(j => j.status === 'running').length;
  const queued = jobs.filter(j => j.status === 'queued').length;
  const completedToday = jobs.filter(j => j.status === 'completed').length;
  const creditsUsed = jobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + j.credits, 0);

  const handleRetry = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'queued', failed: 0 } : j));
    toast.success('Job re-queued');
  };

  const handleCancel = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'cancelled' } : j));
    toast.success('Job cancelled');
  };

  const handleDelete = (jobId) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    toast.success('Job deleted');
  };

  const handleDownload = (job) => {
    if (job.zip_url) toast.success('Downloading ZIP...');
    else toast.error('No ZIP available yet');
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="FILTERS">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: filter === f ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: filter === f ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', textTransform: 'capitalize',
              }}
            >{f}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            JOB QUEUE
          </h1>
          <div style={{ zIndex: 1, marginTop: 16, width: '100%', maxWidth: 600, padding: '0 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 12, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Zap size={14} color="#CCFF00" />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Running</span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{running}</p>
              </div>
              <div style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 12, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Clock size={14} color="#7C3AED" />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Queued</span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{queued}</p>
              </div>
              <div style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 12, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <CheckCircle size={14} color="#4ade80" />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Completed</span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{completedToday}</p>
              </div>
              <div style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 12, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Zap size={14} color="#7C3AED" />
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Credits</span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{creditsUsed}</p>
              </div>
            </div>
            <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {filteredJobs.map(job => {
                const sc = STATUS_COLORS[job.status] || { bg: 'var(--bg-input)', color: 'var(--text-muted)' };
                return (
                  <div key={job.id} style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 12, marginBottom: 6, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{job.id}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{job.type.replace('bulk-', '')}</span>
                          {job.status === 'running' && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite', color: '#CCFF00' }} />}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: sc.bg, color: sc.color, textTransform: 'capitalize' }}>{job.status}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{job.items} items</span>
                          {job.failed > 0 && <span style={{ fontSize: 10, color: '#f87171' }}>{job.failed} failed</span>}
                        </div>
                        {job.status === 'running' && (
                          <div style={{ width: 160, height: 6, background: 'var(--bg-input)', borderRadius: 100, marginTop: 8 }}>
                            <div style={{ height: '100%', background: '#CCFF00', borderRadius: 100, width: `${(job.completed / job.items) * 100}%` }} />
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{job.started}</p>
                        <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{job.duration}</p>
                        <p style={{ fontSize: 10, color: '#7C3AED', marginTop: 2 }}>{job.credits} credits</p>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => setSelectedJob(job)} style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 6 }}><Eye size={14} /></button>
                        {job.zip_url && <button onClick={() => handleDownload(job)} style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 6 }}><Download size={14} /></button>}
                        {job.status === 'failed' && <button onClick={() => handleRetry(job.id)} style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 6 }}><RotateCcw size={14} /></button>}
                        {job.status === 'queued' && <button onClick={() => handleCancel(job.id)} style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 6 }}><X size={14} /></button>}
                        <button onClick={() => handleDelete(job.id)} style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 6 }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredJobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Clock size={32} style={{ color: '#333', marginBottom: 12 }} />
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No jobs in this category</p>
                </div>
              )}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Job Queue Overview">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{jobs.length} total jobs</span>
          </div>
        </DirectorBar>
      }
    />
  );
}
