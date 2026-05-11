'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import AspectRatioPicker from '@/components/studio/AspectRatioPicker';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const MOTION_PRESETS = ['Zoom In', 'Zoom Out', 'Pan Right', 'Pan Left', 'Orbit', 'Float', 'Shake', 'Cinematic Drift', 'Breathing', 'Subtle Motion'];
const DURATION_OPTIONS = ['3s', '5s', '8s', '10s', '15s'];
const ASPECT_OPTIONS = ['Keep Original', '16:9', '9:16', '1:1'];
const STRENGTH_OPTIONS = ['Low', 'Medium', 'High'];

export default function ImageToVideoPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [motionPrompt, setMotionPrompt] = useState('');
  const [motionPreset, setMotionPreset] = useState('Zoom In');
  const [model, setModel] = useState('seedance-2');
  const [duration, setDuration] = useState('5s');
  const [aspectRatio, setAspectRatio] = useState('Keep Original');
  const [motionStrength, setMotionStrength] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleImageUpload = (file) => {
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      toast.error('Please upload an image to animate');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Image animation started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: motionPrompt || motionPreset,
          type: 'video'
        }]);
        toast.success('Demo: Image animated!');
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
        title="IMAGE TO VIDEO"
        subtitle="Animate any still image into a smooth, cinematic video"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Image</SectionLabel>
              {imagePreview ? (
                <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-contain rounded-lg" />
                  <button
                    onClick={() => handleImageUpload(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-10 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                  <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                    <Upload size={32} className="text-[#666]" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-medium text-white">Upload image to animate</p>
                    <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <SectionLabel>Motion Prompt</SectionLabel>
              <textarea
                value={motionPrompt}
                onChange={(e) => setMotionPrompt(e.target.value)}
                placeholder="Describe how the image should move..."
                className="w-full h-20 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <SectionLabel>Motion Preset</SectionLabel>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {MOTION_PRESETS.map(preset => (
                  <button
                    key={preset}
                    onClick={() => setMotionPreset(preset)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      motionPreset === preset
                        ? 'bg-[#6366f1] text-white border border-[#6366f1]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Model</SectionLabel>
                <ModelSelector type="video" value={model} onChange={setModel} />
              </div>
              <div>
                <SectionLabel>Duration</SectionLabel>
                <StudioDropdown options={DURATION_OPTIONS} value={duration} onChange={setDuration} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Aspect Ratio</SectionLabel>
                <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} options={ASPECT_OPTIONS} />
              </div>
              <div>
                <SectionLabel>Motion Strength</SectionLabel>
                <StudioDropdown options={STRENGTH_OPTIONS} value={motionStrength} onChange={setMotionStrength} />
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Animate Image
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}