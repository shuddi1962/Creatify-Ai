'use client';

import { useState } from 'react';
import { Bot, ChevronRight, ChevronLeft, Check, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const STEPS = ['Name & Purpose', 'Trigger', 'Actions', 'Output', 'Review'];
const TRIGGERS = ['Manual', 'Webhook', 'Schedule', 'Event'];
const ACTIONS = ['Generate Image', 'Generate Video', 'Generate Script', 'Create Caption', 'Analyze Content', 'Schedule Post', 'Send Email', 'Update DB'];
const OUTPUTS = ['Media Library', 'Email', 'Webhook', 'Slack', 'Discord'];
const EMOJIS = ['🤖', '🎨', '📹', '✨', '🚀', '⚡', '🎯', '💡'];

export default function CreateAgentPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [emoji, setEmoji] = useState('🤖');
  const [triggers, setTriggers] = useState(['Manual']);
  const [actions, setActions] = useState([]);
  const [outputs, setOutputs] = useState(['Media Library']);
  const [loading, setLoading] = useState(false);

  const toggleTrigger = (t) => setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleAction = (a) => setActions(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const toggleOutput = (o) => setOutputs(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);

  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const createAgent = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Agent created!'); }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Bot} title="CREATE AN AI AGENT" subtitle="Build a custom AI agent for automated content generation" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button onClick={() => setStep(i)} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= i ? 'bg-[#CCFF00] text-black' : 'bg-[#1a1a1a] text-[#444]'}`}>{i + 1}</button>
              <span className={`text-xs font-semibold hidden sm:inline ${step >= i ? 'text-white' : 'text-[#444]'}`}>{s}</span>
              {i < 4 && <div className={`w-8 h-px ${step > i ? 'bg-[#333]' : 'bg-[#1a1a1a]'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
          {step === 0 && (
            <div className="space-y-5">
              <h3 className="text-white font-bold text-lg">Step 1: Name & Purpose</h3>
              <div>
                <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Agent Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Daily Content Generator" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What does this agent do?" className="w-full h-20 bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Icon</label>
                <div className="flex gap-3">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setEmoji(e)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${emoji === e ? 'bg-[#7C3AED] ring-2 ring-[#7C3AED]' : 'bg-[#1a1a1a] hover:bg-[#222]'}`}>{e}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-white font-bold text-lg">Step 2: Trigger</h3>
              <p className="text-[#555] text-sm">How should this agent be triggered?</p>
              <div className="grid grid-cols-2 gap-3">
                {TRIGGERS.map(t => (
                  <button key={t} onClick={() => toggleTrigger(t)} className={`p-4 rounded-xl border transition-all text-left ${triggers.includes(t) ? 'border-[#CCFF00] bg-[#CCFF00]/10' : 'border-white/[0.08] bg-[#0a0a0a]'}`}>
                    <p className="text-white font-semibold text-sm">{t}</p>
                    <p className="text-[#555] text-xs mt-1">{t === 'Manual' ? 'Run on demand' : t === 'Webhook' ? 'HTTP trigger' : t === 'Schedule' ? 'Cron-based' : 'Event-based'}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-white font-bold text-lg">Step 3: Actions</h3>
              <p className="text-[#555] text-sm">What should this agent do? (drag to reorder)</p>
              <div className="grid grid-cols-2 gap-3">
                {ACTIONS.map(a => (
                  <button key={a} onClick={() => toggleAction(a)} className={`p-3 rounded-xl border transition-all text-left ${actions.includes(a) ? 'border-[#CCFF00] bg-[#CCFF00]/10' : 'border-white/[0.08] bg-[#0a0a0a]'}`}>
                    <span className="text-white font-semibold text-sm">{a}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-white font-bold text-lg">Step 4: Output Destination</h3>
              <p className="text-[#555] text-sm">Where should results be sent?</p>
              <div className="grid grid-cols-2 gap-3">
                {OUTPUTS.map(o => (
                  <button key={o} onClick={() => toggleOutput(o)} className={`p-3 rounded-xl border transition-all text-left ${outputs.includes(o) ? 'border-[#CCFF00] bg-[#CCFF00]/10' : 'border-white/[0.08] bg-[#0a0a0a]'}`}>
                    <span className="text-white font-semibold text-sm">{o}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-white font-bold text-lg">Step 5: Review & Create</h3>
              <div className="bg-[#0a0a0a] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div><p className="text-white font-bold">{name || 'Agent Name'}</p><p className="text-[#555] text-xs">{desc || 'No description'}</p></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {triggers.map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">Trigger: {t}</span>)}
                  {actions.map(a => <span key={a} className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">Action: {a}</span>)}
                  {outputs.map(o => <span key={o} className="text-[10px] px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] rounded">Output: {o}</span>)}
                </div>
              </div>
              <button onClick={createAgent} disabled={loading} className="w-full px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Zap size={16} />}
                Create Agent
              </button>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button onClick={back} disabled={step === 0} className="px-4 py-2.5 bg-[#1a1a1a] text-[#888] rounded-xl hover:text-white disabled:opacity-30 flex items-center gap-2"><ChevronLeft size={16} /> Back</button>
            {step < 4 && <button onClick={next} className="px-6 py-2.5 bg-[#7C3AED] text-white font-semibold rounded-xl hover:bg-[#6D28D9] flex items-center gap-2">Next <ChevronRight size={16} /></button>}
          </div>
        </div>
      </div>
    </div>
  );
}