'use client';

import { useState } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import Link from 'next/link';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, CornerMarkers } from '@/components/studio/StudioEditorLayout';

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
    <StudioEditorLayout
      left={
        <LeftPanel title="FILTER">
          {['All', ...new Set(SAVED_IDEAS.map(i => i.platform))].map(p => (
            <button key={p} onClick={() => setFilter(p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: filter === p ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: filter === p ? 'var(--accent-text)' : 'var(--text-secondary)',
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
            SAVED IDEAS
          </h1>
          {ideas.length === 0 ? (
            <div style={{ zIndex: 1, textAlign: 'center', padding: 40, maxWidth: 400 }}>
              <div style={{ width: 80, height: 80, background: 'var(--bg-card)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Bookmark size={32} style={{ color: '#444' }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>No saved ideas yet</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>Browse trending ideas to save some</p>
              <Link href="/studio/ideas/trending" style={{ display: 'inline-block', padding: '10px 24px', background: '#CCFF00', color: '#000', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Browse Trending</Link>
            </div>
          ) : (
            <div style={{ zIndex: 1, marginTop: 16, width: '100%', maxWidth: 600, padding: '0 16px', maxHeight: '65%', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {ideas.map(idea => (
                <div key={idea.id} style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{idea.topic}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4 }}>{idea.platform}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{idea.niche}</span>
                      </div>
                    </div>
                    <button onClick={() => handleRemove(idea.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Trash2 size={16} /></button>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}><span>Virality</span><span>{idea.virality}/100</span></div>
                    <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'linear-gradient(90deg, #7C3AED, #CCFF00)', borderRadius: 100, width: `${idea.virality}%` }} />
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 8 }}>"{idea.hook}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#444' }}>Saved {idea.savedDate}</span>
                    <button onClick={() => toast.success('Opening script generator...')} style={{ padding: '6px 12px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', border: 'none', borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Generate Script</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Saved Ideas">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ideas.length} saved ideas</span>
          </div>
        </DirectorBar>
      }
    />
  );
}
