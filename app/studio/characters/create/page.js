'use client';

import { useState } from 'react';
import { UserPlus, Check } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

const TYPES = ['Real Person', 'Fictional', 'Cartoon', 'Anime', '3D', 'Fantasy'];
const AGE_RANGES = ['18-25', '25-35', '35-45', '45-55', '55+', 'Any'];
const GENDERS = ['Male', 'Female', 'Non-binary', 'Any'];

export default function CreateCharacterPage() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Real Person');
  const [ageRange, setAgeRange] = useState('25-35');
  const [gender, setGender] = useState('Any');
  const [traits, setTraits] = useState('');
  const [outfit, setOutfit] = useState('');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const handleUpload = (file) => {
    if (previews.length >= 5) { toast.error('Max 5 images'); return; }
    const newPreviews = [...previews, URL.createObjectURL(file)];
    setPreviews(newPreviews);
    setFiles([...files, file]);
  };

  const removeImage = (idx) => {
    setPreviews(previews.filter((_, i) => i !== idx));
    setFiles(files.filter((_, i) => i !== idx));
  };

  const createCharacter = () => {
    if (previews.length < 2) { toast.error('Upload at least 2 face photos'); return; }
    if (!name.trim()) { toast.error('Enter a character name'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCreated(true);
      toast.success('Character created!');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={UserPlus} title="CREATE YOUR CHARACTER" subtitle="Build a reusable Soul ID character with consistent appearance" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        {!created ? (
          <>
            <GenerationPanel>
              <div className="space-y-5">
                <div>
                  <SectionLabel>Upload 2-5 Clear Face Photos (for best consistency)</SectionLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {previews.map((src, i) => (
                      <div key={i} className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-1 bg-[#0a0a0a]">
                        <img src={src} className="w-full aspect-square object-cover rounded-lg" alt="" />
                        <button onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">×</button>
                      </div>
                    ))}
                    {previews.length < 5 && <UploadZone onFile={handleUpload} accept="image/*" label="Add" icon={UserPlus} />}
                  </div>
                </div>
                <div>
                  <SectionLabel>Character Name</SectionLabel>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah, The Explorer, Cyber Cop" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
                </div>
                <div>
                  <SectionLabel>Character Type</SectionLabel>
                  <div className="flex gap-2 flex-wrap">
                    {TYPES.map(t => (
                      <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${type === t ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <SectionLabel>Age Range</SectionLabel>
                    <div className="flex gap-2 flex-wrap">
                      {AGE_RANGES.map(a => (
                        <button key={a} onClick={() => setAgeRange(a)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${ageRange === a ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{a}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Gender Expression</SectionLabel>
                    <div className="flex gap-2 flex-wrap">
                      {GENDERS.map(g => (
                        <button key={g} onClick={() => setGender(g)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${gender === g ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{g}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <SectionLabel>Key Traits</SectionLabel>
                  <textarea value={traits} onChange={e => setTraits(e.target.value)} placeholder="e.g. Confident, warm smile, blue eyes, curly hair..." className="w-full h-20 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]" />
                </div>
                <div>
                  <SectionLabel>Default Outfit Description</SectionLabel>
                  <textarea value={outfit} onChange={e => setOutfit(e.target.value)} placeholder="e.g. Casual streetwear: white tee, denim jacket, sneakers" className="w-full h-20 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]" />
                </div>
              </div>
            </GenerationPanel>
            <div className="flex justify-end">
              <GenerateButton onClick={createCharacter} loading={loading}>Create Character</GenerateButton>
            </div>
          </>
        ) : (
          <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6 text-center">
            <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} className="text-[#10B981]" /></div>
            <h3 className="text-white font-bold text-xl mb-2">Character Created!</h3>
            <p className="text-[#666] text-sm mb-6">{name} is ready to use in any generation</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {previews.map((src, i) => <img key={i} src={src} className="w-full aspect-square object-cover rounded-lg" alt="" />)}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setCreated(false); setName(''); setPreviews([]); setFiles([]); }} className="px-6 py-3 bg-[#1a1a1a] text-[#888] font-semibold rounded-xl hover:text-white">Create Another</button>
              <button onClick={() => toast.success('Saved to library!')} className="px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00]">Save to Library</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}