'use client';

import { useState } from 'react';
import { Video } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const EXTENSION_OPTIONS = ['+2s', '+4s', '+6s', '+8s', 'Custom'];
const DIRECTION_OPTIONS = ['Extend End', 'Extend Beginning', 'Both'];

export default function ExtendVideoPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [duration, setDuration] = useState(null);
  const [extensionAmount, setExtensionAmount] = useState('+4s');
  const [customDuration, setCustomDuration] = useState(5);
  const [direction, setDirection] = useState('Extend End');
  const [extensionPrompt, setExtensionPrompt] = useState('');
  const [loopMode, setLoopMode] = useState(false);
  const [model, setModel] = useState('seedance-2');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) {
      setVideoFile(file);
      const preview = URL.createObjectURL(file);
      setVideoPreview(preview);
      setDuration('5s');
    } else {
      setVideoFile(null);
      setVideoPreview(null);
      setDuration(null);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video to extend');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Video extension started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: `Extended by ${extensionAmount}`,
          type: 'video'
        }]);
        toast.success('Demo: Video extended!');
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
        title="EXTEND VIDEO"
        subtitle="Seamlessly add more seconds to the end of any video"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Video</SectionLabel>
              {videoPreview ? (
                <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                  <video src={videoPreview} controls className="w-full h-48 object-contain rounded-lg" />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                    {duration}
                  </div>
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
                    <p className="text-sm font-medium text-white">Upload video to extend</p>
                    <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <SectionLabel>Extension Amount</SectionLabel>
              <StudioDropdown options={EXTENSION_OPTIONS.map(o => ({ value: o, label: o.toUpperCase() }))} value={extensionAmount} onChange={setExtensionAmount} />
            </div>

            {extensionAmount === 'Custom' && (
              <div>
                <SectionLabel>Custom Duration (seconds)</SectionLabel>
                <input
                  type="number"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(parseInt(e.target.value))}
                  className="w-32 bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
            )}

            <div>
              <SectionLabel>Direction</SectionLabel>
              <StudioDropdown options={DIRECTION_OPTIONS.map(o => ({ value: o, label: o.toUpperCase() }))} value={direction} onChange={setDirection} />
            </div>

            <div>
              <SectionLabel>Extension Prompt (optional)</SectionLabel>
              <textarea
                value={extensionPrompt}
                onChange={(e) => setExtensionPrompt(e.target.value)}
                placeholder="Describe what should happen in the extended section..."
                className="w-full h-20 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLoopMode(!loopMode)}
                className={`w-12 h-6 rounded-full transition-all ${
                  loopMode ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  loopMode ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
              <span className="text-sm text-[#888]">Loop mode</span>
            </div>

            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector type="video" value={model} onChange={setModel} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Extend Video
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}