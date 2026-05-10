'use client';

import { useState } from 'react';
import { Sticker, Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

const STYLES = ['Cutout', 'Cartoon', 'Neon', '3D', 'Sketch'];

export default function StickersPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [style, setStyle] = useState('Cutout');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleUpload = (file) => { setImage(file); setPreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!image) { toast.error('Upload an image'); return; }
    setLoading(true);
    setTimeout(() => {
      setResults(Array.from({ length: 4 }, (_, i) => `https://picsum.photos/seed/stick${i}/200/200`));
      setLoading(false);
      toast.success('4 stickers generated!');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Sticker} title="STICKER GENERATOR" subtitle="Create custom stickers from any photo" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div>
              <SectionLabel>Upload Image</SectionLabel>
              <UploadZone onFile={handleUpload} accept="image/*" label="Upload image" preview={preview} icon={Upload} />
            </div>
            <div>
              <SectionLabel>Sticker Style</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                {STYLES.map(s => (
                  <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${style === s ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={generate} loading={loading}>Generate Stickers</GenerateButton>
        </div>
        {results.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {results.map((url, i) => (
              <div key={i} className="bg-[#111111] rounded-xl p-2">
                <img src={url} className="w-full aspect-square rounded-lg" alt="" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}