'use client';

import { useState } from 'react';
import { ShoppingBag, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';

const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Facebook', 'LinkedIn'];
const HOOK_STYLES = ['Problem/Solution', 'Before/After', 'Testimonial', 'Tutorial', 'Unboxing', 'Transformation', 'Lifestyle'];
const TONES = ['Authentic', 'Energetic', 'Educational', 'Emotional', 'Humorous', 'Urgent'];
const DURATIONS = ['15s', '30s', '60s'];
const CREATOR_STYLES = ['Female Creator', 'Male Creator', 'Voice-only', 'Screen Record + Voice'];
const VARIANTS = [1, 3, 5, 10];

export default function MarketingUGCPage() {
  const [productDesc, setProductDesc] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [hookStyle, setHookStyle] = useState('Problem/Solution');
  const [tone, setTone] = useState('Authentic');
  const [duration, setDuration] = useState('30s');
  const [creatorStyle, setCreatorStyle] = useState('Female Creator');
  const [variants, setVariants] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!productDesc.trim()) {
      toast.error('Please describe your product');
      return;
    }
    setLoading(true);
    toast.success(`Generating ${variants} UGC ad${variants > 1 ? 's' : ''}...`);
    try {
      await new Promise(r => setTimeout(r, 3000));
      const newResults = Array.from({ length: variants }, (_, i) => ({
        id: Date.now() + i,
        type: 'video',
        url: `https://picsum.photos/seed/ugc${i}/720/1280`,
        prompt: `UGC Ad: ${productDesc.slice(0, 50)}...`,
      }));
      setResults(newResults);
      toast.success('UGC ads generated!');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={ShoppingBag} badge="TOP" title="UGC AD GENERATOR" subtitle="Create scroll-stopping UGC-style video ads that actually convert" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <div>
              <SectionLabel>Product Description</SectionLabel>
              <textarea value={productDesc} onChange={e => setProductDesc(e.target.value)} placeholder="Describe your product or service..." className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-24" />
            </div>
            <div>
              <SectionLabel>Product Image (Optional)</SectionLabel>
              <UploadZone onFile={setProductImage} accept="image/*" label="Upload product image" icon={Upload} preview={productImage ? URL.createObjectURL(productImage) : null} />
            </div>
            <div>
              <SectionLabel>Target Audience</SectionLabel>
              <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., Women 25-35, fitness enthusiasts" className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#444]" />
            </div>
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <div className="space-y-4">
            <div>
              <SectionLabel>Platform</SectionLabel>
              <StudioDropdown label="PLATFORM" value={platform} onChange={setPlatform} options={PLATFORMS} />
            </div>
            <div>
              <SectionLabel>Hook Style</SectionLabel>
              <StudioDropdown label="HOOK STYLE" value={hookStyle} onChange={setHookStyle} options={HOOK_STYLES} />
            </div>
            <div>
              <SectionLabel>Tone</SectionLabel>
              <StudioDropdown label="TONE" value={tone} onChange={setTone} options={TONES} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Duration</SectionLabel>
                <StudioDropdown label="DURATION" value={duration} onChange={setDuration} options={DURATIONS} />
              </div>
              <div>
                <SectionLabel>Creator Style</SectionLabel>
                <StudioDropdown label="CREATOR STYLE" value={creatorStyle} onChange={setCreatorStyle} options={CREATOR_STYLES} />
              </div>
            </div>
            <div>
              <SectionLabel>Number of Variants</SectionLabel>
              <StudioDropdown label="NUMBER OF VARIANTS" value={`${variants}`} onChange={v => setVariants(parseInt(v))} options={VARIANTS.map(v => `${v}`)} />
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate UGC Ads
          </GenerateButton>
        </div>
        <ResultsGrid results={results} columns={2} />
      </div>
    </div>
  );
}