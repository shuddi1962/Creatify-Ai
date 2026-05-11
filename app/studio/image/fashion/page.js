'use client';

import { useState } from 'react';
import { Image, Shirt } from 'lucide-react';
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

const MODEL_TYPES = ['Male', 'Female', 'Non-binary', 'Child'];
const POSES = ['Standing', 'Walking', 'Sitting', 'Running', 'Editorial', 'Street Style', 'Runway', 'Casual'];
const BACKGROUNDS = ['Studio White', 'Runway', 'Street', 'Nature', 'Urban', 'Custom'];
const SEASONS = ['Spring-Summer', 'Fall-Winter'];

export default function FashionPage() {
  const [modelImage, setModelImage] = useState(null);
  const [clothingImage, setClothingImage] = useState(null);
  const [promptMode, setPromptMode] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [modelType, setModelType] = useState('Female');
  const [pose, setPose] = useState('Standing');
  const [background, setBackground] = useState('Studio White');
  const [season, setSeason] = useState('Spring-Summer');
  const [customBg, setCustomBg] = useState(null);
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleModelFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setModelImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setModelImage(null);
    }
  };

  const handleClothingFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setClothingImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setClothingImage(null);
    }
  };

  const handleCustomBg = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCustomBg(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setCustomBg(null);
    }
  };

  const handleGenerate = async () => {
    if (!promptMode && !modelImage && !clothingImage) {
      toast.error('Please upload images or use prompt mode');
      return;
    }

    if (promptMode && !prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      const fullPrompt = promptMode 
        ? prompt 
        : `${modelType} model wearing clothing, ${pose} pose, ${background} background, ${season} collection`;
      if (apiKey) {
        const response = await muapi.generateImage(apiKey, {
          model,
          prompt: fullPrompt,
          aspect_ratio: '3:4',
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Fashion image generated!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/768/1024`,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Demo: Fashion image generated!');
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
        icon={Shirt}
        title="FASHION GENERATOR"
        subtitle="Place any outfit on a model in any style and environment"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setPromptMode(false)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  !promptMode 
                    ? 'bg-[#7C3AED] text-white' 
                    : 'bg-[#1a1a1a] text-[#666] hover:bg-[#222]'
                }`}
              >
                Image Mode
              </button>
              <button
                onClick={() => setPromptMode(true)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  promptMode 
                    ? 'bg-[#7C3AED] text-white' 
                    : 'bg-[#1a1a1a] text-[#666] hover:bg-[#222]'
                }`}
              >
                Prompt Mode
              </button>
            </div>

            {promptMode ? (
              <div>
                <SectionLabel>Describe the outfit and scene</SectionLabel>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A model wearing a red silk dress, walking on a Paris runway..."
                  className="w-full h-28 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <SectionLabel>Model / Person (Optional)</SectionLabel>
                  <UploadZone onFile={handleModelFile} preview={modelImage} accept="image/*" label="Upload model" />
                </div>
                <div>
                  <SectionLabel>Clothing / Outfit (Optional)</SectionLabel>
                  <UploadZone onFile={handleClothingFile} preview={clothingImage} accept="image/*" label="Upload clothing" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Model Type</SectionLabel>
                <StudioDropdown options={MODEL_TYPES} value={modelType} onChange={setModelType} label="MODEL TYPE" />
              </div>
              <div>
                <SectionLabel>Pose</SectionLabel>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {POSES.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPose(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        pose === p
                          ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                          : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SectionLabel>Background</SectionLabel>
                <StudioDropdown options={BACKGROUNDS} value={background} onChange={setBackground} label="BACKGROUND" />
                {background === 'Custom' && (
                  <div className="mt-2">
                    <UploadZone onFile={handleCustomBg} preview={customBg} accept="image/*" label="Custom background" />
                  </div>
                )}
              </div>
              <div>
                <SectionLabel>Season</SectionLabel>
                <StudioDropdown options={SEASONS} value={season} onChange={setSeason} label="SEASON" />
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
            Generate Fashion
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}
