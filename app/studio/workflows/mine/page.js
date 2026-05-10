'use client';

import { useState } from 'react';
import { GitBranch, Play, Copy, Share2, Trash2, Plus, MoreHorizontal } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import Link from 'next/link';

const SAMPLE_WORKFLOWS = [
  { id: 1, name: 'Image to Cinematic Video', nodes: 5, lastRun: '2 hours ago', status: 'active', runs: 23 },
  { id: 2, name: 'Product Showcase Pipeline', nodes: 8, lastRun: '1 day ago', status: 'active', runs: 15 },
  { id: 3, name: 'Meme Generator Chain', nodes: 3, lastRun: '3 days ago', status: 'paused', runs: 8 },
  { id: 4, name: 'Bulk Character Animation', nodes: 6, lastRun: '5 days ago', status: 'active', runs: 31 },
];

export default function MyWorkflowsPage() {
  const [workflows, setWorkflows] = useState(SAMPLE_WORKFLOWS);

  const handleDelete = (id) => { setWorkflows(workflows.filter(w => w.id !== id)); toast.success('Deleted'); };
  const handleDuplicate = (name) => { setWorkflows([...workflows, { id: Date.now(), name: `${name} (copy)`, nodes: 5, lastRun: 'Just now', status: 'active', runs: 0 }]); toast.success('Duplicated!'); };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={GitBranch} title="MY WORKFLOWS" subtitle="All your saved, pinned, and recent workflow pipelines" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex justify-end mb-6">
          <Link href="/studio/workflows/canvas" className="flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">
            <Plus size={16} /> New Workflow
          </Link>
        </div>
        {workflows.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4"><GitBranch size={32} className="text-[#444]" /></div>
            <h3 className="text-white font-semibold mb-2">No workflows yet</h3>
            <p className="text-[#666] text-sm mb-6">Create your first workflow to automate generation</p>
            <Link href="/studio/workflows/canvas" className="inline-block px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl">Create Workflow</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
            {workflows.map(wf => (
              <div key={wf.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold">{wf.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-[#555]">{wf.nodes} nodes</span>
                      <span className="text-[10px] text-[#555]">{wf.runs} runs</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${wf.status === 'active' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>{wf.status}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-[#444] mb-4">Last run: {wf.lastRun}</p>
                <div className="flex gap-2">
                  <button onClick={() => toast.success('Opening workflow...')} className="flex-1 px-3 py-2 bg-[#1a1a1a] text-[#CCFF00] text-xs font-semibold rounded-lg hover:bg-[#222] transition-all flex items-center justify-center gap-1"><Play size={12} /> Run</button>
                  <button onClick={() => toast.success('Editing workflow...')} className="flex-1 px-3 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white transition-all flex items-center justify-center gap-1"><GitBranch size={12} /> Open</button>
                  <button onClick={() => handleDuplicate(wf.name)} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><Copy size={14} /></button>
                  <button onClick={() => toast.success('Sharing workflow...')} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><Share2 size={14} /></button>
                  <button onClick={() => handleDelete(wf.id)} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}