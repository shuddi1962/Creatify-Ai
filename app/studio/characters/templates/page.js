'use client';

import { useState } from 'react';
import { LayoutTemplate, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const CATEGORIES = ['Urban', 'Nature', 'Interior', 'Fantasy', 'Sci-Fi', 'Historical', 'Abstract', 'Studio'];
const TEMPLATES = [
  { name: 'City Street', category: 'Urban', desc: 'Downtown urban environment', nodes: 5, url: 'https://picsum.photos/seed/city/400/225' },
  { name: 'Tropical Beach', category: 'Nature', desc: 'Sunny beach paradise', nodes: 4, url: 'https://picsum.photos/seed/beach/400/225' },
  { name: 'Modern Office', category: 'Interior', desc: 'Contemporary workspace', nodes: 6, url: 'https://picsum.photos/seed/office/400/225' },
  { name: 'Enchanted Forest', category: 'Fantasy', desc: 'Magical woodland scene', nodes: 7, url: 'https://picsum.photos/seed/forest/400/225' },
  { name: 'Space Station', category: 'Sci-Fi', desc: 'Futuristic orbital base', nodes: 8, url: 'https://picsum.photos/seed/space/400/225' },
  { name: 'Ancient Ruins', category: 'Historical', desc: 'Weathered stone temple', nodes: 5, url: 'https://picsum.photos/seed/ruins/400/225' },
  { name: 'Neon Void', category: 'Abstract', desc: 'Surreal light installation', nodes: 4, url: 'https://picsum.photos/seed/neonvoid/400/225' },
  { name: 'White Studio', category: 'Studio', desc: 'Clean infinite white', nodes: 3, url: 'https://picsum.photos/seed/white/400/225' },
];

export default function TemplatesPage() {
  const [category, setCategory] = useState('All');

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={LayoutTemplate} title="SCENE TEMPLATES" subtitle="Ready-made world and location templates for fast scene setup" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setCategory('All')} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${category === 'All' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>All</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${category === c ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
          {TEMPLATES.filter(t => category === 'All' || t.category === category).map((t, i) => (
            <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden">
              <img src={t.url} className="w-full aspect-video object-cover" alt="" />
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h4 className="text-white font-semibold">{t.name}</h4>
                    <p className="text-[#555] text-xs mt-0.5">{t.desc}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{t.category}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-[#444]">{t.nodes} nodes</span>
                  <button onClick={() => toast.success(`Template "${t.name}" applied!`)} className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] transition-all flex items-center gap-1"><Play size={12} /> Use Template</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}