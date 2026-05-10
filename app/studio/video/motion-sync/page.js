'use client';

import { useState } from 'react';
import { Upload, Video } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const TRANSFER_TYPES = ['Body Movement', 'Head Movement', 'Camera Movement', 'Full Scene'];
const PRESERVE_OPTIONS = ['Background', 'Lighting', 'Both'];

export default function MotionSyncPage() {
  const [referenceVideo, setReferenceVideo] = useState(null);
  const [referencePreview, setReferencePreview] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [targetPreview, setTargetPreview] = useState(null);
  const [transferType, setTransferType] = useState('Body Movement');
  const [syncStrength, setSyncStrength] = useState(75);
  const [preserve, setPreserve] = useState('Both');
  const [model, setModel] = useState('seedance-2');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleReferenceUpload = (file) => {
    if (file) {
      setReferenceVideo(file);
      setReferencePreview(URL.createObjectURL(file));
    } else {
      setReferenceVideo(null);
      setReferencePreview(null);
    }
  };

  const handleTargetUpload = (file) => {
    if (file) {
      setTargetFile(file);
      setTargetPreview(URL.createObjectURL(file));
    } else {
      setTargetFile(null);
      setTargetPreview(null);
    }
  };

  const handleGenerate = async () => {
    if (!referenceVideo || !targetFile) {
      toast.error('Please upload both reference video and target');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Motion sync started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: `Motion: ${transferType}`,
          type: 'video'
        }]);
        toast.success('Demo: Motion synced!');
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
        title="MOTION SYNC"
        subtitle="Transfer motion patterns from a reference video to your subject"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Reference Video</SectionLabel>
                {referencePreview ? (
                  <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                    <video src={referencePreview} controls className="w-full h-32 object-cover rounded-lg" />
                    <button
                      onClick={() => handleReferenceUpload(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                      <Video size={20} className="text-[#666]" />
                    </div>
                    <p className="text-xs font-medium text-white">Upload reference video</p>
                    <input type="file" accept="video/*" onChange={(e) => handleReferenceUpload(e.target.files?.[0])} className="hidden" />
                  </label>
                )}
              </div>
              <div>
                <SectionLabel>Target Image/Video</SectionLabel>
                {targetPreview ? (
                  <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                    {targetFile?.type?.startsWith('video') ? (
                      <video src={targetPreview} controls className="w-full h-32 object-cover rounded-lg" />
                    ) : (
                      <img src={targetPreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    )}
                    <button
                      onClick={() => handleTargetUpload(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                      <Upload size={20} className="text-[#666]" />
                    </div>
                    <p className="text-xs font-medium text-white">Upload target</p>
                    <input type="file" accept="image/*,video/*" onChange={(e) => handleTargetUpload(e.target.files?.[0])} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div>
              <SectionLabel>Motion Transfer Type</SectionLabel>
              <PillSelector options={TRANSFER_TYPES} value={transferType} onChange={setTransferType} />
            </div>

            <div>
              <SectionLabel>Sync Strength: {syncStrength}%</SectionLabel>
              <input
                type="range"
                min="0"
                max="100"
                value={syncStrength}
                onChange={(e) => setSyncStrength(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer mt-2"
              />
            </div>

            <div>
              <SectionLabel>Preserve</SectionLabel>
              <PillSelector options={PRESERVE_OPTIONS} value={preserve} onChange={setPreserve} />
            </div>

            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector type="video" value={model} onChange={setModel} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Sync Motion
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}