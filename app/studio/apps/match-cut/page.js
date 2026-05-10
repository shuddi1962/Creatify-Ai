'use client';

import { useState } from 'react';
import { Scissors, Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

export default function MatchCutPage() {
  const [clip1, setClip1] = useState(null);
  const [clip1Preview, setClip1Preview] = useState(null);
  const [clip2, setClip2] = useState(null);
  const [clip2Preview, setClip2Preview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClip1 = (file) => { setClip1(file); setClip1Preview(URL.createObjectURL(file)); };
  const handleClip2 = (file) => { setClip2(file); setClip2Preview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!clip1 || !clip2) { toast.error('Upload both clips'); return; }
    setLoading(true);
    setTimeout(() => { setResult('https://www.w3schools.com/html/mov_bbb.mp4'); setLoading(false); toast.success('Match cut created!'); }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Scissors} title="MATCH CUT" subtitle="Create seamless transitions between two clips" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SectionLabel>First Clip</SectionLabel>
              <UploadZone onFile={handleClip1} accept="video/*" label="Upload first clip" preview={clip1Preview} icon={Upload} />
            </div>
            <div>
              <SectionLabel>Second Clip</SectionLabel>
              <UploadZone onFile={handleClip2} accept="video/*" label="Upload second clip" preview={clip2Preview} icon={Upload} />
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={generate} loading={loading}>Create Match Cut</GenerateButton>
        </div>
        {result && <video src={result} controls className="w-full rounded-xl" />}
      </div>
    </div>
  );
}