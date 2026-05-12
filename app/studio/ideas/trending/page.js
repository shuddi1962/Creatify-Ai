'use client';

import { useState } from 'react';
import { TrendingUp, Play, Save, FileText, Send } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const PLATFORMS = ['All', 'TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter', 'Pinterest'];
const TIMEFRAMES = ['Today', 'This Week', 'This Month'];
const SORTS = ['Trending', 'Virality', 'Newest'];

const SAMPLE_TRENDS = [
  { id: 1, topic: 'Morning routine aesthetic', platform: 'TikTok', niche: 'Lifestyle', virality: 94, hook: '5 AM mornings changed my life', audio: 'Lo-fi beats', hashtags: ['#morningroutine', '#selfcare', '#aesthetic'] },
  { id: 2, topic: 'AI tool unboxing', platform: 'YouTube', niche: 'Tech', virality: 88, hook: 'This AI edited my entire video', audio: 'Epic transition', hashtags: ['#aitech', '#aitools', '#techreview'] },
  { id: 3, topic: 'Budget home makeover', platform: 'Instagram', niche: 'Home Decor', virality: 82, hook: '$50 room transformation', audio: 'Trendy pop', hashtags: ['#homemakeover', '#diy', '#budgetdecor'] },
  { id: 4, topic: 'Side hustle revealed', platform: 'LinkedIn', niche: 'Business', virality: 79, hook: 'I made $10K last month', audio: 'Motivational', hashtags: ['#sidehustle', '#entrepreneur', '#money'] },
  { id: 5, topic: 'Day in my life', platform: 'TikTok', niche: 'Lifestyle', virality: 91, hook: 'Working from home routine', audio: 'Chill vibe', hashtags: ['#dayinmylife', '#wfh', '#routine'] },
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

  const filtered = SAMPLE_TRENDS.filter(t => platform === 'All' || t.platform === platform);

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="PLATFORMS">
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: platform === p ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: platform === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{p}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            TRENDING NOW
          </h1>
          <div style={{ zIndex: 1, marginTop: 16, width: '100%', maxWidth: 640, padding: '0 16px', maxHeight: '65%', overflowY: 'auto' }}>
            {filtered.map(trend => (
              <div key={trend.id} style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, marginBottom: 8, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{trend.topic}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4 }}>{trend.platform}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{trend.niche}</span>
                    </div>
                  </div>
                  <button onClick={() => handleSave(trend.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Save size={16} /></button>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}><span>Virality</span><span>{trend.virality}/100</span></div>
                  <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg, #7C3AED, #CCFF00)', borderRadius: 100, width: `${trend.virality}%` }} />
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 8 }}>"{trend.hook}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Play size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{trend.audio}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleScript(trend.id)} style={{ flex: 1, padding: '8px 12px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <FileText size={12} /> Generate Script
                  </button>
                  <button onClick={() => handleStoryboard(trend.id)} style={{ flex: 1, padding: '8px 12px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Send size={12} /> Storyboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Trending Controls">
          <PromptInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search niches..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <select value={region} onChange={e => setRegion(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-primary)' }}>
              <option>Global</option><option>US</option><option>UK</option><option>IN</option><option>BR</option>
            </select>
            <ControlButton onClick={() => setTimeframe(timeframe === 'Today' ? 'This Week' : timeframe === 'This Week' ? 'This Month' : 'Today')}>{timeframe}</ControlButton>
            <ControlButton onClick={() => setSort(sort === 'Trending' ? 'Virality' : sort === 'Virality' ? 'Newest' : 'Trending')}>{sort}</ControlButton>
            <ControlButton onClick={handleRefresh} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</ControlButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
