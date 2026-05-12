'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const STATUSES = ['queued', 'processing', 'completed', 'failed'];
const TYPES = ['Text-to-Image', 'Text-to-Video', 'Image-to-Video', 'Lip Sync'];

const JOBS = [
  { id: '#JOB-001', type: 'Text-to-Image', model: 'Flux Pro', status: 'completed', created: '2026-05-12 09:23' },
  { id: '#JOB-002', type: 'Text-to-Video', model: 'Kling 3', status: 'processing', created: '2026-05-12 10:15' },
  { id: '#JOB-003', type: 'Image-to-Video', model: 'Runway Gen-3', status: 'queued', created: '2026-05-12 10:45' },
  { id: '#JOB-004', type: 'Lip Sync', model: 'Sync Labs', status: 'failed', created: '2026-05-12 08:30' },
  { id: '#JOB-005', type: 'Text-to-Image', model: 'Midjourney v7', status: 'completed', created: '2026-05-11 14:00' },
  { id: '#JOB-006', type: 'Text-to-Video', model: 'Seedance 2', status: 'failed', created: '2026-05-11 11:20' },
];

const STATUS_COLORS = {
  queued: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400',
};

export default function AdminJobs() {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = JOBS.filter(j => {
    return (!statusFilter || j.status === statusFilter) && (!typeFilter || j.type === typeFilter);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Jobs</h2>
          <p className="text-sm text-[#9CA3AF]">Track and manage generation jobs</p>
        </div>
      </div>

      <div className="flex gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-lg bg-[rgba(17,24,39,0.8)] border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2 rounded-lg bg-[rgba(17,24,39,0.8)] border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">ID</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Model</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(j => (
              <tr key={j.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-4 py-3 text-[#F9FAFB] font-mono">{j.id}</td>
                <td className="px-4 py-3 text-[#9CA3AF]">{j.type}</td>
                <td className="px-4 py-3 text-[#9CA3AF]">{j.model}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[j.status]}`}>{j.status}</span>
                </td>
                <td className="px-4 py-3 text-[#9CA3AF]">{j.created}</td>
                <td className="px-4 py-3 text-right">
                  {j.status === 'failed' && (
                    <button onClick={() => toast.success(`Retrying ${j.id}...`)} className="px-2 py-1 rounded text-xs bg-[#7C3AED]/20 text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-all">Retry</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
