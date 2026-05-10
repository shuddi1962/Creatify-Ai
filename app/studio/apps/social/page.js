'use client';

import { useState } from 'react';
import { Laugh, Heart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const APPS = [
  { name: 'Meme Generator', desc: 'Trending meme templates with text', badge: 'TOP', credits: 2, url: 'https://picsum.photos/seed/mg/300/200' },
  { name: 'Sticker Generator', desc: 'Create custom stickers from photos', badge: 'NEW', credits: 2, url: 'https://picsum.photos/seed/sg/300/200' },
  { name: 'Match Cut', desc: 'Seamless transition between clips', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/mc/300/200' },
  { name: 'Reaction GIF', desc: 'Create reaction GIFs instantly', badge: null, credits: 4, url: 'https://picsum.photos/seed/rg/300/200' },
  { name: 'Quote Card', desc: 'Create shareable quote images', badge: null, credits: 2, url: 'https://picsum.photos/seed/qc/300/200' },
  { name: 'Caption Overlay', desc: 'Add stylish captions to images', badge: null, credits: 2, url: 'https://picsum.photos/seed/co/300/200' },
];

export default function SocialPage() {
  const [favorites, setFavorites] = useState([]);
  const toggleFav = (name) => setFavorites(prev => prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]);

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Laugh} title="MEME & SOCIAL" subtitle="Meme maker, sticker generator, and match cut apps" />
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