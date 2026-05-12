'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const SAMPLE_POSTS = [
  { id: 1, title: 'Product launch reel', platform: 'TikTok', time: '9:00 AM', thumbnail: 'https://picsum.photos/seed/post1/100/60', status: 'scheduled' },
  { id: 2, title: 'Behind the scenes', platform: 'Instagram', time: '2:00 PM', thumbnail: 'https://picsum.photos/seed/post2/100/60', status: 'scheduled' },
  { id: 3, title: 'Tutorial video', platform: 'YouTube', time: '6:00 PM', thumbnail: 'https://picsum.photos/seed/post3/100/60', status: 'draft' },
];

const PLATFORM_COLORS = { TikTok: '#FF0050', Instagram: '#E4405F', YouTube: '#FF0000', LinkedIn: '#0A66C2' };

export default function ScheduleCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 10));
  const [view, setView] = useState('month');
  const [posts] = useState(SAMPLE_POSTS);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDate = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="VIEW">
          {['month', 'week', 'day'].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: view === v ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: view === v ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', textTransform: 'capitalize',
              }}
            >{v} view</button>
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
              textAlign: 'center', marginBottom: 16,
            }}>
              CONTENT CALENDAR
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={prevMonth}
                  style={{ width: 32, height: 32, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <ChevronLeft size={14} />
                </button>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 16 }}>{MONTHS[month]} {year}</span>
                <button onClick={nextMonth}
                  style={{ width: 32, height: 32, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-subtle)' }}>
                {DAYS.map(d => (
                  <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} style={{ minHeight: 100, borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dayPosts = posts.filter(p => p.date === formatDate(day));
                  return (
                    <div key={day} style={{ minHeight: 100, borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: 4, cursor: 'pointer' }}>
                      <span style={{
                        display: 'inline-block', width: 22, height: 22, lineHeight: '22px', textAlign: 'center',
                        fontSize: 11, fontWeight: 600, borderRadius: '50%',
                        background: day === 10 ? '#CCFF00' : 'transparent',
                        color: day === 10 ? '#000' : 'var(--text-muted)',
                      }}>{day}</span>
                      <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {dayPosts.slice(0, 2).map(post => (
                          <div key={post.id} style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '2px 6px', background: 'var(--bg-input)', borderRadius: 4,
                            fontSize: 9,
                          }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: PLATFORM_COLORS[post.platform] || 'var(--accent-bg)' }} />
                            <span style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Calendar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton credits={0}>
              <Plus size={14} /> New Post
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
