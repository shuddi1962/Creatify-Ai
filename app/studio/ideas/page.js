'use client';

import { TrendingUp, Heart, Calendar, Lightbulb, FileText, Search, Image, Layout } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: TrendingUp, name: 'Trending Now', desc: 'Today\'s trending content ideas by niche and platform', href: '/studio/ideas/trending' },
  { icon: Heart, name: 'My Saved Ideas', desc: 'All your bookmarked content ideas in one place', href: '/studio/ideas/saved' },
  { icon: Calendar, name: 'Content Calendar', desc: 'Plan and schedule your content creation pipeline', href: '/studio/ideas/calendar' },
  { icon: Lightbulb, name: 'Hook Generator', desc: 'Generate viral opening hooks for any niche', href: '/studio/ideas/hooks' },
  { icon: FileText, name: 'Script Generator', desc: 'AI writes complete video scripts from any idea', href: '/studio/ideas/scripts', badge: 'NEW' },
  { icon: Search, name: 'Competitor Analyzer', desc: 'Reverse-engineer top-performing content', href: '/studio/ideas/competitor' },
  { icon: Image, name: 'Thumbnail Generator', desc: 'Generate AI thumbnail variants for any content', href: '/studio/ideas/thumbnails' },
  { icon: Layout, name: 'Storyboard Pipeline', desc: 'Script to storyboard to bulk video in one click', href: '/studio/ideas/storyboard', badge: 'NEW' },
];

export default function IdeasPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <StudioHero icon={TrendingUp} title="CONTENT IDEAS" subtitle="8 tools for trend discovery, script writing, competitor analysis, and content planning" backgroundImage="https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1200" />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 12, paddingBottom: 40,
        }}>
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
              <div className="home-section-card" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 12, padding: 16, position: 'relative',
                transition: 'all 200ms ease', cursor: 'pointer',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {f.badge && (
                  <span className={f.badge === 'TOP' ? 'badge-top' : 'badge-new'} style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>{f.badge}</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, background: 'var(--bg-input)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={18} style={{ color: 'var(--btn-generate-bg)' }} />
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{f.name}</h3>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
