'use client';

import { useState } from 'react';
import { Heart, Grid } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import Link from 'next/link';

const FAVORITES = [
  { name: 'Face Swap', desc: 'Swap faces in any image or video', credits: 5, url: 'https://picsum.photos/seed/fs/300/200' },
  { name: 'Neon Glow', desc: 'Add vibrant neon lighting effects', credits: 3, url: 'https://picsum.photos/seed/ng/300/200' },
  { name: 'Meme Generator', desc: 'Trending meme templates with text', credits: 2, url: 'https://picsum.photos/seed/mg/300/200' },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(FAVORITES);
  const removeFav = (name) => { setFavorites(favorites.filter(f => f.name !== name)); toast.success('Removed from favorites'); };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Heart} title="FAVORITE APPS" subtitle="Your pinned and most-used apps" />
      <div className="max-w-[900px] mx-auto px-4">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4"><Heart size={32} className="text-[#444]" /></div>
            <h3 className="text-white font-semibold mb-2">No favorites yet</h3>
            <p className="text-[#666] text-sm mb-6">Heart any app to save it here</p>
            <Link href="/studio/apps/all" className="inline-block px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl">Browse Apps</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-8">
            {favorites.map((app, i) => (
              <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden">
                <img src={app.url} className="w-full aspect-video object-cover" alt="" />
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">{app.name}</h3>
                  <p className="text-[#555] text-xs mb-3">{app.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#444]">{app.credits} credits</span>
                    <div className="flex gap-2">
                      <button onClick={() => removeFav(app.name)} className="px-3 py-1.5 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-red-500 transition-all">Remove</button>
                      <button onClick={() => toast.success(`Opening ${app.name}...`)} className="px-4 py-1.5 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] transition-all">Use</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}