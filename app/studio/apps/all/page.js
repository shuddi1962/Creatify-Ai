'use client';

import { useState } from 'react';
import { Grid, Search, Heart, Sparkles, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const CATEGORIES = ['All', 'VFX', 'Face & Character', 'Style', 'Product', 'Meme & Social', 'New'];
const SORTS = ['Popular', 'Newest', 'A-Z'];
const APPS = [
  { id: 1, name: 'Face Swap', desc: 'Swap faces in any image or video', category: 'Face & Character', badge: 'TOP', credits: 5, url: 'https://picsum.photos/seed/fs/300/200', favorite: true },
  { id: 2, name: 'AI Headshot', desc: 'Studio-quality professional headshots', category: 'Face & Character', badge: 'TOP', credits: 10, url: 'https://picsum.photos/seed/hs/300/200', favorite: false },
  { id: 3, name: 'Match Cut', desc: 'Seamless transition between clips', category: 'VFX', badge: 'NEW', credits: 8, url: 'https://picsum.photos/seed/mc/300/200', favorite: false },
  { id: 4, name: 'Neon Glow', desc: 'Add vibrant neon lighting effects', category: 'Style', badge: null, credits: 3, url: 'https://picsum.photos/seed/ng/300/200', favorite: true },
  { id: 5, name: 'Style Transfer', desc: 'Apply artistic styles to photos', category: 'Style', badge: 'TOP', credits: 5, url: 'https://picsum.photos/seed/st/300/200', favorite: false },
  { id: 6, name: 'Sticker Generator', desc: 'Create custom stickers from photos', category: 'Meme & Social', badge: 'NEW', credits: 2, url: 'https://picsum.photos/seed/sg/300/200', favorite: false },
  { id: 7, name: 'Product Placement', desc: 'Place products in scenes naturally', category: 'Product', badge: null, credits: 8, url: 'https://picsum.photos/seed/pp/300/200', favorite: false },
  { id: 8, name: 'Color Grading', desc: 'Professional color correction LUTs', category: 'Style', badge: null, credits: 4, url: 'https://picsum.photos/seed/cg/300/200', favorite: false },
  { id: 9, name: 'Meme Generator', desc: 'Trending meme templates with text', category: 'Meme & Social', badge: 'TOP', credits: 2, url: 'https://picsum.photos/seed/mg/300/200', favorite: true },
  { id: 10, name: 'Skin Enhancer', desc: 'AI-powered skin retouching', category: 'Face & Character', badge: null, credits: 4, url: 'https://picsum.photos/seed/se/300/200', favorite: false },
  { id: 11, name: 'Camera Angles', desc: 'Generate multiple camera angles', category: 'VFX', badge: null, credits: 6, url: 'https://picsum.photos/seed/ca/300/200', favorite: false },
  { id: 12, name: 'Effects Pack', desc: '100+ VFX effects in one app', category: 'VFX', badge: 'NEW', credits: 10, url: 'https://picsum.photos/seed/ep/300/200', favorite: false },
];

export default function AllAppsPage() {
  const [apps, setApps] = useState(APPS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Popular');

  const toggleFav = (id) => setApps(apps.map(a => a.id === id ? { ...a, favorite: !a.favorite } : a));

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Grid} title="EXPLORE APPS" subtitle="150+ one-click creative apps for every creative use case" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search apps..." className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {SORTS.map(s => (
              <button key={s} onClick={() => setSort(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${sort === s ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${category === c ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-8">
          {apps.filter(a => category === 'All' || a.category === category).filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase())).map(app => (
            <div key={app.id} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden group cursor-pointer">
              <div className="relative">
                <img src={app.url} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" alt="" />
                <button onClick={(e) => { e.stopPropagation(); toggleFav(app.id); }} className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:text-[#CCFF00]"><Heart size={14} fill={app.favorite ? '#CCFF00' : 'none'} /></button>
                {app.badge && (
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded ${app.badge === 'TOP' ? 'bg-[#CCFF00] text-black' : 'bg-[#7C3AED] text-white'}`}>{app.badge}</span>
                )}
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