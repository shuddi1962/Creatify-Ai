'use client';

import { useState } from 'react';
import { Sparkles, Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

const EFFECTS = ['Glitch', 'Chromatic', 'VHS', 'Blur', 'Pixelate', 'Neon'];

export default function EffectsPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [effect, setEffect] = useState('Glitch');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = (file) => { setImage(file); setPreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!image) { toast.error('Upload an image'); return; }
    setLoading(true);
    setTimeout(() => { setResult('https://picsum.photos/seed/effectresult/600/400'); setLoading(false); toast.success('Effect applied!'); }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Sparkles} title="EFFECTS PACK" subtitle="Apply professional VFX effects to any image" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div>
              <SectionLabel>Upload Image</SectionLabel>
              <UploadZone onFile={handleUpload} accept="image/*" label="Upload image" preview={preview} icon={Upload} />
            </div>
            <div>
              <SectionLabel>Effect</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                {EFFECTS.map(e => (
                  <button key={e} onClick={() => setEffect(e)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${effect === e ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{e}</button>
                ))}
              </div>
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={generate} loading={loading}>Apply Effect</GenerateButton>
        </div>
        {result && <img src={result} className="w-full rounded-xl" alt="" />}
      </div>
    </div>
  );
}