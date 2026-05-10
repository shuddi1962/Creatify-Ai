'use client';

import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

const ANGLES = ['1', '3', '5', '7', '9'];

export default function AnglesPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [angleCount, setAngleCount] = useState('5');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleUpload = (file) => { setImage(file); setPreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!image) { toast.error('Upload an image'); return; }
    setLoading(true);
    setTimeout(() => {
      const imgs = Array.from({ length: parseInt(angleCount) }, (_, i) => `https://picsum.photos/seed/angle${i}/300/200`);
      setResults(imgs);
      setLoading(false);
      toast.success(`${angleCount} camera angles generated!`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Camera} title="CAMERA ANGLES" subtitle="Generate multiple camera angles from a single image" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div>
              <SectionLabel>Upload Image</SectionLabel>
              <UploadZone onFile={handleUpload} accept="image/*" label="Upload image" preview={preview} icon={Camera} />
            </div>
            <div>
              <SectionLabel>Number of Angles</SectionLabel>
              <div className="flex gap-2">
                {ANGLES.map(n => (
                  <button key={n} onClick={() => setAngleCount(n)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${angleCount === n ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{n} angles</button>
                ))}
              </div>
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={generate} loading={loading}>Generate Angles</GenerateButton>
        </div>
        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {results.map((url, i) => <img key={i} src={url} className="w-full rounded-xl" alt="" />)}
          </div>
        )}
      </div>
    </div>
  );
}