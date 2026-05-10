'use client';

import { useState } from 'react';
import { Image, Palette } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';
import * as muapi from '@/packages/studio/src/muapi';

const PRESERVE_OPTIONS = ['Content Structure', 'Color Palette', 'Both', 'Neither'];
const STYLE_PRESETS = [
  'Van Gogh', 'Monet', 'Picasso', 'Anime', 'Comic Book', 
  'Oil Paint', 'Watercolor', 'Neon', 'Cyberpunk', 'Film Noir'
];

export default function StyleTransferPage() {
  const [contentImage, setContentImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);
  const [styleStrength, setStyleStrength] = useState(50);
  const [preserve, setPreserve] = useState('Both');
  const [stylePreset, setStylePreset] = useState(null);
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleContentFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setContentImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setContentImage(null);
    }
  };

  const handleStyleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setStyleImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setStyleImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!contentImage) {
      toast.error('Please upload a content image');
      return;
    }

    if (!styleImage && !stylePreset) {
      toast.error('Please upload a style reference or select a preset');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      const fullPrompt = stylePreset ? `${stylePreset} style` : 'Style transfer';
      if (apiKey) {
        const response = await muapi.generateI2I(apiKey, {
          model,
          prompt: fullPrompt,
          image_url: contentImage,
          strength: styleStrength / 100,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Style transferred successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Demo: Style transferred!');
      }
    } catch (error) {
      toast.error(error.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        icon={Palette}
        title="STYLE TRANSFER"
        subtitle="Apply the visual style of any reference image to your content"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Content Image</SectionLabel>
                <UploadZone onFile={handleContentFile} preview={contentImage} accept="image/*" label="Upload content" />
              </div>
              <div>
                <SectionLabel>Style Reference</SectionLabel>
                <UploadZone onFile={handleStyleFile} preview={styleImage} accept="image/*" label="Upload style" />
              </div>
            </div>

            <div>
              <SectionLabel>Style Strength</SectionLabel>
              <div className="flex items-center gap-4 mt-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={styleStrength}
                  onChange={(e) => setStyleStrength(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                />
                <span className="text-sm text-white w-12">{styleStrength}%</span>
              </div>
            </div>

            <div>
              <SectionLabel>Preserve</SectionLabel>
              <PillSelector options={PRESERVE_OPTIONS} value={preserve} onChange={setPreserve} />
            </div>

            <div>
              <SectionLabel>Style Presets (if no reference)</SectionLabel>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setStylePreset(stylePreset === preset ? null : preset)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                      stylePreset === preset
                        ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector type="image" value={model} onChange={setModel} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Transfer Style
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}
