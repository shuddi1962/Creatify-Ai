'use client';

import { useState } from 'react';
import { Search, TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';
import PillSelector from '@/components/studio/PillSelector';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Twitter'];
const DEPTH_OPTIONS = ['Quick (5 posts)', 'Standard (15 posts)', 'Deep (30 posts)'];
const METRICS = ['Views', 'Engagement Rate', 'Likes', 'Comments', 'Shares', 'Save Rate'];

export default function CompetitorPage() {
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [depth, setDepth] = useState('Standard (15 posts)');
  const [selectedMetrics, setSelectedMetrics] = useState(['Views', 'Engagement Rate']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const toggleMetric = (m) => setSelectedMetrics(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const analyze = () => {
    if (!handle.trim()) { toast.error('Enter a handle'); return; }
    setLoading(true);
    setTimeout(() => {
      setResults({
        avatar: 'https://picsum.photos/100',
        handle: `@${handle.replace('@', '')}`,
        followers: '2.4M',
        avgViews: '485K',
        engagementRate: '8.2%',
        topPosts: [
          { title: 'Day in my life', views: '2.1M', likes: '180K', platform: 'TikTok' },
          { title: 'How I made $10K', views: '1.8M', likes: '156K', platform: 'TikTok' },
          { title: 'Morning routine', views: '1.2M', likes: '98K', platform: 'TikTok' },
          { title: 'Behind the scenes', views: '890K', likes: '74K', platform: 'Instagram' },
          { title: 'Q&A session', views: '720K', likes: '58K', platform: 'YouTube' },
        ],
        insights: [
          'Uses question-based hooks in 80% of content',
          'Short-form video under 45s performs 3x better',
          'Consistent posting schedule: Mon, Wed, Fri',
          'Highest engagement on personal story content',
          'Educational content drives more shares than entertainment',
        ],
        suggestedHooks: [
          'What if you could [achieve goal] in [timeframe]?',
          'I tried [challenge] for 30 days — here\'s what happened',
          'The secret to [desired outcome] nobody talks about',
          'This one change transformed my [area of life]',
        ],
      });
      setLoading(false);
      toast.success('Analysis complete!');
    }, 3500);
  };

  const generateSimilar = (postTitle) => toast.success(`Generating content similar to: ${postTitle}`);

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Search} title="COMPETITOR CONTENT ANALYZER" subtitle="Reverse-engineer what makes top-performing content work" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div>
              <SectionLabel>Platform</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => setPlatform(p)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${platform === p ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Creator Handle</SectionLabel>
              <div className="flex gap-2">
                <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="@username or channel name" className="flex-1 bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
                <button onClick={analyze} disabled={loading || !handle.trim()} className="px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 transition-all flex items-center gap-2">
                  {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Search size={16} />} Analyze
                </button>
              </div>
            </div>
            <div>
              <SectionLabel>Analysis Depth</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                {DEPTH_OPTIONS.map(d => (
                  <button key={d} onClick={() => setDepth(d)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${depth === d ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Metrics to Analyze</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                {METRICS.map(m => (
                  <button key={m} onClick={() => toggleMetric(m)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedMetrics.includes(m) ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{m}</button>
                ))}
              </div>
            </div>
          </div>
        </GenerationPanel>

        {results && (
          <div className="space-y-6">
            <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
              <div className="flex items-center gap-4 mb-6">
                <img src={results.avatar} className="w-16 h-16 rounded-full" alt="" />
                <div>
                  <h3 className="text-white font-bold text-lg">{results.handle}</h3>
                  <p className="text-[#555] text-sm">{results.followers} followers</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                  <p className="text-[#CCFF00] text-xl font-bold">{results.avgViews}</p>
                  <p className="text-[#555] text-xs">Avg Views</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                  <p className="text-[#7C3AED] text-xl font-bold">{results.engagementRate}</p>
                  <p className="text-[#555] text-xs">Engagement</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                  <p className="text-[#7C3AED] text-xl font-bold">{results.topPosts.length}</p>
                  <p className="text-[#555] text-xs">Posts Analyzed</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Top Performing Content</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.topPosts.map((post, i) => (
                  <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4">
                    <p className="text-white text-sm font-medium mb-2">{post.title}</p>
                    <div className="flex items-center gap-4 text-[#555] text-xs">
                      <span className="flex items-center gap-1"><Eye size={12} /> {post.views}</span>
                      <span className="flex items-center gap-1"><Heart size={12} /> {post.likes}</span>
                      <span className="px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded">{post.platform}</span>
                    </div>
                    <button onClick={() => generateSimilar(post.title)} className="mt-3 w-full px-3 py-2 bg-[#1a1a1a] text-[#CCFF00] text-xs font-semibold rounded-lg hover:bg-[#222] transition-all">Generate Similar</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Pattern Insights</h3>
              <div className="space-y-2">
                {results.insights.map((insight, i) => (
                  <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4 flex items-center gap-3">
                    <TrendingUp size={16} className="text-[#CCFF00]" />
                    <span className="text-[#ccc] text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Suggested Hooks Based on Analysis</h3>
              <div className="space-y-2">
                {results.suggestedHooks.map((hook, i) => (
                  <div key={i} className="bg-[#0a0a0a] rounded-lg border border-white/[0.06] p-3 text-[#ccc] text-sm cursor-pointer hover:border-[#7C3AED] transition-all" onClick={() => { navigator.clipboard.writeText(hook); toast.success('Hook copied!'); }}>{hook}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}