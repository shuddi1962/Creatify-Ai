'use client';

import { useState } from 'react';
import { Video, Layers } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const BLEND_MODES = ['Overlay', 'Replace Background', 'Add Foreground', 'Full Composite'];
const POSITION_OPTIONS = ['Full Frame', 'Background Only', 'Foreground Only', 'Custom Region'];
const STYLE_OPTIONS = ['Auto', 'Manual style prompt'];

export default function MixedMediaPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [blendMode, setBlendMode] = useState('Overlay');
  const [elementPosition, setElementPosition] = useState('Full Frame');
  const [realFootageOpacity, setRealFootageOpacity] = useState(70);
  const [styleMode, setStyleMode] = useState('Auto');
  const [manualStyle, setManualStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      setVideoFile(null);
      setVideoPreview(null);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload real footage');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Creating mixed media!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: aiPrompt,
          type: 'video'
        }]);
        toast.success('Demo: Mixed media created!');
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
        title="MIXED MEDIA"
        subtitle="Blend real footage with AI-generated visuals seamlessly"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Real Footage Base Video</SectionLabel>
              {videoPreview ? (
                <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                  <video src={videoPreview} controls className="w-full h-48 object-contain rounded-lg" />
                  <button
                    onClick={() => handleVideoUpload(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-8 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                  <div className="w-14 h-14 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                    <Video size={28} className="text-[#666]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Upload real footage base video</p>
                    <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <SectionLabel>AI Element Prompt</SectionLabel>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe the AI-generated elements..."
                className="w-full h-24 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div>
              <SectionLabel>Blend Mode</SectionLabel>
              <PillSelector options={BLEND_MODES} value={blendMode} onChange={setBlendMode} />
            </div>

            <div>
              <SectionLabel>AI Element Position</SectionLabel>
              <PillSelector options={POSITION_OPTIONS} value={elementPosition} onChange={setElementPosition} />
            </div>

            <div>
              <SectionLabel>Real Footage Opacity: {realFootageOpacity}%</SectionLabel>
              <input
                type="range"
                min="0"
                max="100"
                value={realFootageOpacity}
                onChange={(e) => setRealFootageOpacity(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer mt-2"
              />
            </div>

            <div>
              <SectionLabel>Style Matching</SectionLabel>
              <PillSelector options={STYLE_OPTIONS} value={styleMode} onChange={setStyleMode} />
            </div>

            {styleMode === 'Manual style prompt' && (
              <div>
                <SectionLabel>Manual Style Prompt</SectionLabel>
                <textarea
                  value={manualStyle}
                  onChange={(e) => setManualStyle(e.target.value)}
                  placeholder="Describe the visual style..."
                  className="w-full h-20 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            )}
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Create Mixed Media
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}