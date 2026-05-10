'use client';

import { useState } from 'react';
import { Sun, Upload, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import UploadZone from '@/components/studio/UploadZone';
import GenerateButton from '@/components/studio/GenerateButton';

const CATEGORIES = ['Natural Light', 'Studio', 'Cinematic', 'Neon & Artificial', 'Time of Day', 'Weather'];
const PRESETS = [
  { name: 'Golden Hour', category: 'Time of Day', desc: 'Warm sunset lighting', url: 'https://picsum.photos/seed/golden/300/180' },
  { name: 'Blue Hour', category: 'Time of Day', desc: 'Cool twilight tones', url: 'https://picsum.photos/seed/blue/300/180' },
  { name: 'Soft Box', category: 'Studio', desc: 'Even diffused light', url: 'https://picsum.photos/seed/softbox/300/180' },
  { name: 'Rembrandt', category: 'Studio', desc: 'Classic portrait lighting', url: 'https://picsum.photos/seed/rembrandt/300/180' },
  { name: 'Film Noir', category: 'Cinematic', desc: 'High contrast dramatic', url: 'https://picsum.photos/seed/filmnoir/300/180' },
  { name: 'Neon Glow', category: 'Neon & Artificial', desc: 'Vibrant neon colors', url: 'https://picsum.photos/seed/neon/300/180' },
  { name: 'Overcast', category: 'Weather', desc: 'Soft outdoor diffuse', url: 'https://picsum.photos/seed/overcast/300/180' },
  { name: 'Rainy Mood', category: 'Weather', desc: 'Wet reflective surfaces', url: 'https://picsum.photos/seed/rainy/300/180' },
];

export default function LightingPage() {
  const [category, setCategory] = useState('Natural Light');
  const [applyPreset, setApplyPreset] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);

  const handleUpload = (file) => { setUploadImage(file); setUploadPreview(URL.createObjectURL(file)); };

  const handleApply = (preset) => setApplyPreset(preset);

  const handleGenerate = () => {
    if (!uploadImage) { toast.error('Upload an image first'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Image generated with lighting!'); }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Sun} title="LIGHTING PRESETS" subtitle="Apply professional lighting setups to any scene instantly" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-nowrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${category === c ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {PRESETS.filter(p => p.category === category).map((preset, i) => (
            <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden">
              <img src={preset.url} className="w-full aspect-video object-cover" alt="" />
              <div className="p-3">
                <h4 className="text-white font-semibold text-sm mb-1">{preset.name}</h4>
                <p className="text-[#555] text-xs mb-3">{preset.desc}</p>
                <button onClick={() => handleApply(preset.name)} className="w-full px-3 py-2 bg-[#1a1a1a] text-[#CCFF00] text-xs font-semibold rounded-lg hover:bg-[#222] transition-all">Apply Preset</button>
              </div>
            </div>
          ))}
        </div>

        {applyPreset && (
          <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
            <h3 className="text-white font-bold mb-4">Apply {applyPreset} — Upload Image</h3>
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Upload Image</label>
              <UploadZone onFile={handleUpload} accept="image/*" label="Upload image to apply lighting" preview={uploadPreview} icon={Upload} />
            </div>
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Model</label>
              <select value={model} onChange={e => setModel(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none">
                <option>flux</option><option>flux-pro</option><option>juggernaut</option>
              </select>
            </div>
            <div className="flex justify-end">
              <GenerateButton onClick={handleGenerate} loading={loading}>Generate</GenerateButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}