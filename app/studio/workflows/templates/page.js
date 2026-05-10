'use client';

import { useState } from 'react';
import { LayoutTemplate, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const CATEGORIES = ['All', 'Image Pipelines', 'Video Pipelines', 'Marketing', 'Content Creation', 'Audio', 'Social Media', 'Advanced'];
const TEMPLATES = [
  { name: 'Instant Portrait', category: 'Image Pipelines', desc: 'Upload photo → AI headshot style', nodes: 4, usage: 2840 },
  { name: 'Product Launch Video', category: 'Video Pipelines', desc: 'Generate showcase reel from product images', nodes: 7, usage: 1950 },
  { name: 'UGC Ad Generator', category: 'Marketing', desc: 'Script → hook → video → caption', nodes: 9, usage: 3200 },
  { name: 'Bulk Image Variants', category: 'Image Pipelines', desc: 'One prompt → 20 variations', nodes: 3, usage: 4100 },
  { name: 'Cinematic Script to Video', category: 'Video Pipelines', desc: 'Script → scenes → storyboard → video', nodes: 12, usage: 1680 },
  { name: 'Podcast Clip Maker', category: 'Content Creation', desc: 'Audio → transcript → clips → captions', nodes: 6, usage: 2250 },
  { name: 'Music Visualizer', category: 'Audio', desc: 'Audio file → animated visuals', nodes: 5, usage: 890 },
  { name: 'Viral Tweet Generator', category: 'Social Media', desc: 'Topic → hooks → tweet → image', nodes: 8, usage: 3100 },
];

export default function WorkflowTemplatesPage() {
  const [category, setCategory] = useState('All');

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={LayoutTemplate} title="WORKFLOW TEMPLATES" subtitle="Start instantly from pre-built workflow templates" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${category === c ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{c}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
          {TEMPLATES.filter(t => category === 'All' || t.category === category).map((t, i) => (
            <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-white font-semibold">{t.name}</h4>
                  <p className="text-[#555] text-xs mt-0.5">{t.desc}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{t.category}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] text-[#444]">{t.nodes} nodes · {t.usage.toLocaleString()} uses</span>
                <button onClick={() => toast.success(`Template "${t.name}" loaded!`)} className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] transition-all flex items-center gap-1"><Play size={12} /> Use Template</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}