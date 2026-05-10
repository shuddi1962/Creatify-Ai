'use client';

import { useState } from 'react';
import { Sparkles, Heart, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const APPS = [
  { name: 'Match Cut', desc: 'Seamless transition between clips', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/mc/300/200' },
  { name: 'Camera Angles', desc: 'Generate multiple camera angles', badge: null, credits: 6, url: 'https://picsum.photos/seed/ca/300/200' },
  { name: 'Effects Pack', desc: '100+ VFX effects in one app', badge: 'NEW', credits: 10, url: 'https://picsum.photos/seed/ep/300/200' },
  { name: 'Color Grading', desc: 'Professional color correction', badge: null, credits: 4, url: 'https://picsum.photos/seed/cg/300/200' },
  { name: 'Relight', desc: 'Change lighting in any scene', badge: null, credits: 5, url: 'https://picsum.photos/seed/rl/300/200' },
  { name: 'Motion Blur', desc: 'Add cinematic motion blur', badge: null, credits: 3, url: 'https://picsum.photos/seed/mb/300/200' },
];

export default function VFXPage() {
  const [favorites, setFavorites] = useState([]);
  const toggleFav = (name) => setFavorites(prev => prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]);

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Sparkles} badge="TOP" title="VFX & EFFECTS" subtitle="All VFX presets in app card format" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-8">
          {APPS.map((app, i) => (
            <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden group cursor-pointer">
              <div className="relative">
                <img src={app.url} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" alt="" />
                <button onClick={(e) => { e.stopPropagation(); toggleFav(app.name); }} className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:text-[#CCFF00]"><Heart size={14} fill={favorites.includes(app.name) ? '#CCFF00' : 'none'} /></button>
                {app.badge && <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#7C3AED] text-white">{app.badge}</span>}
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