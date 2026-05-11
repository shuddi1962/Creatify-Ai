'use client';

import { useState } from 'react';
import { Image, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import * as muapi from '@/packages/studio/src/muapi';

const DIRECTIONS = [
  { id: 'up', icon: ArrowUp, label: 'Up' },
  { id: 'down', icon: ArrowDown, label: 'Down' },
  { id: 'left', icon: ArrowLeft, label: 'Left' },
  { id: 'right', icon: ArrowRight, label: 'Right' },
  { id: 'up-left', icon: ArrowUpLeft, label: 'Up-Left' },
  { id: 'up-right', icon: ArrowUpRight, label: 'Up-Right' },
  { id: 'down-left', icon: ArrowDownLeft, label: 'Down-Left' },
  { id: 'down-right', icon: ArrowDownRight, label: 'Down-Right' },
];

const EXPAND_AMOUNTS = ['256px', '512px', '1024px'];

export default function OutpaintPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [direction, setDirection] = useState('right');
  const [expandAmount, setExpandAmount] = useState('512px');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSourceImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSourceImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) {
      toast.error('Please upload an image to expand');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        const response = await muapi.generateI2I(apiKey, {
          model,
          prompt: prompt || 'Expand the scene seamlessly',
          image_url: sourceImage,
          strength: 0.7,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Image expanded successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1200/800`,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Demo: Image expanded!');
      }
    } catch (error) {
      toast.error(error.message || 'Expansion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        icon={Image}
        title="OUTPAINT"
        subtitle="Expand your image in any direction — AI seamlessly extends the scene"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Image to Expand</SectionLabel>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload image to expand" />
            </div>

            <div>
              <SectionLabel>Direction</SectionLabel>
              <div className="grid grid-cols-4 gap-2 max-w-[200px] mx-auto">
                {DIRECTIONS.map((dir) => (
                  <button
                    key={dir.id}
                    onClick={() => setDirection(dir.id)}
                    className={`p-3 rounded-lg transition-all ${
                      direction === dir.id 
                        ? 'bg-[#7C3AED] text-white' 
                        : 'bg-[#1a1a1a] text-[#666] hover:bg-[#222]'
                    }`}
                  >
                    <dir.icon size={20} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Expand Amount</SectionLabel>
              <StudioDropdown options={EXPAND_AMOUNTS} value={expandAmount} onChange={setExpandAmount} label="EXPAND AMOUNT" />
            </div>

            <div>
              <SectionLabel>Describe what should appear in the expanded area</SectionLabel>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what should appear in the expanded area..."
                className="w-full h-24 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector type="image" value={model} onChange={setModel} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Expand Image
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}
