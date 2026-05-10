'use client';

import { useState } from 'react';
import { TrendingUp, Play, Save, FileText, Send } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

const PLATFORMS = ['All', 'TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter', 'Pinterest'];
const TIMEFRAMES = ['Today', 'This Week', 'This Month'];
const SORTS = ['Trending', 'Virality', 'Newest'];

const SAMPLE_TRENDS = [
  { id: 1, topic: 'Morning routine aesthetic', platform: 'TikTok', niche: 'Lifestyle', virality: 94, hook: '5 AM mornings changed my life', audio: 'Lo-fi beats', hashtags: ['#morningroutine', '#selfcare', '#aesthetic'] },
  { id: 2, topic: 'AI tool unboxing', platform: 'YouTube', niche: 'Tech', virality: 88, hook: 'This AI edited my entire video', audio: 'Epic transition', hashtags: ['#aitech', '#aitools', '#techreview'] },
  { id: 3, topic: 'Budget home makeover', platform: 'Instagram', niche: 'Home Decor', virality: 82, hook: '$50 room transformation', audio: 'Trendy pop', hashtags: ['#homemakeover', '#diy', '#budgetdecor'] },
  { id: 4, topic: 'Side hustle revealed', platform: 'LinkedIn', niche: 'Business', virality: 79, hook: 'I made $10K last month', audio: 'Motivational', hashtags: ['#sidehustle', '#entrepreneur', '#money'] },
  { id: 5, topic: 'Day in my life', platform: 'TikTok', niche: 'Lifestyle', virativity: 91, hook: 'Working from home routine', audio: 'Chill vibe', hashtags: ['#dayinmylife', '#wfh', '#routine'] },
  { id: 6, topic: 'Recipe hack', platform: 'YouTube', niche: 'Food', virality: 86, hook: 'One ingredient pizza crust', audio: 'Cooking beats', hashtags: ['#foodtok', '#recipe', '#cookinghack'] },
  { id: 7, topic: 'Pet transformation', platform: 'Instagram', niche: 'Pets', virality: 95, hook: 'Before/after dog grooming', audio: 'Cute sound', hashtags: ['#dogsoftiktok', '#petcare', '#grooming'] },
  { id: 8, topic: 'Fitness challenge', platform: 'TikTok', niche: 'Fitness', virality: 83, hook: '30-day ab challenge', audio: 'Workout hype', hashtags: ['#fitness', '#workout', '#abchallenge'] },
];

export default function TrendingPage() {
  const [platform, setPlatform] = useState('All');
  const [timeframe, setTimeframe] = useState('This Week');
  const [sort, setSort] = useState('Trending');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('Global');
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Trends refreshed!'); }, 1500);
  };

  const handleSave = (id) => toast.success('Idea saved!');
  const handleScript = (id) => toast.success('Opening script generator...');
  const handleStoryboard = (id) => toast.success('Sent to storyboard!');

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={TrendingUp} title="TRENDING NOW" subtitle="Top viral trends refreshed every 24 hours" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="sticky top-16 z-20 bg-[#000] py-3 flex flex-wrap gap-3 items-center">
          <input type="text" placeholder="Search niches..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 min-w-[200px] bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-4 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
          <select value={region} onChange={e => setRegion(e.target.value)} className="bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-4 py-2 text-sm text-white focus:outline-none">
            <option>Global</option><option>US</option><option>UK</option><option>IN</option><option>BR</option>
          </select>
          <button onClick={handleRefresh} disabled={loading} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm rounded-lg border border-white/[0.08] hover:bg-[#222] disabled:opacity-50">
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="flex gap-2 py-4 flex-wrap">
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${platform === p ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{p}</button>
          ))}
        </div>
        <div className="flex gap-3 pb-4 flex-wrap">
          <div className="flex gap-2">
            <span className="text-[10px] text-[#444] uppercase tracking-widest self-center">Time:</span>
            {TIMEFRAMES.map(t => (
              <button key={t} onClick={() => setTimeframe(t)} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${timeframe === t ? 'bg-[#333] text-white' : 'text-[#666]'}`}>{t}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-[#444] uppercase tracking-widest self-center">Sort:</span>
            {SORTS.map(s => (
              <button key={s} onClick={() => setSort(s)} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${sort === s ? 'bg-[#333] text-white' : 'text-[#666]'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
          {SAMPLE_TRENDS.filter(t => platform === 'All' || t.platform === platform).map(trend => (
            <div key={trend.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-sm">{trend.topic}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{trend.platform}</span>
                    <span className="text-[10px] text-[#555]">{trend.niche}</span>
                  </div>
                </div>
                <button onClick={() => handleSave(trend.id)} className="text-[#666] hover:text-[#CCFF00] transition-colors"><Save size={16} /></button>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-[#555] mb-1"><span>Virality</span><span>{trend.virality}/100</span></div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#CCFF00] rounded-full" style={{ width: `${trend.virality}%` }} />
                </div>
              </div>
              <p className="text-[#888] text-xs mb-3">"{trend.hook}"</p>
              <div className="flex items-center gap-2 mb-3">
                <button className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#666] hover:text-white transition-colors"><Play size={12} /></button>
                <span className="text-[10px] text-[#555]">{trend.audio}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleScript(trend.id)} className="flex-1 px-3 py-2 bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-semibold rounded-lg hover:bg-[#7C3AED]/30 transition-all flex items-center justify-center gap-1">
                  <FileText size={12} /> Generate Script
                </button>
                <button onClick={() => handleStoryboard(trend.id)} className="flex-1 px-3 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] transition-all flex items-center justify-center gap-1">
                  <Send size={12} /> Storyboard
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}