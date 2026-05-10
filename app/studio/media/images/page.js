'use client';

import { useState } from 'react';
import { Image, Download, Trash2, Search } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const IMAGES = [
  { id: 1, url: 'https://picsum.photos/seed/img1/400/300', name: 'hero-banner.png', model: 'Flux', date: 'May 10', size: '2.4 MB' },
  { id: 2, url: 'https://picsum.photos/seed/img2/400/300', name: 'thumbnail-1.png', model: 'Flux', date: 'May 8', size: '1.2 MB' },
  { id: 3, url: 'https://picsum.photos/seed/img3/400/300', name: 'social-post.png', model: 'Flux', date: 'May 7', size: '980 KB' },
  { id: 4, url: 'https://picsum.photos/seed/img4/400/300', name: 'headshot.png', model: 'Realistic', date: 'May 5', size: '1.8 MB' },
  { id: 5, url: 'https://picsum.photos/seed/img5/400/300', name: 'product-shot.png', model: 'Flux', date: 'May 4', size: '2.1 MB' },
  { id: 6, url: 'https://picsum.photos/seed/img6/400/300', name: 'banner-2.png', model: 'Flux', date: 'May 3', size: '1.5 MB' },
];

export default function ImagesPage() {
  const [images] = useState(IMAGES);
  const [search, setSearch] = useState('');

  const filtered = images.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <h1 className="text-white font-bold text-2xl mb-2">Images</h1>
        <p className="text-[#666] text-sm mb-6">{images.length} images</p>
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images..." className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#444] focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-8">
          {filtered.map(img => (
            <div key={img.id} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden group">
              <div className="aspect-square bg-[#1a1a1a]"><img src={img.url} className="w-full h-full object-cover" alt="" /></div>
              <div className="p-2"><p className="text-white text-xs truncate">{img.name}</p><p className="text-[#555] text-[10px]">{img.date}</p></div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white rounded-full text-black"><Download size={14} /></button>
                <button className="p-2 bg-white rounded-full text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}