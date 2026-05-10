'use client';

import { useState } from 'react';
import { User, Upload, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

export default function FaceSwapPage() {
  const [sourceImg, setSourceImg] = useState(null);
  const [sourcePreview, setSourcePreview] = useState(null);
  const [targetImg, setTargetImg] = useState(null);
  const [targetPreview, setTargetPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSource = (file) => { setSourceImg(file); setSourcePreview(URL.createObjectURL(file)); };
  const handleTarget = (file) => { setTargetImg(file); setTargetPreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!sourceImg || !targetImg) { toast.error('Upload both images'); return; }
    setLoading(true);
    setTimeout(() => { setResult('https://picsum.photos/seed/faceresult/600/400'); setLoading(false); toast.success('Face swap complete!'); }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={User} title="FACE SWAP" subtitle="Swap faces between two images instantly" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SectionLabel>Source Face (The face you want to use)</SectionLabel>
              <UploadZone onFile={handleSource} accept="image/*" label="Upload source face" preview={sourcePreview} icon={User} />
            </div>
            <div>
              <SectionLabel>Target Image (Where to place the face)</SectionLabel>
              <UploadZone onFile={handleTarget} accept="image/*" label="Upload target image" preview={targetPreview} icon={Upload} />
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={generate} loading={loading}>Swap Face</GenerateButton>
        </div>
        {result && (
          <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
            <img src={result} className="w-full rounded-xl mb-4" alt="" />
            <div className="flex gap-3">
              <button onClick={() => toast.success('Downloading...')} className="flex-1 px-4 py-2 bg-[#1a1a1a] text-white text-sm rounded-lg hover:bg-[#222]">Download</button>
              <button onClick={() => toast.success('Sharing...')} className="flex-1 px-4 py-2 bg-[#CCFF00] text-black font-bold text-sm rounded-lg hover:bg-[#B8FF00]">Share</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}