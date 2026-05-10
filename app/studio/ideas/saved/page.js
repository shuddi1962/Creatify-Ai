'use client';

import { useState } from 'react';
import { Bookmark, Trash2, TrendingUp } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import Link from 'next/link';

const SAVED_IDEAS = [
  { id: 1, topic: 'Morning routine aesthetic', platform: 'TikTok', niche: 'Lifestyle', virality: 94, hook: '5 AM mornings changed my life', savedDate: 'May 8, 2026' },
  { id: 2, topic: 'Budget home makeover', platform: 'Instagram', niche: 'Home Decor', virality: 82, hook: '$50 room transformation', savedDate: 'May 7, 2026' },
  { id: 3, topic: 'Side hustle revealed', platform: 'LinkedIn', niche: 'Business', virality: 79, hook: 'I made $10K last month', savedDate: 'May 6, 2026' },
  { id: 4, topic: 'Pet transformation', platform: 'Instagram', niche: 'Pets', virality: 95, hook: 'Before/after dog grooming', savedDate: 'May 5, 2026' },
];

export default function SavedPage() {
  const [ideas, setIdeas] = useState(SAVED_IDEAS);
  const [filter, setFilter] = useState('All');

  const handleRemove = (id) => {
    setIdeas(ideas.filter(i => i.id !== id));
    toast.success('Removed from saved');
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Bookmark} title="MY SAVED IDEAS" subtitle="All your bookmarked content ideas in one organized place" />
      <div className="max-w-[900px] mx-auto px-4">
        {ideas.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bookmark size={32} className="text-[#444]" />
            </div>
            <h3 className="text-white font-semibold mb-2">No saved ideas yet</h3>
            <p className="text-[#666] text-sm mb-6">Browse trending ideas to save some</p>
            <Link href="/studio/ideas/trending" className="inline-block px-6 py-2 bg-[#CCFF00] text-black font-bold text-sm rounded-xl">Browse Trending</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
            {ideas.map(idea => (
              <div key={idea.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-sm">{idea.topic}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{idea.platform}</span>
                      <span className="text-[10px] text-[#555]">{idea.niche}</span>
                    </div>
                  </div>
                  <button onClick={() => handleRemove(idea.id)} className="text-[#666] hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-[#555] mb-1"><span>Virality</span><span>{idea.virality}/100</span></div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#CCFF00] rounded-full" style={{ width: `${idea.virality}%` }} />
                  </div>
                </div>
                <p className="text-[#888] text-xs mb-3">"{idea.hook}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#444]">Saved {idea.savedDate}</span>
                  <button onClick={() => toast.success('Opening script generator...')} className="px-3 py-1.5 bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-semibold rounded-lg hover:bg-[#7C3AED]/30 transition-all">Generate Script</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}