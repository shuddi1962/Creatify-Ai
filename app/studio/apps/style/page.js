'use client';

import { useState } from 'react';
import { Palette, Heart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const APPS = [
  { name: 'Style Transfer', desc: 'Apply artistic styles to photos', badge: 'TOP', credits: 5, url: 'https://picsum.photos/seed/st/300/200' },
  { name: 'Color Grading', desc: 'Professional color correction', badge: null, credits: 4, url: 'https://picsum.photos/seed/cg/300/200' },
  { name: 'Film Grain', desc: 'Add authentic film grain texture', badge: null, credits: 2, url: 'https://picsum.photos/seed/fg/300/200' },
  { name: 'Vintage Filter', desc: 'Classic vintage photo look', badge: null, credits: 2, url: 'https://picsum.photos/seed/vf/300/200' },
  { name: 'Neon Effect', desc: 'Add vibrant neon glow effects', badge: null, credits: 3, url: 'https://picsum.photos/seed/ne/300/200' },
  { name: 'Anime Filter', desc: 'Transform into anime style', badge: null, credits: 4, url: 'https://picsum.photos/seed/af/300/200' },
  { name: 'Cartoon Filter', desc: 'Cartoon-style rendering', badge: null, credits: 3, url: 'https://picsum.photos/seed/cf/300/200' },
  { name: 'Sketch Effect', desc: 'Convert photo to pencil sketch', badge: null, credits: 2, url: 'https://picsum.photos/seed/sk/300/200' },
];

export default function StylePage() {
  const [favorites, setFavorites] = useState([]);
  const toggleFav = (name) => setFavorites(prev => prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]);

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Palette} title="STYLE & COLOR" subtitle="Color grading, artistic styles, and filter apps" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-8">
          {APPS.map((app, i) => (
            <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden group cursor-pointer">
              <div className="relative">
                <img src={app.url} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" alt="" />
                <button onClick={(e) => { e.stopPropagation(); toggleFav(app.name); }} className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:text-[#CCFF00]"><Heart size={14} fill={favorites.includes(app.name) ? '#CCFF00' : 'none'} /></button>
                {app.badge && <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded ${app.badge === 'TOP' ? 'bg-[#CCFF00] text-black' : 'bg-[#7C3AED] text-white'}`}>{app.badge}</span>}
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1">{app.name}</h3>
                <p className="text-[#555] text-xs mb-3">{app.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#444]">{app.credits} credits</span>
                  <button onClick={() => toast.success(`Opening ${app.name}...`)} className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] transition-all">Use App</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}