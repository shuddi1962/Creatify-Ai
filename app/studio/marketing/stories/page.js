'use client';

import { useState } from 'react';
import { BookOpen, Music } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const STRUCTURES = {
  '3-Part': [
    { part: 1, name: 'Hook', range: '0-3s', default: 'Grab attention with a bold statement or visual' },
    { part: 2, name: 'Problem', range: '3-8s', default: 'Present the pain point your product solves' },
    { part: 3, name: 'Solution', range: '8-15s', default: 'Show your product as the solution' },
  ],
  '5-Part': [
    { part: 1, name: 'Hook', range: '0-2s', default: 'Attention-grabbing opening' },
    { part: 2, name: 'Relate', range: '2-5s', default: 'Connect with the audience' },
    { part: 3, name: 'Problem', range: '5-10s', default: 'Highlight the problem' },
    { part: 4, name: 'Solution', range: '10-20s', default: 'Present your product' },
    { part: 5, name: 'CTA', range: '20-25s', default: 'Call to action' },
  ],
  '7-Part': [
    { part: 1, name: 'Hook', range: '0-2s', default: 'Bold opening' },
    { part: 2, name: 'Relate', range: '2-5s', default: 'Build connection' },
    { part: 3, name: 'Problem', range: '5-10s', default: 'Define the issue' },
    { part: 4, name: 'Insight', range: '10-15s', default: 'Share key insight' },
    { part: 5, name: 'Solution', range: '15-25s', default: 'Show solution' },
    { part: 6, name: 'Proof', range: '25-30s', default: 'Social proof' },
    { part: 7, name: 'CTA', range: '30-35s', default: 'Final call to action' },
  ],
};
const MUSIC_OPTIONS = ['None', 'Auto-match', 'Upload'];
const CTA_TIMINGS = ['0s', '1s', '2s', '3s'];

export default function MarketingStoriesPage() {
  const [structure, setStructure] = useState('3-Part');
  const [parts, setParts] = useState(STRUCTURES['3-Part']);
  const [brandKit, setBrandKit] = useState(false);
  const [ctaText, setCtaText] = useState('Shop Now');
  const [ctaTiming, setCtaTiming] = useState('2s');
  const [music, setMusic] = useState('Auto-match');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleStructureChange = (s) => {
    setStructure(s);
    setParts(STRUCTURES[s]);
  };

  const updatePart = (i, field, value) => {
    setParts(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const handleGenerate = async () => {
    setLoading(true);
    toast.success('Building story ad...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      setResults([{ id: Date.now(), type: 'video', url: 'https://picsum.photos/seed/story/720/1280', prompt: 'Story Ad' }]);
      toast.success('Story ad built!');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={BookOpen} title="STORY AD BUILDER" subtitle="Build high-converting short-form story ads for any platform" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <SectionLabel>Story Structure</SectionLabel>
            <div className="flex gap-2">
              {Object.keys(STRUCTURES).map(s => (
                <button
                  key={s}
                  onClick={() => handleStructureChange(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${structure === s ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {parts.map((part, i) => (
                <div key={i} className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] text-[10px] font-bold rounded">Part {part.part}</span>
                    <span className="text-sm font-bold text-white">{part.name}</span>
                    <span className="text-xs text-[#555]">({part.range})</span>
                  </div>
                  <textarea
                    value={part.default}
                    onChange={e => updatePart(i, 'default', e.target.value)}
                    placeholder={`Describe the ${part.name.toLowerCase()} content...`}
                    className="w-full bg-[#111] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-[#444] resize-none h-16"
                  />
                </div>
              ))}
            </div>
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <div className="space-y-4">
            <button onClick={() => setBrandKit(!brandKit)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${brandKit ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white' : 'border-white/[0.08] bg-[#0a0a0a] text-[#888]'}`}>
              Apply Brand Kit: {brandKit ? 'On' : 'Off'}
            </button>
            <div>
              <SectionLabel>CTA Text</SectionLabel>
              <input value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="Shop Now" className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444]" />
            </div>
            <div>
              <SectionLabel>CTA Timing</SectionLabel>
              <PillSelector options={CTA_TIMINGS} value={ctaTiming} onChange={setCtaTiming} />
            </div>
            <div>
              <SectionLabel>Music</SectionLabel>
              <PillSelector options={MUSIC_OPTIONS} value={music} onChange={setMusic} />
            </div>
            <GenerateButton onClick={handleGenerate} loading={loading}>Build Story Ad</GenerateButton>
          </div>
        </GenerationPanel>
        <ResultsGrid results={results} columns={2} />
      </div>
    </div>
  );
}