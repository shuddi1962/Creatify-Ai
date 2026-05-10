'use client';

import { useState } from 'react';
import { Zap, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'LinkedIn', 'Twitter'];
const HOOK_TYPES = ['Question', 'Bold Statement', 'Provocative', 'Story Hook', 'Statistic', 'Contrast', 'Curiosity Gap', 'Fear', 'Hope', 'Celebrity', 'ASMR', 'Tutorial'];
const TONES = ['Serious', 'Humorous', 'Curious', 'Inspirational', 'Urgent', 'Calm', 'Energetic'];
const COUNTS = [5, 10, 20, 30];

const SAMPLE_HOOKS = [
  { id: 1, text: 'You won\'t believe what happened when I tried this one weird trick...', rating: 4.5, likes: 12 },
  { id: 2, text: 'Here\'s why everything you know about [topic] is completely wrong.', rating: 4.2, likes: 8 },
  { id: 3, text: 'The average person does this every day — and it\'s destroying their productivity.', rating: 4.8, likes: 15 },
  { id: 4, text: 'Stop scrolling. This changed everything for me.', rating: 3.9, likes: 6 },
  { id: 5, text: 'I tested this for 30 days and the results were insane.', rating: 4.6, likes: 11 },
  { id: 6, text: 'Nobody talks about this, but it\'s the key to success.', rating: 4.1, likes: 7 },
  { id: 7, text: 'What if I told you [provocative statement]?', rating: 4.3, likes: 9 },
  { id: 8, text: 'The #1 reason people fail at [topic] (and how to fix it).', rating: 4.7, likes: 14 },
];

export default function MarketingHooksPage() {
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [hookTypes, setHookTypes] = useState(['Question', 'Bold Statement', 'Curiosity Gap']);
  const [tone, setTone] = useState('Energetic');
  const [count, setCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const toggleHookType = (type) => {
    setHookTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleGenerate = async () => {
    if (!niche.trim()) {
      toast.error('Please enter a niche or product');
      return;
    }
    setLoading(true);
    toast.success('Generating viral hooks...');
    try {
      await new Promise(r => setTimeout(r, 2000));
      const generatedHooks = SAMPLE_HOOKS.slice(0, Math.min(count, SAMPLE_HOOKS.length)).map((h, i) => ({
        ...h,
        id: Date.now() + i,
        text: h.text.replace('[topic]', niche),
      }));
      setHooks(generatedHooks);
      toast.success(`${generatedHooks.length} hooks generated!`);
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (hook) => {
    navigator.clipboard.writeText(hook.text);
    setCopiedId(hook.id);
    toast.success('Copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRate = (id, up) => {
    setHooks(prev => prev.map(h => h.id === id ? { ...h, likes: up ? h.likes + 1 : Math.max(0, h.likes - 1) } : h));
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Zap} title="HOOK GENERATOR" subtitle="Generate 20 proven viral opening hooks for any niche or product" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Niche / Product</SectionLabel>
                <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g., fitness apps, pet products" className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444]" />
              </div>
              <div>
                <SectionLabel>Target Audience</SectionLabel>
                <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., busy professionals" className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-sm text-white placeholder-[#444]" />
              </div>
            </div>
            <div>
              <SectionLabel>Platform</SectionLabel>
              <PillSelector options={PLATFORMS} value={platform} onChange={setPlatform} />
            </div>
            <div>
              <SectionLabel>Hook Types</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {HOOK_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleHookType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      hookTypes.includes(type) ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Tone</SectionLabel>
                <PillSelector options={TONES} value={tone} onChange={setTone} />
              </div>
              <div>
                <SectionLabel>Number of Hooks</SectionLabel>
                <PillSelector options={COUNTS.map(String)} value={String(count)} onChange={v => setCount(parseInt(v))} />
              </div>
            </div>
            <GenerateButton onClick={handleGenerate} loading={loading}>
              Generate Hooks
            </GenerateButton>
          </div>
        </GenerationPanel>
        {hooks.length > 0 && (
          <GenerationPanel>
            <div className="space-y-3">
              {hooks.map((hook, i) => (
                <div key={hook.id} className="bg-[#0a0a0a] rounded-xl p-4 border border-white/[0.08]">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[10px] font-bold text-[#555]">{i + 1}</span>
                    <p className="flex-1 text-sm text-white">{hook.text}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 ml-9">
                    <button onClick={() => handleCopy(hook)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1a1a1a] text-[10px] text-[#888] hover:text-white transition-all">
                      {copiedId === hook.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      Copy
                    </button>
                    <button className="px-2 py-1 rounded-lg bg-[#1a1a1a] text-[10px] text-[#888] hover:text-white transition-all">
                      Use in Script
                    </button>
                    <div className="flex items-center gap-1 ml-auto">
                      <button onClick={() => handleRate(hook.id, true)} className="p-1 rounded hover:bg-green-500/20 text-[#888] hover:text-green-400 transition-all">
                        <ThumbsUp size={12} />
                      </button>
                      <span className="text-[10px] text-[#555]">{hook.likes}</span>
                      <button onClick={() => handleRate(hook.id, false)} className="p-1 rounded hover:bg-red-500/20 text-[#888] hover:text-red-400 transition-all">
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GenerationPanel>
        )}
      </div>
    </div>
  );
}