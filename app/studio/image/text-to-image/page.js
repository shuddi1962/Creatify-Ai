'use client';

import { useState } from 'react';
import { Image } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import AspectRatioPicker from '@/components/studio/AspectRatioPicker';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StylePresets from '@/components/studio/StylePresets';
import PillSelector from '@/components/studio/PillSelector';
import * as muapi from '@/packages/studio/src/muapi';

const QUALITY_OPTIONS = ['Standard', 'HD', '4K'];
const NUM_IMAGES_OPTIONS = ['1', '2', '4', '8'];
const STYLE_OPTIONS = [
  'Photorealistic', 'Cinematic', 'Anime', 'Digital Art', 
  'Oil Painting', 'Watercolor', 'Sketch', '3D Render', 'Fashion', 'Abstract'
];

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showNegative, setShowNegative] = useState(false);
  const [model, setModel] = useState('flux');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('Standard');
  const [numImages, setNumImages] = useState('1');
  const [style, setStyle] = useState('Photorealistic');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        const promises = Array(parseInt(numImages)).fill(null).map((_, i) => 
          muapi.generateImage(apiKey, {
            model,
            prompt: prompt + (style !== 'Photorealistic' ? `, ${style} style` : ''),
            aspect_ratio: aspectRatio,
            quality: quality.toLowerCase(),
          })
        );
        const responses = await Promise.all(promises);
        setResults(responses.map((r, i) => ({
          id: `result-${Date.now()}-${i}`,
          url: r.url,
          prompt: prompt,
          type: 'image'
        })));
        toast.success('Image generated successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults(Array(parseInt(numImages)).fill(null).map((_, i) => ({
          id: `demo-${Date.now()}-${i}`,
          url: `https://picsum.photos/seed/${Date.now() + i}/1024/1024`,
          prompt: prompt,
          type: 'image'
        })));
        toast.success('Demo: Image generated!');
      }
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        icon={Image}
        title="IMAGE STUDIO"
        subtitle="Generate stunning AI images from any text prompt"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Prompt</SectionLabel>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your image in detail..."
                className="w-full h-32 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            {showNegative && (
              <div>
                <SectionLabel>Negative Prompt</SectionLabel>
                <textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="What to exclude from the image..."
                  className="w-full h-20 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            )}

            <button
              onClick={() => setShowNegative(!showNegative)}
              className="text-xs text-[#666] hover:text-white transition-colors"
            >
              {showNegative ? '− Hide Negative Prompt' : '+ Add Negative Prompt'}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Model</SectionLabel>
                <ModelSelector type="image" value={model} onChange={setModel} />
              </div>
              <div>
                <SectionLabel>Aspect Ratio</SectionLabel>
                <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SectionLabel>Quality</SectionLabel>
                <PillSelector options={QUALITY_OPTIONS} value={quality} onChange={setQuality} />
              </div>
              <div>
                <SectionLabel>Images</SectionLabel>
                <PillSelector options={NUM_IMAGES_OPTIONS} value={numImages} onChange={setNumImages} />
              </div>
            </div>

            <div>
              <SectionLabel>Style</SectionLabel>
              <StylePresets presets={STYLE_OPTIONS} value={style} onChange={setStyle} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate Image
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={parseInt(numImages) > 2 ? 2 : 3} />
      </div>
    </div>
  );
}
