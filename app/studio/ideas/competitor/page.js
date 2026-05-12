'use client';

import { useState } from 'react';
import { Search, TrendingUp, Eye, Heart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

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
            COMPETITOR ANALYZER
          </h1>
          {results && (
            <div style={{ zIndex: 1, marginTop: 16, width: '100%', maxWidth: 600, padding: '0 16px', maxHeight: '65%', overflowY: 'auto' }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 20, border: '1px solid var(--border-subtle)', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <img src={results.avatar} style={{ width: 48, height: 48, borderRadius: '50%' }} alt="" />
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{results.handle}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{results.followers} followers</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#CCFF00' }}>{results.avgViews}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Avg Views</p>
                  </div>
                  <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#6366f1' }}>{results.engagementRate}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Engagement</p>
                  </div>
                  <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#6366f1' }}>{results.topPosts.length}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Posts Analyzed</p>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Top Performing Content</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {results.topPosts.map((post, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 12, border: '1px solid var(--border-subtle)' }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>{post.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={12} /> {post.views}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={12} /> {post.likes}</span>
                        <span style={{ padding: '2px 6px', background: 'rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: 4, fontSize: 10 }}>{post.platform}</span>
                      </div>
                      <button onClick={() => generateSimilar(post.title)} style={{ width: '100%', marginTop: 8, padding: '6px 0', background: 'var(--bg-input)', color: '#CCFF00', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Generate Similar</button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Pattern Insights</h3>
                {results.insights.map((insight, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', borderRadius: 10, padding: 12, marginBottom: 4, border: '1px solid var(--border-subtle)' }}>
                    <TrendingUp size={16} color="#CCFF00" />
                    <span style={{ fontSize: 13, color: '#ccc' }}>{insight}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Suggested Hooks</h3>
                {results.suggestedHooks.map((hook, i) => (
                  <div key={i} onClick={() => { navigator.clipboard.writeText(hook); toast.success('Hook copied!'); }}
                    style={{ background: 'var(--bg-input)', borderRadius: 8, padding: 10, marginBottom: 4, fontSize: 13, color: '#ccc', cursor: 'pointer', border: '1px solid transparent' }}
                  >{hook}</div>
                ))}
              </div>
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Analyze Competitor">
          <PromptInput value={handle} onChange={e => setHandle(e.target.value)} placeholder="@username" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <ControlButton onClick={() => setDepth(DEPTH_OPTIONS[(DEPTH_OPTIONS.indexOf(depth) + 1) % DEPTH_OPTIONS.length])}>{depth}</ControlButton>
            <GenerateButton onClick={analyze} loading={loading}>ANALYZE</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
