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

const SCALE_OPTIONS = ['2x', '4x'];
const RESOLUTION_OPTIONS = ['720p', '1080p', '2K', '4K'];
const ENHANCEMENT_OPTIONS = ['Standard', 'Face Detail', 'Noise Reduction', 'Sharpen', 'Film Grain Remove'];

export default function UpscaleVideoPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [currentResolution, setCurrentResolution] = useState(null);
  const [scale, setScale] = useState('2x');
  const [targetResolution, setTargetResolution] = useState('1080p');
  const [enhancement, setEnhancement] = useState('Standard');
  const [fpsEnhancement, setFpsEnhancement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setCurrentResolution('720p');
    } else {
      setVideoFile(null);
      setVideoPreview(null);
      setCurrentResolution(null);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video to upscale');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Video upscaling started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 4000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: `Upscaled to ${targetResolution}`,
          type: 'video'
        }]);
        toast.success('Demo: Video upscaled!');
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
        title="VIDEO UPSCALE"
        subtitle="Enhance any video to HD or 4K resolution with AI"
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
                    {currentResolution}
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
                    <p className="text-sm font-medium text-white">Upload video to upscale</p>
                    <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <SectionLabel>Scale</SectionLabel>
              <StudioDropdown options={SCALE_OPTIONS} value={scale} onChange={setScale} />
            </div>

            <div>
              <SectionLabel>Target Resolution</SectionLabel>
              <StudioDropdown options={RESOLUTION_OPTIONS} value={targetResolution} onChange={setTargetResolution} />
            </div>

            <div>
              <SectionLabel>Enhancement</SectionLabel>
              <StudioDropdown options={ENHANCEMENT_OPTIONS} value={enhancement} onChange={setEnhancement} />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFpsEnhancement(!fpsEnhancement)}
                className={`w-12 h-6 rounded-full transition-all ${fpsEnhancement ? 'bg-[#6366f1]' : 'bg-[#1a1a1a]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${fpsEnhancement ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-[#888]">FPS enhancement (24→60fps)</span>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Upscale Video
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}