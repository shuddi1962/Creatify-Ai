'use client';

import { useState } from 'react';
import { Calendar, Play, Pause, Edit, Trash2, Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const SCHEDULED_RUNS = [
  { id: 1, workflow: 'Image to Cinematic Video', schedule: '0 9 * * *', lastRun: '2 hours ago', nextRun: 'Tomorrow 9:00 AM', status: 'active' },
  { id: 2, workflow: 'Product Showcase Pipeline', schedule: '0 */4 * * *', lastRun: '4 hours ago', nextRun: 'In 4 hours', status: 'active' },
  { id: 3, workflow: 'UGC Ad Generator', schedule: '0 18 * * 1,3,5', lastRun: '1 day ago', nextRun: 'Monday 6:00 PM', status: 'paused' },
];

export default function ScheduledPage() {
  const [runs, setRuns] = useState(SCHEDULED_RUNS);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Calendar} title="SCHEDULED WORKFLOW RUNS" subtitle="Set any workflow to run automatically on a schedule" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex justify-end mb-6">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">
            <Plus size={16} /> New Scheduled Run
          </button>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">Workflow</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">Schedule</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">Last Run</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">Next Run</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">Status</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {runs.map(run => (
                <tr key={run.id} className="border-b border-white/[0.04]">
                  <td className="p-4 text-white text-sm font-medium">{run.workflow}</td>
                  <td className="p-4 text-[#888] text-xs font-mono">{run.schedule}</td>
                  <td className="p-4 text-[#555] text-xs">{run.lastRun}</td>
                  <td className="p-4 text-[#555] text-xs">{run.nextRun}</td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${run.status === 'active' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>{run.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => toggleStatus(run.id)} className="p-1.5 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all">{run.status === 'active' ? <Pause size={14} /> : <Play size={14} />}</button>
                      <button onClick={() => toast.success('Opening editor...')} className="p-1.5 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><Edit size={14} /></button>
                      <button onClick={() => deleteRun(run.id)} className="p-1.5 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-white font-bold mb-4">New Scheduled Run</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Workflow</label>
                  <select className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none">
                    <option>Image to Cinematic Video</option>
                    <option>Product Showcase Pipeline</option>
                    <option>UGC Ad Generator</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Cron Schedule</label>
                  <input defaultValue="0 9 * * *" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none" />
                  <p className="text-[10px] text-[#555] mt-1">Format: minute hour day month weekday</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#CCFF00]" defaultChecked />
                  <span className="text-[#888] text-sm">Send notification on completion</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-[#1a1a1a] text-[#888] font-semibold rounded-xl hover:text-white">Cancel</button>
                <button onClick={() => createScheduled('New Workflow', '0 9 * * *')} className="flex-1 px-4 py-2.5 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00]">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}