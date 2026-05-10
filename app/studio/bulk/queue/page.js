'use client';

import { useState } from 'react';
import { Clock, Eye, Download, RotateCcw, X, Trash2, Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';

const SAMPLE_JOBS = [
  { id: 'job_001', type: 'bulk-image', items: 50, completed: 50, failed: 0, status: 'completed', started: '2 hours ago', duration: '12m 34s', credits: 500, zip_url: '#' },
  { id: 'job_002', type: 'bulk-video', items: 25, completed: 18, failed: 1, status: 'running', started: '15 min ago', duration: '3m 22s', credits: 250, zip_url: null },
  { id: 'job_003', type: 'bulk-lipsync', items: 100, completed: 0, failed: 0, status: 'queued', started: 'Just now', duration: '-', credits: 1000, zip_url: null },
  { id: 'job_004', type: 'bulk-image', items: 20, completed: 20, failed: 0, status: 'completed', started: 'Yesterday', duration: '4m 10s', credits: 200, zip_url: '#' },
  { id: 'job_005', type: 'bulk-voiceover', items: 75, completed: 74, failed: 1, status: 'completed', started: '2 days ago', duration: '8m 45s', credits: 150, zip_url: '#' },
  { id: 'job_006', type: 'bulk-video', items: 10, completed: 0, failed: 0, status: 'failed', started: '1 hour ago', duration: 'Failed', credits: 100, zip_url: null, error: 'API timeout' },
];

const STATUS_COLORS = {
  completed: 'bg-green-500/20 text-green-400',
  running: 'bg-[#CCFF00]/20 text-[#CCFF00]',
  queued: 'bg-[#7C3AED]/20 text-[#7C3AED]',
  failed: 'bg-red-500/20 text-red-400',
};

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
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Clock} title="JOB QUEUE" subtitle="Live progress tracker for all your running and completed batch jobs" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#111111] rounded-xl border border-white/[0.08] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-[#CCFF00]" />
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Running</span>
            </div>
            <p className="text-2xl font-bold text-white">{running}</p>
          </div>
          <div className="bg-[#111111] rounded-xl border border-white/[0.08] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-[#7C3AED]" />
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Queued</span>
            </div>
            <p className="text-2xl font-bold text-white">{queued}</p>
          </div>
          <div className="bg-[#111111] rounded-xl border border-white/[0.08] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-green-400" />
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Completed Today</span>
            </div>
            <p className="text-2xl font-bold text-white">{completedToday}</p>
          </div>
          <div className="bg-[#111111] rounded-xl border border-white/[0.08] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-[#06B6D4]" />
              <span className="text-[10px] text-[#555] uppercase tracking-widest">Credits Used</span>
            </div>
            <p className="text-2xl font-bold text-white">{creditsUsed}</p>
          </div>
        </div>
        <GenerationPanel>
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['all', 'running', 'queued', 'completed', 'failed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filter === f ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredJobs.map(job => (
                <div key={job.id} className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#555]">{job.id}</span>
                        <span className="text-xs text-[#888] capitalize">{job.type.replace('bulk-', '')}</span>
                        {job.status === 'running' && <Loader2 size={12} className="animate-spin text-[#CCFF00]" />}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm capitalize ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                        <span className="text-[10px] text-[#555]">{job.items} items</span>
                        {job.status === 'completed' && <span className="text-[10px] text-green-400">{job.items - job.failed} done</span>}
                        {job.failed > 0 && <span className="text-[10px] text-red-400">{job.failed} failed</span>}
                      </div>
                      {job.status === 'running' && (
                        <div className="w-48 h-1.5 bg-[#1a1a1a] rounded-full mt-2">
                          <div className="h-full bg-[#CCFF00] rounded-full" style={{ width: `${(job.completed / job.items) * 100}%` }} />
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-[#555]">{job.started}</p>
                      <p className="text-[10px] text-[#888] mt-0.5">{job.duration}</p>
                      <p className="text-[10px] text-[#06B6D4] mt-0.5">{job.credits} credits</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setSelectedJob(job)} className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white transition-all"><Eye size={14} /></button>
                      {job.zip_url && <button onClick={() => handleDownload(job)} className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white transition-all"><Download size={14} /></button>}
                      {job.status === 'failed' && <button onClick={() => handleRetry(job.id)} className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white transition-all"><RotateCcw size={14} /></button>}
                      {job.status === 'queued' && <button onClick={() => handleCancel(job.id)} className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white transition-all"><X size={14} /></button>}
                      <button onClick={() => handleDelete(job.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-[#888] hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Clock size={32} className="mx-auto text-[#333] mb-3" />
                  <p className="text-sm text-[#555]">No jobs in this category</p>
                </div>
              )}
            </div>
          </div>
        </GenerationPanel>
      </div>
    </div>
  );
}