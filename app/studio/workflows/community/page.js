'use client';

import { useState } from 'react';
import { Users, Search, Star, GitFork, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const COMMUNITY_WORKFLOWS = [
  { id: 1, name: 'Pro Headshot Studio', creator: '@aiportrait', desc: 'Studio-quality headshots from any photo', nodes: 5, runs: 15420, rating: 4.9 },
  { id: 2, name: 'Viral Reels Maker', creator: '@contentking', desc: 'Hook → script → video → caption', nodes: 8, runs: 12800, rating: 4.8 },
  { id: 3, name: 'Bulk Product Showcase', creator: '@ecomguru', desc: 'Upload product → 20 ad variants', nodes: 6, runs: 9800, rating: 4.7 },
  { id: 4, name: 'Anime Style Transfer', creator: '@animeai', desc: 'Apply anime style to any image', nodes: 4, runs: 22400, rating: 4.9 },
  { id: 5, name: 'Cinematic LUT Generator', creator: '@filmmaker', desc: 'Create custom color grades', nodes: 3, runs: 7600, rating: 4.6 },
  { id: 6, name: 'Talking Avatar Pipeline', creator: '@avatarshop', desc: 'Script → avatar → video', nodes: 7, runs: 11300, rating: 4.8 },
];

export default function CommunityPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Users} title="COMMUNITY WORKFLOWS" subtitle="Browse and run workflows published by other creators" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workflows..." className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
          </div>
          <div className="flex gap-2">
            {['All', 'Image', 'Video', 'Audio', 'Marketing'].map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${category === c ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
          {COMMUNITY_WORKFLOWS.filter(w => !search || w.name.toLowerCase().includes(search.toLowerCase())).map((wf, i) => (
            <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-white font-semibold">{wf.name}</h4>
                  <p className="text-[10px] text-[#7C3AED] mt-0.5">{wf.creator}</p>
                </div>
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  <Star size={12} fill="#F59E0B" />
                  <span className="text-xs font-semibold">{wf.rating}</span>
                </div>
              </div>
              <p className="text-[#555] text-xs mb-4">{wf.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#444]">{wf.nodes} nodes · {wf.runs.toLocaleString()} runs</span>
                <div className="flex gap-2">
                  <button onClick={() => toast.success('Forked! Opening editor...')} className="px-3 py-1.5 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white flex items-center gap-1 transition-all"><GitFork size={12} /> Fork</button>
                  <button onClick={() => toast.success('Running workflow...')} className="px-4 py-1.5 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] flex items-center gap-1 transition-all"><Play size={12} /> Use</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}