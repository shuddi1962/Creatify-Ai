'use client';

import { useState } from 'react';
import { Package, Download, Play, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const VARIANTS = [5, 10, 20];
const DIMENSIONS = ['Hook', 'Tone', 'Visual Style', 'Creator Type', 'Duration', 'Platform'];
const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'LinkedIn'];

export default function MarketingBatchPage() {
  const [inputType, setInputType] = useState('description');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [count, setCount] = useState(10);
  const [dimensions, setDimensions] = useState(['Hook', 'Tone', 'Visual Style']);
  const [platforms, setPlatforms] = useState(['TikTok', 'Instagram']);
  const [model, setModel] = useState('seedance-2');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const toggleDimension = (d) => setDimensions(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const togglePlatform = (p) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const handleScan = async () => {
    if (!url.trim()) { toast.error('Enter a URL'); return; }
    toast.loading('Scanning...', { id: 'scan' });
    await new Promise(r => setTimeout(r, 1500));
    setDescription('Scanned product: premium wireless headphones with active noise cancellation');
    toast.success('Product scanned!', { id: 'scan' });
  };

  const handleGenerate = async () => {
    if (!description.trim()) { toast.error('Enter a product description'); return; }
    setLoading(true);
    toast.success(`Generating ${count} ad variants...`);
    try {
      await new Promise(r => setTimeout(r, 3000));
      const variants = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        type: 'video',
        url: `https://picsum.photos/seed/batch${i}/720/1280`,
        prompt: `Variant ${i + 1}: ${dimensions[i % dimensions.length]} variation`,
        model,
      }));
      setResults(variants);
      toast.success('Batch generation complete!');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Package} badge="NEW" title="BATCH AD GENERATOR" subtitle="Create 10 different ad variants from one product in one click" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button onClick={() => setInputType('description')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${inputType === 'description' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>Description</button>
              <button onClick={() => setInputType('url')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${inputType === 'url' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>URL</button>
            </div>
            {inputType === 'description' ? (
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product..." className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-24" />
            ) : (
              <div className="flex gap-2">
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Product URL..." className="flex-1 bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444]" />
                <button onClick={handleScan} className="px-4 py-2.5 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl hover:bg-[#6D28D9] transition-all">Scan</button>
              </div>
            )}
            <div>
              <SectionLabel>Number of Variants</SectionLabel>
              <PillSelector options={VARIANTS.map(String)} value={String(count)} onChange={v => setCount(parseInt(v))} />
            </div>
            <div>
              <SectionLabel>Variation Dimensions</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {DIMENSIONS.map(d => (
                  <button key={d} onClick={() => toggleDimension(d)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dimensions.includes(d) ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Platforms</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => togglePlatform(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${platforms.includes(p) ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector value={model} onChange={setModel} type="video" />
            </div>
            <GenerateButton onClick={handleGenerate} loading={loading}>Generate Ad Batch</GenerateButton>
          </div>
        </GenerationPanel>
        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {results.map((r, i) => (
              <div key={r.id} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden">
                <div className="relative aspect-[9/16] bg-[#1a1a1a]">
                  <img src={r.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-white">{i + 1}</div>
                </div>
                <div className="p-2 flex gap-1">
                  <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-[#1a1a1a] rounded text-[10px] text-[#888] hover:text-white transition-all"><Play size={10} />Preview</button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-[#1a1a1a] rounded text-[10px] text-[#888] hover:text-white transition-all"><Download size={10} />DL</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}