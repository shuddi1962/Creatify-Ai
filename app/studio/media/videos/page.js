'use client';

import { useState } from 'react';
import { Video, Download, Trash2, Search, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const VIDEOS = [
  { id: 1, url: 'https://picsum.photos/seed/vid1/400/225', name: 'product-reel.mp4', model: 'Seedance', date: 'May 9', size: '18.7 MB' },
  { id: 2, url: 'https://picsum.photos/seed/vid2/400/225', name: 'ad-clip.mp4', model: 'Kling', date: 'May 6', size: '24.3 MB' },
  { id: 3, url: 'https://picsum.photos/seed/vid3/400/225', name: 'tutorial.mp4', model: 'Seedance', date: 'May 4', size: '32.1 MB' },
  { id: 4, url: 'https://picsum.photos/seed/vid4/400/225', name: 'reel-2.mp4', model: 'Kling', date: 'May 2', size: '15.8 MB' },
];

export default function VideosPage() {
  const [videos] = useState(VIDEOS);
  const [search, setSearch] = useState('');

  const filtered = videos.filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <h1 className="text-white font-bold text-2xl mb-2">Videos</h1>
        <p className="text-[#666] text-sm mb-6">{videos.length} videos</p>
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos..." className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#444] focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
          {filtered.map(vid => (
            <div key={vid.id} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden">
              <div className="relative aspect-video bg-[#1a1a1a]">
                <img src={vid.url} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center"><Play size={20} className="text-black ml-1" /></div></div>
              </div>
              <div className="p-4"><p className="text-white text-sm font-medium">{vid.name}</p><p className="text-[#555] text-xs mt-1">{vid.model} · {vid.size}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}