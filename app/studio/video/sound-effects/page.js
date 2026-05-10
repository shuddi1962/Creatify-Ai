'use client';

import { useState } from 'react';
import { Video, Volume2, Library } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';

const EFFECT_SOURCE = ['Auto Detect', 'Manual', 'Library'];
const EFFECT_LIBRARY = [
  'Rain', 'Explosion', 'Footsteps', 'Crowd', 'Ocean', 'Wind', 'Birds', 'City', 
  'Thunder', 'Fire', 'Glass Breaking', 'Car Engine', 'Door', 'Applause', 'Gunshot'
];

export default function SoundEffectsPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [effectSource, setEffectSource] = useState('Auto Detect');
  const [manualPrompt, setManualPrompt] = useState('');
  const [selectedEffects, setSelectedEffects] = useState([]);
  const [volume, setVolume] = useState(80);
  const [mixWithOriginal, setMixWithOriginal] = useState(true);
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

  const toggleEffect = (effect) => {
    if (selectedEffects.includes(effect)) {
      setSelectedEffects(selectedEffects.filter(e => e !== effect));
    } else {
      setSelectedEffects([...selectedEffects, effect]);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Adding sound effects!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: selectedEffects.length > 0 ? selectedEffects.join(', ') : 'Auto-detected sounds',
          type: 'video'
        }]);
        toast.success('Demo: Sound effects added!');
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
        title="ADD SOUND EFFECTS"
        subtitle="Layer AI-generated sound effects onto any video automatically"
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
                    <p className="text-sm font-medium text-white">Upload video to add sound to</p>
                    <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} className="hidden" />
                </label>
              )}
            </div>

            <div className="flex gap-2">
              {EFFECT_SOURCE.map(source => (
                <button
                  key={source}
                  onClick={() => setEffectSource(source)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    effectSource === source ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>

            {effectSource === 'Manual' && (
              <div>
                <SectionLabel>Manual Prompt</SectionLabel>
                <textarea
                  value={manualPrompt}
                  onChange={(e) => setManualPrompt(e.target.value)}
                  placeholder="Describe the sound effects you want..."
                  className="w-full h-20 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            )}

            {effectSource === 'Library' && (
              <div>
                <SectionLabel>Effect Library</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {EFFECT_LIBRARY.map(effect => (
                    <button
                      key={effect}
                      onClick={() => toggleEffect(effect)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedEffects.includes(effect)
                          ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                          : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                      }`}
                    >
                      {effect}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <SectionLabel>Volume: {volume}%</SectionLabel>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer mt-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setMixWithOriginal(!mixWithOriginal)}
                className={`w-12 h-6 rounded-full transition-all ${mixWithOriginal ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${mixWithOriginal ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-[#888]">Mix with original audio</span>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Add Sound Effects
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}