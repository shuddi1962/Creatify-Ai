'use client';

import { useState } from 'react';
import { Eye, Heart, ExternalLink } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const METRICS = [
  { label: 'Total Views', value: '1.2M', change: '+12%', icon: Eye },
  { label: 'Total Reach', value: '890K', change: '+8%', icon: Eye },
  { label: 'Avg Engagement', value: '6.4%', change: '+3%', icon: Heart },
  { label: 'Total Clicks', value: '45K', change: '+15%', icon: ExternalLink },
];

const POSTS_DATA = [
  { title: 'Product launch reel', platform: 'TikTok', date: 'May 8', views: '245K', likes: '18.2K', comments: '890', shares: '2.1K', clicks: '4.2K' },
  { title: 'Behind the scenes', platform: 'Instagram', date: 'May 7', views: '125K', likes: '9.8K', comments: '456', shares: '890', clicks: '2.1K' },
  { title: 'Tutorial video', platform: 'YouTube', date: 'May 6', views: '89K', likes: '4.2K', comments: '234', shares: '567', clicks: '1.8K' },
  { title: 'Quick tip', platform: 'LinkedIn', date: 'May 5', views: '45K', likes: '2.1K', comments: '123', shares: '345', clicks: '890' },
  { title: 'Meme post', platform: 'TikTok', date: 'May 4', views: '320K', likes: '28.9K', comments: '1.2K', shares: '3.4K', clicks: '5.1K' },
];

const PLATFORM_COLORS = { TikTok: '#FF0050', Instagram: '#E4405F', YouTube: '#FF0000', LinkedIn: '#0A66C2' };
const FILTERS = ['All', 'TikTok', 'Instagram', 'YouTube', 'LinkedIn'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [platformFilter, setPlatformFilter] = useState('All');
  const filteredPosts = platformFilter === 'All' ? POSTS_DATA : POSTS_DATA.filter(p => p.platform === platformFilter);

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="PLATFORM">
          {FILTERS.map(p => (
            <button key={p} onClick={() => setPlatformFilter(p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: platformFilter === p ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: platformFilter === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{p}</button>
          ))}
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '8px 0' }} />
          {['7d', '30d', '90d', '1y'].map(r => (
            <button key={r} onClick={() => setDateRange(r)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: dateRange === r ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: dateRange === r ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{r}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, padding: 24, width: '100%', maxHeight: '100%', overflowY: 'auto' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 24,
            }}>
              POST ANALYTICS
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
              {METRICS.map(metric => (
                <div key={metric.label} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <metric.icon size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{metric.label}</span>
                  </div>
                  <p style={{ color: 'var(--text-primary)', fontSize: 24, fontWeight: 700 }}>{metric.value}</p>
                  <p style={{ color: '#10B981', fontSize: 11, marginTop: 4 }}>{metric.change} vs last period</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 20, marginBottom: 24 }}>
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Performance Over Time</h3>
              <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                {[65, 72, 58, 80, 85, 90, 78, 95, 88, 92, 88, 96].map((h, i) => (
                  <div key={i} style={{ flex: 1, background: 'linear-gradient(to top, var(--accent-bg), #CCFF00)', borderRadius: '4px 4px 0 0', height: `${h}%` }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map(m => (
                  <span key={m} style={{ color: 'var(--text-muted)', fontSize: 10 }}>{m}</span>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Post</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Platform</th>
                    <th style={{ padding: 12, textAlign: 'right', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Views</th>
                    <th style={{ padding: 12, textAlign: 'right', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Likes</th>
                    <th style={{ padding: 12, textAlign: 'right', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Comments</th>
                    <th style={{ padding: 12, textAlign: 'right', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shares</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: 12, color: 'var(--text-primary)', fontSize: 13 }}>{post.title}</td>
                      <td style={{ padding: 12 }}>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: `${PLATFORM_COLORS[post.platform]}30`, color: PLATFORM_COLORS[post.platform] }}>{post.platform}</span>
                      </td>
                      <td style={{ padding: 12, textAlign: 'right', color: 'var(--text-secondary)', fontSize: 12 }}>{post.views}</td>
                      <td style={{ padding: 12, textAlign: 'right', color: 'var(--text-secondary)', fontSize: 12 }}>{post.likes}</td>
                      <td style={{ padding: 12, textAlign: 'right', color: 'var(--text-secondary)', fontSize: 12 }}>{post.comments}</td>
                      <td style={{ padding: 12, textAlign: 'right', color: 'var(--text-secondary)', fontSize: 12 }}>{post.shares}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Analytics">
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {dateRange} view
          </span>
        </DirectorBar>
      }
    />
  );
}
