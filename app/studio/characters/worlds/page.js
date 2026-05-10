'use client';

import { useState } from 'react';
import { Globe, Image, Video, Edit, Trash2, Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import Link from 'next/link';

const SAMPLE_WORLDS = [
  { id: 1, name: 'Sunset Beach', setting: 'Natural', preview: 'https://picsum.photos/seed/beach/400/225', lastUsed: 'May 8' },
  { id: 2, name: 'Cyberpunk Alley', setting: 'Sci-Fi', preview: 'https://picsum.photos/seed/cyber/400/225', lastUsed: 'May 6' },
  { id: 3, name: 'Cozy Coffee Shop', setting: 'Interior', preview: 'https://picsum.photos/seed/coffee/400/225', lastUsed: 'May 4' },
  { id: 4, name: 'Ancient Temple', setting: 'Historical', preview: 'https://picsum.photos/seed/temple/400/225', lastUsed: 'May 2' },
];

export default function WorldsPage() {
  const [worlds, setWorlds] = useState(SAMPLE_WORLDS);
  const handleDelete = (id) => { setWorlds(worlds.filter(w => w.id !== id)); toast.success('World deleted'); };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Globe} title="MY WORLDS" subtitle="Browse and manage all your saved world and scene presets" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex justify-end mb-6">
          <Link href="/studio/characters/worlds/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">
            <Plus size={16} /> Create New World
          </Link>
        </div>
        {worlds.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4"><Globe size={32} className="text-[#444]" /></div>
            <h3 className="text-white font-semibold mb-2">No worlds yet</h3>
            <p className="text-[#666] text-sm mb-6">Create your first world to use as a background</p>
            <Link href="/studio/characters/worlds/create" className="inline-block px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl">Create World</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
            {worlds.map(world => (
              <div key={world.id} className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden">
                <img src={world.preview} className="w-full aspect-video object-cover" alt="" />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-bold">{world.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{world.setting}</span>
                        <span className="text-[10px] text-[#555]">Used {world.lastUsed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toast.success('Opening image generator...')} className="flex-1 px-3 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white flex items-center justify-center gap-1"><Image size={12} /> Image</button>
                    <button onClick={() => toast.success('Opening video generator...')} className="flex-1 px-3 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white flex items-center justify-center gap-1"><Video size={12} /> Video</button>
                    <button onClick={() => toast.success('Editing world...')} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(world.id)} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-red-500 transition-all"><Trash2 size={14} /></button>
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