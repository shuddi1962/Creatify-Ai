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
import muapi from '@/packages/studio/src/muapi';

const STYLE_OPTIONS = [
  'Photorealistic', 'Cinematic', 'Anime', 'Digital Art', 
  'Oil Painting', 'Watercolor', 'Sketch', '3D Render', 'Fashion', 'Abstract'
];

export default function ImageToImagePage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [strength, setStrength] = useState(60);
  const [model, setModel] = useState('flux');
  const [style, setStyle] = useState('Cinematic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
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
    if (!sourceImage && !prompt.trim()) {
      toast.error('Please upload an image and enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey && sourceImage) {
        const response = await muapi.generateI2I(apiKey, {
          model,
          prompt: prompt + (style !== 'Photorealistic' ? `, ${style} style` : ''),
          image_url: sourceImage,
          strength: strength / 100,
          aspect_ratio: aspectRatio,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Image transformed successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Demo: Image transformed!');
      }
    } catch (error) {
      toast.error(error.message || 'Transformation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        icon={Image}
        title="IMAGE TO IMAGE"
        subtitle="Transform any image with AI — change style, content, and mood"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SectionLabel>Upload Source Image</SectionLabel>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload source image" />
            </div>
            <div>
              <SectionLabel>Describe the Transformation</SectionLabel>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want to transform the image..."
                className="w-full h-32 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div className="mt-6">
            <SectionLabel>How much to change (low=subtle, high=dramatic)</SectionLabel>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="0"
                max="100"
                value={strength}
                onChange={(e) => setStrength(parseInt(e.target.value))}
                className="flex-1 h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
              />
              <span className="text-sm text-white w-12">{strength}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector type="image" value={model} onChange={setModel} />
            </div>
            <div>
              <SectionLabel>Style</SectionLabel>
              <PillSelector options={STYLE_OPTIONS.slice(0, 6)} value={style} onChange={setStyle} />
            </div>
            <div>
              <SectionLabel>Aspect Ratio</SectionLabel>
              <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Transform Image
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}