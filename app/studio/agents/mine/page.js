'use client';

import { useState } from 'react';
import { Bot, Play, Edit, FileText, Trash2, Plus, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import Link from 'next/link';

const SAMPLE_AGENTS = [
  { id: 1, name: 'Daily Content Bot', emoji: '🤖', trigger: 'Schedule', lastRun: '2 hours ago', status: 'active', runs: 45 },
  { id: 2, name: 'Hook Generator', emoji: '🎯', trigger: 'Manual', lastRun: '1 day ago', status: 'active', runs: 23 },
  { id: 3, name: 'Product Showcase', emoji: '🎨', trigger: 'Webhook', lastRun: '3 days ago', status: 'paused', runs: 12 },
];

export default function MyAgentsPage() {
  const [agents, setAgents] = useState(SAMPLE_AGENTS);

  const toggleStatus = (id) => {
    setAgents(agents.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));
    toast.success('Status updated');
  };

  const deleteAgent = (id) => {
    setAgents(agents.filter(a => a.id !== id));
    toast.success('Agent deleted');
  };

  const runNow = (name) => toast.success(`Running ${name}...`);

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Bot} title="MY AGENTS" subtitle="View and manage all your active and saved AI agents" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex justify-end mb-6">
          <Link href="/studio/agents/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">
            <Plus size={16} /> Create Agent
          </Link>
        </div>

        {agents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4"><Bot size={32} className="text-[#444]" /></div>
            <h3 className="text-white font-semibold mb-2">No agents yet</h3>
            <p className="text-[#666] text-sm mb-6">Create an AI agent to automate your content workflow</p>
            <Link href="/studio/agents/create" className="inline-block px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl">Create Agent</Link>
          </div>
        ) : (
          <div className="space-y-3 pb-8">
            {agents.map(agent => (
              <div key={agent.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-5 flex items-center gap-4">
                <span className="text-3xl">{agent.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-white font-bold">{agent.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{agent.trigger}</span>
                    <span className="text-[10px] text-[#555]">{agent.runs} runs</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${agent.status === 'active' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>{agent.status}</span>
                  </div>
                  <p className="text-[10px] text-[#444] mt-1">Last run: {agent.lastRun}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => runNow(agent.name)} className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] flex items-center gap-1"><Zap size={12} /> Run Now</button>
                  <button onClick={() => toast.success('Opening agent editor...')} className="px-3 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white transition-all flex items-center gap-1"><Edit size={12} /> Edit</button>
                  <button onClick={() => toast.success('Viewing logs...')} className="px-3 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white transition-all flex items-center gap-1"><FileText size={12} /> Logs</button>
                  <button onClick={() => toggleStatus(agent.id)} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all">{agent.status === 'active' ? <span className="text-[10px]">Pause</span> : <span className="text-[10px]">Start</span>}</button>
                  <button onClick={() => deleteAgent(agent.id)} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}