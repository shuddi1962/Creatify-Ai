'use client';

import { useState } from 'react';
import { Video } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const STYLE_PRESETS = [
  'Anime', 'Cyberpunk', 'Film Noir', 'Watercolor', 'Oil Paint', 
  'Neon', 'Vintage Film', 'Comic Book', 'Claymation', 'Hyperrealistic'
];
const STRENGTH_OPTIONS = ['Low', 'Medium', 'High', 'Extreme'];

export default function RestyleVideoPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('Anime');
  const [customStyle, setCustomStyle] = useState('');
  const [styleStrength, setStyleStrength] = useState('Medium');
  const [preserveMotion, setPreserveMotion] = useState(true);
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
      toast.error('Please upload a video to restyle');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Video restyling started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: selectedStyle,
          type: 'video'
        }]);
        toast.success('Demo: Video restyled!');
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
        title="RESTYLE VIDEO"
        subtitle="Apply a completely new visual style to any existing video"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Video</SectionLabel>
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
                    <p className="text-sm font-medium text-white">Upload video to restyle</p>
                    <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <SectionLabel>Style Presets</SectionLabel>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {STYLE_PRESETS.map(preset => (
                  <button
                    key={preset}
                    onClick={() => setSelectedStyle(preset)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedStyle === preset
                        ? 'bg-[#6366f1] text-white border border-[#6366f1]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Custom Style Prompt</SectionLabel>
              <textarea
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                className="w-full h-20 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <SectionLabel>Style Strength</SectionLabel>
              <StudioDropdown options={STRENGTH_OPTIONS.map(o => ({ value: o, label: o.toUpperCase() }))} value={styleStrength} onChange={setStyleStrength} />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreserveMotion(!preserveMotion)}
                className={`w-12 h-6 rounded-full transition-all ${
                  preserveMotion ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  preserveMotion ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
              <span className="text-sm text-[#888]">Preserve motion</span>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Restyle Video
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}