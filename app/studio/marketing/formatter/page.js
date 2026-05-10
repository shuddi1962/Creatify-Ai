'use client';

import { useState } from 'react';
import { Smartphone, Download, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', ratio: '9:16', label: '9:16' },
  { id: 'instagram-feed', name: 'Instagram Feed', ratio: '1:1', label: '1:1' },
  { id: 'instagram-reel', name: 'Instagram Reel', ratio: '9:16', label: '9:16' },
  { id: 'youtube', name: 'YouTube', ratio: '16:9', label: '16:9' },
  { id: 'youtube-short', name: 'YouTube Short', ratio: '9:16', label: '9:16' },
  { id: 'twitter', name: 'Twitter/X', ratio: '16:9', label: '16:9' },
  { id: 'linkedin', name: 'LinkedIn', ratio: '1.91:1', label: '1.91:1' },
  { id: 'facebook', name: 'Facebook', ratio: '1:1', label: '1:1' },
  { id: 'pinterest', name: 'Pinterest', ratio: '2:3', label: '2:3' },
  { id: 'snapchat', name: 'Snapchat', ratio: '9:16', label: '9:16' },
];
const CROP_MODES = ['Smart Crop', 'Center', 'Custom'];
const BG_FILLS = ['Blur', 'Black', 'White', 'Brand Color', 'Mirror'];

export default function MarketingFormatterPage() {
  const [file, setFile] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['tiktok', 'instagram-reel', 'youtube']);
  const [cropMode, setCropMode] = useState('Smart Crop');
  const [bgFill, setBgFill] = useState('Blur');
  const [captions, setCaptions] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('tiktok');

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!file) {
      toast.error('Please upload a video or image');
      return;
    }
    setLoading(true);
    toast.success('Generating all formats...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      const newResults = selectedPlatforms.map(p => ({
        id: p,
        platform: p,
        url: `https://picsum.photos/seed/${p}/720/1280`,
        type: 'image',
      }));
      setResults(newResults);
      if (newResults.length > 0) setActiveTab(newResults[0].platform);
      toast.success('All formats generated!');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = () => toast.success('Downloading ZIP...');

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Smartphone} title="FORMAT FOR EVERY PLATFORM" subtitle="Auto-resize and reformat your content to perfect dimensions per platform" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <UploadZone onFile={setFile} accept="video/*,image/*" label="Upload video or image to reformat" icon={ImageIcon} preview={file ? URL.createObjectURL(file) : null} />
            {file && (
              <>
                <div>
                  <SectionLabel>Target Platforms</SectionLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {PLATFORMS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className={`p-3 rounded-xl border transition-all ${
                          selectedPlatforms.includes(p.id)
                            ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white'
                            : 'border-white/[0.08] bg-[#0a0a0a] text-[#888]'
                        }`}
                      >
                        <p className="text-xs font-semibold">{p.name}</p>
                        <p className="text-[10px] text-[#555] mt-0.5">{p.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <SectionLabel>Crop Mode</SectionLabel>
                  <PillSelector options={CROP_MODES} value={cropMode} onChange={setCropMode} />
                </div>
                <div>
                  <SectionLabel>Background Fill</SectionLabel>
                  <PillSelector options={BG_FILLS} value={bgFill} onChange={setBgFill} />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setCaptions(!captions)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${captions ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white' : 'border-white/[0.08] bg-[#0a0a0a] text-[#888]'}`}>
                    Captions: {captions ? 'On' : 'Off'}
                  </button>
                  <button onClick={() => setWatermark(!watermark)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${watermark ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white' : 'border-white/[0.08] bg-[#0a0a0a] text-[#888]'}`}>
                    Watermark: {watermark ? 'On' : 'Off'}
                  </button>
                </div>
              </>
            )}
          </div>
        </GenerationPanel>
        <div className="flex justify-end gap-2">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate All Formats
          </GenerateButton>
        </div>
        {results.length > 0 && (
          <GenerationPanel>
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {results.map(r => (
                  <button
                    key={r.platform}
                    onClick={() => setActiveTab(r.platform)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      activeTab === r.platform ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'
                    }`}
                  >
                    {r.platform.replace('-', ' ')}
                  </button>
                ))}
              </div>
              <div className="relative rounded-xl overflow-hidden bg-[#0a0a0a]">
                <img src={results.find(r => r.platform === activeTab)?.url} alt="" className="w-full max-h-96 object-contain" />
                <button className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 bg-black/60 rounded-lg text-xs text-white hover:bg-black/80 transition-all">
                  <Download size={12} /> Download
                </button>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-[#888]">{selectedPlatforms.length} formats ready</p>
                <button onClick={handleDownloadAll} className="flex items-center gap-2 px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-xl hover:bg-[#B8FF00] transition-all">
                  <Download size={14} /> Download All as ZIP
                </button>
              </div>
            </div>
          </GenerationPanel>
        )}
      </div>
    </div>
  );
}