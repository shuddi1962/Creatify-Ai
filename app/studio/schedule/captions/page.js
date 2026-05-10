'use client';

import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter'];
const TONES = ['Casual', 'Professional', 'Humorous', 'Inspirational', 'Bold'];
const LENGTHS = ['Short', 'Medium', 'Long'];
const HASHTAG_COUNTS = ['5', '10', '15', '20', '25'];

export default function CaptionsPage() {
  const [asset, setAsset] = useState(null);
  const [assetPreview, setAssetPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['TikTok']);
  const [tone, setTone] = useState('Casual');
  const [length, setLength] = useState('Medium');
  const [hashtags, setHashtags] = useState(true);
  const [hashtagCount, setHashtagCount] = useState('10');
  const [emoji, setEmoji] = useState(true);
  const [cta, setCta] = useState(true);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleAsset = (file) => { setAsset(file); setAssetPreview(URL.createObjectURL(file)); };
  const togglePlatform = (p) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const generate = () => {
    if (!description.trim() && !asset) { toast.error('Upload asset or enter description'); return; }
    setLoading(true);
    setTimeout(() => {
      setCaptions([
        { text: '🚀 Just dropped something you need to see. Tap the link and don\'t sleep on this! #trending #fyp #viral #foryou', platform: 'TikTok' },
        { text: '✨ Big things coming. This is just the beginning — stay tuned for more. #newrelease #behindthescenes #sneakpeek', platform: 'TikTok' },
        { text: '💡 Problem solved. Here\'s what nobody tells you about getting results faster. Save this for later! #tips #productivity #growth', platform: 'TikTok' },
      ]);
      setLoading(false);
      toast.success('Captions generated!');
    }, 2500);
  };

  const copyCaption = (idx, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={FileText} title="AI CAPTION GENERATOR" subtitle="Generate engaging captions and trending hashtags for any post" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div>
              <SectionLabel>Upload Asset or Describe Content</SectionLabel>
              <UploadZone onFile={handleAsset} accept="image/*,video/*" label="Upload asset (optional)" preview={assetPreview} icon={FileText} />
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Or describe your content here..." className="w-full mt-3 h-20 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]" />
            </div>

            <div>
              <SectionLabel>Platforms</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => togglePlatform(p)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedPlatforms.includes(p) ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <SectionLabel>Tone</SectionLabel>
                <div className="flex gap-2 flex-wrap">
                  {TONES.map(t => (
                    <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tone === t ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Length</SectionLabel>
                <div className="flex gap-2">
                  {LENGTHS.map(l => (
                    <button key={l} onClick={() => setLength(l)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${length === l ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <SectionLabel>Include Hashtags</SectionLabel>
                <div className="flex gap-2 mt-2">
                  {HASHTAG_COUNTS.map(n => (
                    <button key={n} onClick={() => setHashtagCount(n)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${hashtagCount === n ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={emoji} onChange={e => setEmoji(e.target.checked)} className="w-4 h-4 accent-[#CCFF00]" /><span className="text-[#888] text-sm">Include emojis</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={cta} onChange={e => setCta(e.target.checked)} className="w-4 h-4 accent-[#CCFF00]" /><span className="text-[#888] text-sm">Include CTA</span></label>
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="flex justify-end">
          <button onClick={generate} disabled={loading} className="px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 transition-all flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : null}
            Generate Captions
          </button>
        </div>

        {captions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-bold">{captions.length} Caption Variants</h3>
            {captions.map((cap, i) => (
              <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4">
                <p className="text-[#ccc] text-sm leading-relaxed mb-3">{cap.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#7C3AED] px-2 py-0.5 bg-[#7C3AED]/20 rounded">{cap.platform}</span>
                  <span className="text-[10px] text-[#555]">{cap.text.length} chars</span>
                  <button onClick={() => copyCaption(i, cap.text)} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white flex items-center gap-1 transition-all">{copiedIdx === i ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}