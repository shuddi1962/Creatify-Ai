'use client';

import { useState } from 'react';
import { Image, Download, TestTube } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import UploadZone from '@/components/studio/UploadZone';
import GenerateButton from '@/components/studio/GenerateButton';

const PLATFORMS = ['YouTube', 'TikTok', 'Instagram', 'LinkedIn'];
const STYLES = ['Clickbait', 'Educational', 'Minimalist', 'Bold Text', 'Face Reaction', 'Split'];
const NUM_OPTIONS = ['3', '5', '8', '10'];

export default function ThumbnailsPage() {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [style, setStyle] = useState('Bold Text');
  const [numThumbs, setNumThumbs] = useState('5');
  const [faceImage, setFaceImage] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [brandKit, setBrandKit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFaceUpload = (file) => {
    if (file) {
      setFaceImage(file);
      setFacePreview(URL.createObjectURL(file));
    }
  };

  const generate = () => {
    if (!title.trim()) { toast.error('Enter a video title'); return; }
    setLoading(true);
    setTimeout(() => {
      const thumbs = Array.from({ length: parseInt(numThumbs) }, (_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/seed/thumb${Date.now() + i}/640/360`,
        label: `Variant ${i + 1}`,
      }));
      setResults(thumbs);
      setLoading(false);
      toast.success(`${numThumbs} thumbnails generated!`);
    }, 3000);
  };

  const handleDownload = (id) => toast.success('Download started!');
  const handleUse = (id) => toast.success('Thumbnail selected!');

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Image} title="THUMBNAIL GENERATOR" subtitle="Generate 5 AI thumbnail variants for any content idea" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div>
              <SectionLabel>Video Title</SectionLabel>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. I Tried the 30-Day Challenge and Here's What Happened" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] focus:outline-none focus:border-[#6366f1]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Platform</SectionLabel>
                <div className="flex gap-2 flex-wrap">
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => setPlatform(p)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${platform === p ? 'bg-[#6366f1] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Style</SectionLabel>
                <div className="flex gap-2 flex-wrap">
                  {STYLES.map(s => (
                    <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${style === s ? 'bg-[#6366f1] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Face Photo (Optional)</SectionLabel>
                <UploadZone onFile={handleFaceUpload} accept="image/*" label="Upload face photo" preview={facePreview} icon={Image} />
              </div>
              <div>
                <SectionLabel>Number of Thumbnails</SectionLabel>
                <div className="flex gap-2 mt-8">
                  {NUM_OPTIONS.map(n => (
                    <button key={n} onClick={() => setNumThumbs(n)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${numThumbs === n ? 'bg-[#6366f1] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{n}</button>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={brandKit} onChange={e => setBrandKit(e.target.checked)} className="w-4 h-4 accent-[#CCFF00]" />
                    <span className="text-[#888] text-sm">Apply brand kit colors</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={generate} loading={loading}>Generate Thumbnails</GenerateButton>
        </div>

        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Generated Thumbnails</h3>
              <div className="flex items-center gap-2">
                <span className="text-[#555] text-xs">A/B Test:</span>
                <button className="px-3 py-1 bg-[#1a1a1a] text-[#888] text-xs rounded-lg border border-white/[0.08]">Compare</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {results.map(thumb => (
                <div key={thumb.id} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden">
                  <img src={thumb.url} alt={thumb.label} className="w-full aspect-video object-cover" />
                  <div className="p-3 flex gap-2">
                    <button onClick={() => handleUse(thumb.id)} className="flex-1 px-3 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] transition-all">Use This</button>
                    <button onClick={() => handleDownload(thumb.id)} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><Download size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}