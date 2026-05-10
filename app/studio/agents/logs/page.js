'use client';

import { useState } from 'react';
import { FileText, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

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

export default function LogsPage() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All');

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={FileText} title="AGENT LOGS" subtitle="View complete run history, errors, and outputs for all your agents" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex gap-2 mb-6">
          {['All', 'Success', 'Error'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{f}</button>
          ))}
        </div>

        <div className="space-y-3 pb-8">
          {LOGS.filter(l => filter === 'All' || l.status === filter.toLowerCase()).map(log => (
            <div key={log.id} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden">
              <div onClick={() => toggleExpand(log.id)} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#1a1a1a] transition-all">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${log.status === 'success' ? 'bg-[#10B981]/20' : 'bg-red-500/20'}`}>
                  {log.status === 'success' ? <CheckCircle size={16} className="text-[#10B981]" /> : <XCircle size={16} className="text-red-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{log.agent}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{log.trigger}</span>
                    <span className="text-[10px] text-[#555]">{log.id}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-[#555]">{log.start}</span>
                    <span className="text-[10px] text-[#555]">{log.duration}</span>
                  </div>
                </div>
                <ChevronDown size={16} className={`text-[#444] transition-transform ${expanded === log.id ? 'rotate-180' : ''}`} />
              </div>

              {expanded === log.id && (
                <div className="border-t border-white/[0.08] p-4 bg-[#0a0a0a]">
                  <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest mb-3">Steps</p>
                  <div className="space-y-2">
                    {log.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 bg-[#111111] rounded-lg p-3">
                        {step.status === 'success' ? <CheckCircle size={14} className="text-[#10B981]" /> : <XCircle size={14} className="text-red-500" />}
                        <div className="flex-1">
                          <p className="text-white text-xs font-semibold">{step.name}</p>
                          <p className="text-[#555] text-[10px]">{step.output}</p>
                        </div>
                        <span className="text-[10px] text-[#444] font-mono">{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}