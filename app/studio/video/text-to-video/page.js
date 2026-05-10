'use client';

import { useState } from 'react';
import { Video } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import AspectRatioPicker from '@/components/studio/AspectRatioPicker';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';
import muapi from '@/packages/studio/src/muapi';

const DURATION_OPTIONS = ['3s', '5s', '8s', '10s', '15s'];
const QUALITY_OPTIONS = ['480p', '720p', '1080p', '4K'];
const MOTION_OPTIONS = ['Low', 'Medium', 'High', 'Extreme'];
const CAMERA_OPTIONS = ['Static', 'Zoom In', 'Zoom Out', 'Pan Left', 'Pan Right', 'Orbit', 'Handheld'];

export default function TextToVideoPage() {
  const [inputMode, setInputMode] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [model, setModel] = useState('seedance-2');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState('5s');
  const [quality, setQuality] = useState('720p');
  const [motionIntensity, setMotionIntensity] = useState('Medium');
  const [cameraMovement, setCameraMovement] = useState('Static');
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
    if (!prompt.trim() && !imageFile) {
      toast.error('Please enter a prompt or upload an image');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        const params = {
          model,
          prompt: prompt || 'Animate this image',
          aspect_ratio: aspectRatio,
          duration: parseInt(duration),
          quality: quality.toLowerCase(),
        };
        if (inputMode === 'image' && imageFile) {
          const uploaded = await muapi.uploadFile(imageFile);
          params.image_url = uploaded;
          const response = await muapi.generateI2V(apiKey, params);
          setResults([{
            id: `result-${Date.now()}`,
            url: response.url,
            prompt: prompt,
            type: 'video'
          }]);
        } else {
          const response = await muapi.generateVideo(apiKey, params);
          setResults([{
            id: `result-${Date.now()}`,
            url: response.url,
            prompt: prompt,
            type: 'video'
          }]);
        }
        toast.success('Video generated successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: prompt,
          type: 'video'
        }]);
        toast.success('Demo: Video generated!');
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
        icon={Video}
        title="VIDEO STUDIO"
        subtitle="Generate high-quality video clips from any text prompt"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setInputMode('text')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  inputMode === 'text' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setInputMode('image')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  inputMode === 'image' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'
                }`}
              >
                Image+Text
              </button>
            </div>

            {inputMode === 'text' ? (
              <div>
                <SectionLabel>Prompt</SectionLabel>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the video you want to create..."
                  className="w-full h-32 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            ) : (
              <div>
                <SectionLabel>Upload Image</SectionLabel>
                <div className="mb-4">
                  {imagePreview ? (
                    <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
                      <button
                        onClick={() => handleImageUpload(null)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                      <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                        <Video size={24} className="text-[#666]" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-white">Upload image to animate</p>
                        <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} className="hidden" />
                    </label>
                  )}
                </div>
                <SectionLabel>Motion Prompt</SectionLabel>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe how the image should move..."
                  className="w-full h-20 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Model</SectionLabel>
                <ModelSelector type="video" value={model} onChange={setModel} />
              </div>
              <div>
                <SectionLabel>Aspect Ratio</SectionLabel>
                <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} options={['16:9', '9:16', '1:1', '4:3', '2.35:1']} />
              </div>
            </div>

            <div>
              <SectionLabel>Duration</SectionLabel>
              <PillSelector options={DURATION_OPTIONS} value={duration} onChange={setDuration} />
            </div>

            <div>
              <SectionLabel>Quality</SectionLabel>
              <PillSelector options={QUALITY_OPTIONS} value={quality} onChange={setQuality} />
            </div>

            <div>
              <SectionLabel>Motion Intensity</SectionLabel>
              <PillSelector options={MOTION_OPTIONS} value={motionIntensity} onChange={setMotionIntensity} />
            </div>

            <div>
              <SectionLabel>Camera Movement</SectionLabel>
              <PillSelector options={CAMERA_OPTIONS} value={cameraMovement} onChange={setCameraMovement} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate Video
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}