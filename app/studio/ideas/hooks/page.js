'use client';

import { useState } from 'react';
import { Zap, Copy, Check } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter'];
const HOOK_TYPES = ['Question Hook', 'Bold Statement', 'Problem-Agitate', 'Shocking Stat', 'Story Hook', 'Teaser Hook', 'Contrast Hook', 'Number Hook'];
const TONES = ['Casual', 'Bold', 'Provocative', 'Curious', 'Inspirational', 'Humorous'];
const NUM_OPTIONS = ['5', '10', '15', '20'];

export default function HooksPage() {
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [selectedHooks, setSelectedHooks] = useState(['Question Hook']);
  const [tone, setTone] = useState('Casual');
  const [count, setCount] = useState('20');
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const generateHooks = () => {
    setLoading(true);
    setTimeout(() => {
      const sampleHooks = [
        { id: 1, text: 'What if everything you learned about productivity was wrong?', type: 'Question Hook', rating: 4.8 },
        { id: 2, text: 'This one change made me $10K more per month', type: 'Bold Statement', rating: 4.6 },
        { id: 3, text: 'Most people quit here — don\'t be most people', type: 'Problem-Agitate', rating: 4.7 },
        { id: 4, text: '97% of creators don\'t do this and it costs them everything', type: 'Shocking Stat', rating: 4.5 },
        { id: 5, text: 'I tried every method for 90 days — here\'s what actually worked', type: 'Story Hook', rating: 4.9 },
        { id: 6, text: 'You won\'t believe what happened when I tried this one thing', type: 'Teaser Hook', rating: 4.4 },
        { id: 7, text: 'The difference between rich and broke is one decision', type: 'Contrast Hook', rating: 4.6 },
        { id: 8, text: '5 words that changed how I think about money', type: 'Number Hook', rating: 4.7 },
        { id: 9, text: 'Stop scrolling. This changed my life in 30 days.', type: 'Teaser Hook', rating: 4.5 },
        { id: 10, text: 'Why everyone is talking about this one habit', type: 'Question Hook', rating: 4.3 },
      ];
      setHooks(sampleHooks.slice(0, parseInt(count)));
      setLoading(false);
      toast.success(`${count} hooks generated!`);
    }, 2500);
  };

  const toggleHook = (type) => {
    setSelectedHooks(prev => prev.includes(type) ? prev.filter(h => h !== type) : [...prev, type]);
  };

  const copyHook = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const useInScript = (text) => toast.success('Hook added to script generator');

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Zap} title="HOOK GENERATOR" subtitle="Generate 20 proven viral opening hooks for any niche or product" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Niche or Product</SectionLabel>
                <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. Fitness, Tech reviews, Finance" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
              </div>
              <div>
                <SectionLabel>Target Audience</SectionLabel>
                <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Gen Z, entrepreneurs, moms" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
              </div>
            </div>
            <div>
              <SectionLabel>Platform</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => setPlatform(p)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${platform === p ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Hook Types (multi-select)</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                {HOOK_TYPES.map(h => (
                  <button key={h} onClick={() => toggleHook(h)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedHooks.includes(h) ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{h}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Tone</SectionLabel>
                <div className="flex gap-2 flex-wrap">
                  {TONES.map(t => (
                    <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tone === t ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Number of Hooks</SectionLabel>
                <div className="flex gap-2">
                  {NUM_OPTIONS.map(n => (
                    <button key={n} onClick={() => setCount(n)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${count === n ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={generateHooks} loading={loading}>Generate Hooks</GenerateButton>
        </div>

        {hooks.length > 0 && (
          <div className="space-y-3">
            {hooks.map(hook => (
              <div key={hook.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4 flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-1">"{hook.text}"</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{hook.type}</span>
                    <span className="text-[10px] text-[#555]">Rating: {hook.rating}/5</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => copyHook(hook.id, hook.text)} className="p-2 rounded-lg bg-[#1a1a1a] text-[#888] hover:text-white transition-all">{copiedId === hook.id ? <Check size={14} /> : <Copy size={14} />}</button>
                  <button onClick={() => useInScript(hook.text)} className="px-3 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] transition-all">Use</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}