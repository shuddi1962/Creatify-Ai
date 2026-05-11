'use client';

import { Calendar, ListVideo, Plus, Link as LinkIcon, FileText, BarChart3, Crop } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: Calendar, name: 'Calendar View', desc: 'Drag-and-drop visual calendar for scheduled posts', href: '/studio/schedule/calendar' },
  { icon: ListVideo, name: 'Scheduled Posts', desc: 'View and manage all upcoming social media posts', href: '/studio/schedule/posts' },
  { icon: Plus, name: 'Schedule New Post', desc: 'Create and schedule a post to any connected platform', href: '/studio/schedule/new' },
  { icon: LinkIcon, name: 'Connect Accounts', desc: 'Link your social media accounts for direct publishing', href: '/studio/schedule/connect' },
  { icon: FileText, name: 'AI Caption Generator', desc: 'Generate engaging captions and trending hashtags', href: '/studio/schedule/captions' },
  { icon: BarChart3, name: 'Post Analytics', desc: 'Track views, reach, engagement, and clicks', href: '/studio/schedule/analytics' },
  { icon: Crop, name: 'Platform Formatter', desc: 'Auto-resize content for each platform', href: '/studio/schedule/format' },
];

export default function SchedulePage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <StudioHero icon={Calendar} title="SCHEDULE & PUBLISH" subtitle="7 scheduling tools — calendar, posts, analytics, caption generation, and account connection" backgroundImage="https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1200" />
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
                borderRadius: 12, padding: 16,
                transition: 'all 200ms ease', cursor: 'pointer',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
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
