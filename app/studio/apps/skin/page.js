'use client';

import { useState } from 'react';
import { Sparkles, Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

const LEVELS = ['Light', 'Medium', 'Strong'];

export default function SkinPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [level, setLevel] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = (file) => { setImage(file); setPreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!image) { toast.error('Upload an image'); return; }
    setLoading(true);
    setTimeout(() => { setResult('https://picsum.photos/seed/skinresult/600/400'); setLoading(false); toast.success('Skin enhanced!'); }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Sparkles} title="SKIN ENHANCER" subtitle="AI-powered professional skin retouching" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div>
              <SectionLabel>Upload Portrait</SectionLabel>
              <UploadZone onFile={handleUpload} accept="image/*" label="Upload portrait" preview={preview} icon={Upload} />
            </div>
            <div>
              <SectionLabel>Enhancement Level</SectionLabel>
              <div className="flex gap-2">
                {LEVELS.map(l => (
                  <button key={l} onClick={() => setLevel(l)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${level === l ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={generate} loading={loading}>Enhance Skin</GenerateButton>
        </div>
        {result && <img src={result} className="w-full rounded-xl" alt="" />}
      </div>
    </div>
  );
}