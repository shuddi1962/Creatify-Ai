'use client';

import { useState } from 'react';
import { Video, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const INPUT_TABS = ['Prompt', 'Upload video'];
const CAMERA_PRESETS = [
  { id: 'static', label: 'Static' },
  { id: 'slow-zoom-in', label: 'Slow Zoom In' },
  { id: 'zoom-out', label: 'Zoom Out' },
  { id: 'pan-left', label: 'Pan Left' },
  { id: 'pan-right', label: 'Pan Right' },
  { id: 'tilt-up', label: 'Tilt Up' },
  { id: 'tilt-down', label: 'Tilt Down' },
  { id: 'orbit-left', label: 'Orbit Left' },
  { id: 'orbit-right', label: 'Orbit Right' },
  { id: 'dolly-push', label: 'Dolly Push' },
  { id: 'dolly-pull', label: 'Dolly Pull' },
  { id: 'crane-up', label: 'Crane Up' },
  { id: 'crane-down', label: 'Crane Down' },
  { id: 'handheld', label: 'Handheld' },
  { id: 'steadicam', label: 'Steadicam' },
  { id: 'dutch-tilt', label: 'Dutch Tilt' },
  { id: 'whip-pan', label: 'Whip Pan' },
];
const SPEED_OPTIONS = ['Slow', 'Normal', 'Fast'];

export default function CameraMotionPage() {
  const [inputMode, setInputMode] = useState('Prompt');
  const [prompt, setPrompt] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [cameraPreset, setCameraPreset] = useState('static');
  const [motionSpeed, setMotionSpeed] = useState('Normal');
  const [model, setModel] = useState('seedance-2');
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
    if (!prompt && !videoFile) {
      toast.error('Please enter a prompt or upload a video');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Applying camera motion!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: `Camera: ${cameraPreset}`,
          type: 'video'
        }]);
        toast.success('Demo: Camera motion applied!');
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
        title="CAMERA MOTION"
        subtitle="Apply professional camera movements to any AI or real video"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div className="flex gap-2">
              {INPUT_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setInputMode(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === tab ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {inputMode === 'Prompt' ? (
              <div>
                <SectionLabel>Prompt</SectionLabel>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the video you want to create..."
                  className="w-full h-32 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
                />
              </div>
            ) : (
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
                    <p className="text-sm font-medium text-white">Upload video</p>
                    <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} className="hidden" />
                  </label>
                )}
              </div>
            )}

            <div>
              <SectionLabel>Camera Motion Preset</SectionLabel>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {CAMERA_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => setCameraPreset(preset.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      cameraPreset === preset.id
                        ? 'bg-[#6366f1] text-white border border-[#6366f1]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Motion Speed</SectionLabel>
              <StudioDropdown options={SPEED_OPTIONS.map(o => ({ value: o, label: o.toUpperCase() }))} value={motionSpeed} onChange={setMotionSpeed} />
            </div>

            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector type="video" value={model} onChange={setModel} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Apply Camera Motion
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}