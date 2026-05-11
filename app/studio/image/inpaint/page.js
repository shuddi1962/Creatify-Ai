'use client';

import { useState } from 'react';
import { Image, Brush, Eraser, RotateCcw, Trash2 } from 'lucide-react';
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

const INPAINT_MODES = ['Replace', 'Keep Surrounding', 'Expand'];

export default function InpaintPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [brushSize, setBrushSize] = useState(20);
  const [eraserMode, setEraserMode] = useState(false);
  const [inpaintMode, setInpaintMode] = useState('Replace');
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
          prompt: prompt,
          image_url: sourceImage,
          strength: 0.8,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Inpainting applied successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Demo: Inpainting applied!');
      }
    } catch (error) {
      toast.error(error.message || 'Inpainting failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        icon={Image}
        title="INPAINT & EDIT"
        subtitle="Brush to paint over any area — AI fills it with your prompt"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Image to Edit</SectionLabel>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload image to edit" />
            </div>

            <div>
              <SectionLabel>Brush Tool</SectionLabel>
              <div className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-xl border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEraserMode(false)}
                    className={`p-3 rounded-lg transition-all ${!eraserMode ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#666] hover:bg-[#222]'}`}
                  >
                    <Brush size={18} />
                  </button>
                  <button
                    onClick={() => setEraserMode(true)}
                    className={`p-3 rounded-lg transition-all ${eraserMode ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#666] hover:bg-[#222]'}`}
                  >
                    <Eraser size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-[#444]">Size:</span>
                  <input
                    type="range"
                    min="4"
                    max="80"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                  />
                  <span className="text-xs text-white w-10">{brushSize}px</span>
                </div>
                <button className="p-3 rounded-lg bg-[#1a1a1a] text-[#666] hover:bg-[#222]">
                  <RotateCcw size={18} />
                </button>
                <button className="p-3 rounded-lg bg-[#1a1a1a] text-[#666] hover:bg-[#222]">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div>
              <SectionLabel>Describe what to put in the masked area</SectionLabel>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what to add to the masked area..."
                className="w-full h-24 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Inpaint Mode</SectionLabel>
                <StudioDropdown options={INPAINT_MODES} value={inpaintMode} onChange={setInpaintMode} label="INPAINT MODE" />
              </div>
              <div>
                <SectionLabel>Model</SectionLabel>
                <ModelSelector type="image" value={model} onChange={setModel} />
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Apply Inpaint
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}
