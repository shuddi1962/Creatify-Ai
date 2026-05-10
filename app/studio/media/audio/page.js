'use client';

import { useState } from 'react';
import { Music, Download, Trash2, Search, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const AUDIO_FILES = [
  { id: 1, name: 'voiceover-1.mp3', model: 'ElevenLabs', date: 'May 8', size: '4.1 MB', duration: '2:34' },
  { id: 2, name: 'voiceover-2.mp3', model: 'ElevenLabs', date: 'May 7', size: '3.8 MB', duration: '2:12' },
  { id: 3, name: 'background-music.mp3', model: 'Suno', date: 'May 6', size: '8.2 MB', duration: '3:45' },
  { id: 4, name: 'product-intro.mp3', model: 'ElevenLabs', date: 'May 5', size: '2.9 MB', duration: '1:48' },
];

export default function AudioPage() {
  const [audioFiles] = useState(AUDIO_FILES);
  const [search, setSearch] = useState('');
  const [playing, setPlaying] = useState(null);

  const filtered = audioFiles.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <h1 className="text-white font-bold text-2xl mb-2">Audio</h1>
        <p className="text-[#666] text-sm mb-6">{audioFiles.length} audio files</p>
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audio..." className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#444] focus:outline-none" />
        </div>
        <div className="space-y-3 pb-8">
          {filtered.map(audio => (
            <div key={audio.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4 flex items-center gap-4">
              <button onClick={() => setPlaying(playing === audio.id ? null : audio.id)} className="w-10 h-10 bg-[#7C3AED] rounded-full flex items-center justify-center text-white flex-shrink-0"><Play size={16} /></button>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{audio.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[#555] text-xs">{audio.model}</span>
                  <span className="text-[#555] text-xs">{audio.duration}</span>
                  <span className="text-[#555] text-xs">{audio.size}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><Download size={14} /></button>
                <button className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-red-500 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}