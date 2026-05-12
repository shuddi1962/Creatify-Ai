'use client';

import { useState } from 'react';
import { Edit, Trash2, Play, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const POSTS = [
  { id: 1, title: 'Product launch reel', caption: 'Introducing our new product...', platform: 'TikTok', thumbnail: 'https://picsum.photos/seed/sp1/100/60', scheduled: 'May 12, 9:00 AM', status: 'scheduled' },
  { id: 2, title: 'Behind the scenes', caption: 'A look at our creative process...', platform: 'Instagram', thumbnail: 'https://picsum.photos/seed/sp2/100/60', scheduled: 'May 14, 2:00 PM', status: 'scheduled' },
  { id: 3, title: 'Tutorial video', caption: 'How to use our app...', platform: 'YouTube', thumbnail: 'https://picsum.photos/seed/sp3/100/60', scheduled: 'May 15, 6:00 PM', status: 'scheduled' },
  { id: 4, title: 'Weekly tip', caption: 'Quick tip for productivity...', platform: 'LinkedIn', thumbnail: null, scheduled: 'May 16, 10:00 AM', status: 'draft' },
];

const PLATFORM_COLORS = { TikTok: '#FF0050', Instagram: '#E4405F', YouTube: '#FF0000', LinkedIn: '#0A66C2' };
const FILTERS = ['All', 'TikTok', 'Instagram', 'YouTube', 'LinkedIn'];

export default function ScheduledPostsPage() {
  const [posts, setPosts] = useState(POSTS);
  const [platformFilter, setPlatformFilter] = useState('All');
  const filtered = platformFilter === 'All' ? posts : posts.filter(p => p.platform === platformFilter);

  const deletePost = (id) => setPosts(posts.filter(p => p.id !== id));

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="PLATFORMS">
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
              SCHEDULED POSTS
            </h1>
            <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Content</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Platform</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scheduled</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(post => (
                    <tr key={post.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {post.thumbnail && <img src={post.thumbnail} style={{ width: 40, height: 28, borderRadius: 4, objectFit: 'cover' }} alt="" />}
                          <div>
                            <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>{post.title}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>{post.caption}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: `${PLATFORM_COLORS[post.platform]}30`, color: PLATFORM_COLORS[post.platform] }}>{post.platform}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {post.scheduled}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: 10, padding: '2px 8px', borderRadius: 4,
                          background: post.status === 'scheduled' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                          color: post.status === 'scheduled' ? '#10B981' : '#F59E0B',
                        }}>{post.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => toast.success('Edit post coming soon')} style={{ padding: 6, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: 'var(--text-muted)', cursor: 'pointer' }}><Edit size={12} /></button>
                          <button onClick={() => toast.success('Preview post')} style={{ padding: 6, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: 'var(--text-muted)', cursor: 'pointer' }}><Play size={12} /></button>
                          <button onClick={() => deletePost(post.id)} style={{ padding: 6, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: '#ef4444', cursor: 'pointer' }}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Posts">
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {filtered.length} post{filtered.length !== 1 ? 's' : ''}
          </span>
        </DirectorBar>
      }
    />
  );
}
