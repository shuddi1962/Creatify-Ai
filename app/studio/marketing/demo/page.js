'use client';

import { useState } from 'react';
import { Play, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';

const DEMO_STYLES = ['Unboxing', 'Feature Walkthrough', 'Before-After', 'How It Works', '360 Showcase', 'Lifestyle Use'];
const SCENE_SETTINGS = ['White Studio', 'Lifestyle Home', 'Office', 'Outdoor', 'Abstract'];
const VOICEOVER_OPTIONS = ['None', 'Auto-generated', 'Upload script'];
const DURATIONS = ['15s', '30s', '60s'];

export default function MarketingDemoPage() {
  const [product, setProduct] = useState(null);
  const [demoStyle, setDemoStyle] = useState('Feature Walkthrough');
  const [scene, setScene] = useState('White Studio');
  const [voiceover, setVoiceover] = useState('Auto-generated');
  const [duration, setDuration] = useState('30s');
  const [textOverlays, setTextOverlays] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!product) {
      toast.error('Please upload a product');
      return;
    }
    setLoading(true);
    toast.success('Generating demo video...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      setResults([{ id: Date.now(), type: 'video', url: 'https://picsum.photos/seed/demo/1280/720', prompt: `Demo: ${demoStyle}` }]);
      toast.success('Demo video generated!');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Play} title="PRODUCT DEMO" subtitle="Showcase your product in motion with stunning AI video demos" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <SectionLabel>Product Upload</SectionLabel>
            <UploadZone onFile={setProduct} accept="image/*" label="Upload product image or 3D model" icon={Upload} preview={product ? URL.createObjectURL(product) : null} />
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <div className="space-y-4">
            <div>
              <SectionLabel>Demo Style</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DEMO_STYLES.map(s => (
                  <button
                    key={s}
                    onClick={() => setDemoStyle(s)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      demoStyle === s ? 'bg-[#6366f1] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Scene Setting</SectionLabel>
              <StudioDropdown label="Scene Setting" options={SCENE_SETTINGS} value={scene} onChange={setScene} />
            </div>
            <div>
              <SectionLabel>Voiceover</SectionLabel>
              <StudioDropdown label="Voiceover" options={VOICEOVER_OPTIONS} value={voiceover} onChange={setVoiceover} />
            </div>
            <div>
              <SectionLabel>Duration</SectionLabel>
              <StudioDropdown label="Duration" options={DURATIONS} value={duration} onChange={setDuration} />
            </div>
            <button
              onClick={() => setTextOverlays(!textOverlays)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${textOverlays ? 'border-[#6366f1] bg-[#6366f1]/10 text-white' : 'border-white/[0.08] bg-[#0a0a0a] text-[#888]'}`}
            >
              Text Overlays: {textOverlays ? 'On' : 'Off'}
            </button>
            <GenerateButton onClick={handleGenerate} loading={loading}>Generate Demo Video</GenerateButton>
          </div>
        </GenerationPanel>
        <ResultsGrid results={results} columns={2} />
      </div>
    </div>
  );
}