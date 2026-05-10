'use client';

import { useState } from 'react';
import { UserCog, Upload, Search } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

const SAMPLE_CHARACTERS = [
  { id: 1, name: 'Sarah', avatar: 'https://picsum.photos/seed/s1/100' },
  { id: 2, name: 'The Explorer', avatar: 'https://picsum.photos/seed/s2/100' },
  { id: 3, name: 'Mia', avatar: 'https://picsum.photos/seed/s3/100' },
];

const DETECTION_MODES = ['Auto', 'Manual'];
const TABS = ['My Characters', 'Upload New', 'Describe'];

export default function SwapPage() {
  const [tab, setTab] = useState('My Characters');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [replacementImage, setReplacementImage] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState(null);
  const [selectedChar, setSelectedChar] = useState(null);
  const [detection, setDetection] = useState('Auto');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVideoUpload = (file) => {
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleReplacementUpload = (file) => {
    setReplacementImage(file);
    setReplacementPreview(URL.createObjectURL(file));
  };

  const handleSwap = () => {
    if (!videoFile) { toast.error('Upload a video first'); return; }
    if (tab === 'My Characters' && !selectedChar) { toast.error('Select a replacement character'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Character swapped!'); }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={UserCog} title="CHARACTER SWAP" subtitle="Replace or swap characters inside any existing video" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div>
              <SectionLabel>Upload Video with Character to Replace</SectionLabel>
              <UploadZone onFile={handleVideoUpload} accept="video/*" label="Upload video" preview={videoPreview} icon={Upload} />
            </div>
            <div>
              <SectionLabel>Detection Mode</SectionLabel>
              <div className="flex gap-2">
                {DETECTION_MODES.map(m => (
                  <button key={m} onClick={() => setDetection(m)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${detection === m ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Replacement</SectionLabel>
              <div className="flex gap-2 mb-4">
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{t}</button>
                ))}
              </div>
              {tab === 'My Characters' && (
                <div className="grid grid-cols-3 gap-3">
                  {SAMPLE_CHARACTERS.map(c => (
                    <div key={c.id} onClick={() => setSelectedChar(c.id)} className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedChar === c.id ? 'border-[#CCFF00] bg-[#CCFF00]/10' : 'border-white/[0.08] bg-[#0a0a0a] hover:border-[#333]'}`}>
                      <img src={c.avatar} className="w-full aspect-square object-cover rounded-lg mb-2" alt="" />
                      <span className="text-xs text-[#888]">{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'Upload New' && (
                <UploadZone onFile={handleReplacementUpload} accept="image/*" label="Upload replacement face" preview={replacementPreview} icon={Upload} />
              )}
              {tab === 'Describe' && (
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the character you want to use..." className="w-full h-24 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]" />
              )}
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={handleSwap} loading={loading}>Swap Character</GenerateButton>
        </div>
      </div>
    </div>
  );
}