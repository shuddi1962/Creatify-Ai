'use client';

import { useState } from 'react';
import { Users, UserPlus, Image, Video, Edit, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import Link from 'next/link';

const SAMPLE_CHARACTERS = [
  { id: 1, name: 'Sarah', type: 'Real Person', images: 12, avatar: 'https://picsum.photos/seed/sarah/200' },
  { id: 2, name: 'The Explorer', type: 'Fictional', images: 8, avatar: 'https://picsum.photos/seed/explorer/200' },
  { id: 3, name: 'Cyber Cop', type: '3D', images: 5, avatar: 'https://picsum.photos/seed/cybercop/200' },
  { id: 4, name: 'Mia', type: 'Anime', images: 15, avatar: 'https://picsum.photos/seed/mia/200' },
];

export default function MyCharactersPage() {
  const [characters, setCharacters] = useState(SAMPLE_CHARACTERS);

  const handleDelete = (id) => {
    setCharacters(characters.filter(c => c.id !== id));
    toast.success('Character deleted');
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Users} title="MY CHARACTERS" subtitle="Browse and manage all your saved character profiles" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex justify-end mb-6">
          <Link href="/studio/characters/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">
            <UserPlus size={16} /> Create New Character
          </Link>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4"><Users size={32} className="text-[#444]" /></div>
            <h3 className="text-white font-semibold mb-2">No characters yet</h3>
            <p className="text-[#666] text-sm mb-6">Create your first character to use across generations</p>
            <Link href="/studio/characters/create" className="inline-block px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl">Create Character</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
            {characters.map(char => (
              <div key={char.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-5">
                <div className="flex items-center gap-4 mb-4">
                  <img src={char.avatar} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div>
                    <h3 className="text-white font-bold">{char.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{char.type}</span>
                      <span className="text-[10px] text-[#555]">{char.images} videos</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toast.success('Opening image generator...')} className="flex-1 px-3 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white flex items-center justify-center gap-1 transition-all"><Image size={12} /> Image</button>
                  <button onClick={() => toast.success('Opening video generator...')} className="flex-1 px-3 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white flex items-center justify-center gap-1 transition-all"><Video size={12} /> Video</button>
                  <button onClick={() => toast.success('Editing character...')} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(char.id)} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}