'use client';

import { useState } from 'react';
import { GitBranch, Play, Save, FolderOpen, Plus, Share2, GripVertical } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const STEPS = [
  { id: 1, name: 'Text Input', type: 'Input', desc: 'Enter your prompt' },
  { id: 2, name: 'Flux Model', type: 'Generate Image', desc: 'Generate image' },
  { id: 3, name: 'Upscale', type: 'Transform', desc: 'Enhance quality' },
  { id: 4, name: 'Save', type: 'Output', desc: 'Export result' },
];

export default function BuilderPage() {
  const [steps, setSteps] = useState(STEPS);
  const [loading, setLoading] = useState(false);

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), name: 'New Step', type: 'Transform', desc: 'Configure step' }]);
  };

  const removeStep = (id) => {
    if (steps.length > 1) setSteps(steps.filter(s => s.id !== id));
  };

  const handleRun = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Workflow executed!'); }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={GitBranch} title="WORKFLOW BUILDER" subtitle="Grid-based structured node editor for workflow creation" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex gap-2">
            <button onClick={() => { setSteps(STEPS); toast.success('Reset'); }} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm rounded-lg hover:text-white flex items-center gap-2 transition-all"><Plus size={14} /> New</button>
            <button onClick={() => toast.success('Loading workflow...')} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm rounded-lg hover:text-white flex items-center gap-2 transition-all"><FolderOpen size={14} /> Load</button>
            <button onClick={() => toast.success('Workflow saved!')} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm rounded-lg hover:text-white flex items-center gap-2 transition-all"><Save size={14} /> Save</button>
          </div>
          <button onClick={handleRun} disabled={loading} className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 flex items-center gap-2 transition-all">
            {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Play size={14} />}
            Run Workflow
          </button>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-4 bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-4">
                <div className="cursor-grab text-[#444]"><GripVertical size={16} /></div>
                <div className="w-6 h-6 bg-[#7C3AED] text-white text-xs font-bold rounded-full flex items-center justify-center">{idx + 1}</div>
                <div className="flex-1">
                  <input defaultValue={step.name} className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none" />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{step.type}</span>
                    <span className="text-[10px] text-[#444]">{step.desc}</span>
                  </div>
                </div>
                {steps.length > 1 && (
                  <button onClick={() => removeStep(step.id)} className="p-2 text-[#444] hover:text-red-500 transition-all">×</button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addStep} className="w-full mt-3 px-4 py-3 border-2 border-dashed border-white/[0.08] rounded-xl text-[#444] text-sm hover:text-[#CCFF00] hover:border-[#CCFF00]/50 transition-all flex items-center justify-center gap-2"><Plus size={14} /> Add Step</button>
        </div>
      </div>
    </div>
  );
}