'use client';

import { useState } from 'react';
import { Bot, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const CATEGORIES = ['Content Creation', 'Marketing', 'Social Media', 'Bulk Generation', 'Research', 'Custom'];
const TEMPLATES = [
  { name: 'Daily Hook Generator', category: 'Content Creation', desc: 'Generate 10 viral hooks every morning', trigger: 'Schedule', actions: ['Hook Generation', 'Caption Writing'] },
  { name: 'UGC Ad Pipeline', category: 'Marketing', desc: 'URL → script → video → caption', trigger: 'Webhook', actions: ['URL Analysis', 'Script Gen', 'Video Gen'] },
  { name: 'Bulk Image Variants', category: 'Bulk Generation', desc: 'One prompt → 50 image variations', trigger: 'Manual', actions: ['Image Gen', 'Upscale', 'Export'] },
  { name: 'Competitor Watcher', category: 'Research', desc: 'Track and analyze competitor content daily', trigger: 'Schedule', actions: ['Scrape', 'Analysis', 'Report'] },
  { name: 'Podcast Clipper', category: 'Content Creation', desc: 'Long audio → clip-ready social posts', trigger: 'Webhook', actions: ['Transcribe', 'Clip Select', 'Caption Gen'] },
  { name: 'Product Review Bot', category: 'Marketing', desc: 'Auto-generate product review content', trigger: 'Webhook', actions: ['Data Fetch', 'Script Gen', 'Thumbnail'] },
];

export default function AgentTemplatesPage() {
  const [category, setCategory] = useState('All');

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Zap} title="AGENT TEMPLATES" subtitle="Start from a pre-built agent template" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setCategory('All')} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${category === 'All' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>All</button>
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
              <div className="flex flex-wrap gap-1 mb-3 mt-2">
                <span className="text-[10px] px-2 py-0.5 bg-[#1a1a1a] text-[#555] rounded">{t.trigger}</span>
                {t.actions.map(a => <span key={a} className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{a}</span>)}
              </div>
              <button onClick={() => toast.success(`Template "${t.name}" loaded!`)} className="w-full px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] flex items-center justify-center gap-1 transition-all"><Zap size={12} /> Use Template</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}