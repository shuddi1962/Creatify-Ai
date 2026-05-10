'use client';

import { useState } from 'react';
import { Calendar, Send, Image as ImageIcon, Hash, Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter', 'Pinterest'];
const CHARACTER_LIMITS = { TikTok: 150, Instagram: 2200, YouTube: 5000, LinkedIn: 3000, Twitter: 280, Pinterest: 500 };

export default function NewPostPage() {
  const [asset, setAsset] = useState(null);
  const [assetPreview, setAssetPreview] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['TikTok', 'Instagram']);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [date, setDate] = useState('2026-05-12');
  const [time, setTime] = useState('09:00');
  const [loading, setLoading] = useState(false);

  const togglePlatform = (p) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const generateHashtags = () => {
    const sample = '#ai #creativity #content #socialmedia #trending #fyp #viral';
    setHashtags(sample);
    toast.success('Hashtags generated!');
  };

  const handleSubmit = () => {
    if (selectedPlatforms.length === 0) { toast.error('Select at least one platform'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Post scheduled!'); }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Calendar} title="SCHEDULE NEW POST" subtitle="Create and schedule a post to any connected platform" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
          <div className="space-y-5">
            <div>
              <SectionLabel>Upload Asset or Pick from Media Library</SectionLabel>
              <UploadZone onFile={(file) => { setAsset(file); setAssetPreview(URL.createObjectURL(file)); }} accept="image/*,video/*" label="Upload image or video" preview={assetPreview} icon={Upload} />
            </div>

            <div>
              <SectionLabel>Platforms</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => togglePlatform(p)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedPlatforms.includes(p) ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SectionLabel>Caption</SectionLabel>
                <span className="text-[10px] text-[#444]">{caption.length}/{CHARACTER_LIMITS[selectedPlatforms[0]] || 2200}</span>
              </div>
              <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write your caption..." className="w-full h-32 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SectionLabel>Hashtags</SectionLabel>
                <button onClick={generateHashtags} className="text-[10px] text-[#CCFF00] hover:underline">Generate Hashtags</button>
              </div>
              <input value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#hashtag1 #hashtag2" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <SectionLabel>Date</SectionLabel>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none" />
              </div>
              <div>
                <SectionLabel>Time</SectionLabel>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => toast.success('Draft saved!')} className="flex-1 px-4 py-3 bg-[#1a1a1a] text-[#888] font-semibold rounded-xl hover:text-white transition-all">Save as Draft</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Send size={16} />}
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}