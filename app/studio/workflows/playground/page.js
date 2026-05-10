'use client';

import { useState } from 'react';
import { FlaskConical, Play, ChevronDown } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const MY_WORKFLOWS = [
  { id: 1, name: 'Image to Cinematic Video', inputs: [{ name: 'prompt', type: 'text' }, { name: 'model', type: 'select' }] },
  { id: 2, name: 'Product Showcase Pipeline', inputs: [{ name: 'product_url', type: 'text' }, { name: 'style', type: 'select' }, { name: 'count', type: 'number' }] },
];

export default function PlaygroundPage() {
  const [workflowId, setWorkflowId] = useState(MY_WORKFLOWS[0].id);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const workflow = MY_WORKFLOWS.find(w => w.id === workflowId);

  const runWorkflow = () => {
    setLoading(true);
    setTimeout(() => {
      setResults({ status: 'success', output: 'Workflow completed! Output saved to Media Library.' });
      setLoading(false);
      toast.success('Workflow completed!');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={FlaskConical} title="WORKFLOW PLAYGROUND" subtitle="Run any workflow interactively with a live form UI" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Select Workflow</label>
            <select value={workflowId} onChange={e => setWorkflowId(parseInt(e.target.value))} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED]">
              {MY_WORKFLOWS.map(w => <option key={w.id}>{w.name}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6 mb-6">
          <h3 className="text-white font-bold mb-4">Workflow Inputs</h3>
          <div className="space-y-4">
            {workflow?.inputs.map(input => (
              <div key={input.name}>
                <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">{input.name}</label>
                {input.type === 'text' && (
                  <input value={values[input.name] || ''} onChange={e => setValues({ ...values, [input.name]: e.target.value })} placeholder={`Enter ${input.name}...`} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
                )}
                {input.type === 'select' && (
                  <select value={values[input.name] || ''} onChange={e => setValues({ ...values, [input.name]: e.target.value })} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none">
                    <option value="">Select...</option>
                    <option>Option 1</option><option>Option 2</option>
                  </select>
                )}
                {input.type === 'number' && (
                  <input type="number" value={values[input.name] || ''} onChange={e => setValues({ ...values, [input.name]: e.target.value })} placeholder="Enter number..." className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
                )}
              </div>
            ))}
          </div>
          <button onClick={runWorkflow} disabled={loading} className="mt-6 w-full px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Play size={16} />}
            Run Workflow
          </button>
        </div>

        {results && (
          <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
            <h3 className="text-white font-bold mb-4">Results</h3>
            <div className="bg-[#0a0a0a] rounded-xl p-4">
              <p className="text-[#10B981] text-sm font-mono">{results.output}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}