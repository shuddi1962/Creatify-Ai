'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const STATUS_COLORS = { Idea: '#7C3AED', Script: '#7C3AED', Generated: '#10B981', Scheduled: '#F59E0B', Published: '#22C55E' };

const SAMPLE_CALENDAR = {
  '2026-05-12': [{ id: 1, title: 'Morning routine', platform: 'TikTok', status: 'Generated' }],
  '2026-05-14': [{ id: 2, title: 'Budget makeover', platform: 'Instagram', status: 'Scheduled' }],
  '2026-05-18': [{ id: 3, title: 'Side hustle reveal', platform: 'LinkedIn', status: 'Idea' }],
  '2026-05-21': [{ id: 4, title: 'Pet grooming', platform: 'TikTok', status: 'Script' }],
  '2026-05-28': [{ id: 5, title: 'Fitness challenge', platform: 'YouTube', status: 'Scheduled' }],
};

export default function IdeasCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 10));
  const [view, setView] = useState('month');
  const [events, setEvents] = useState(SAMPLE_CALENDAR);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDate = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const handleAddEvent = (day) => {
    const date = formatDate(day);
    const newEvent = { id: Date.now(), title: 'New Idea', platform: 'TikTok', status: 'Idea' };
    setEvents({ ...events, [date]: [...(events[date] || []), newEvent] });
    toast.success('Idea added to calendar');
  };

  const handleBulkGenerate = () => {
    toast.success('All pending ideas queued for script generation');
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="VIEW">
          <button onClick={() => setView('month')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: view === 'month' ? 'var(--accent-bg)' : 'none',
              border: 'none', cursor: 'pointer', borderRadius: 8,
              color: view === 'month' ? 'var(--accent-text)' : 'var(--text-secondary)',
              fontSize: 13, textAlign: 'left',
            }}
          >Month View</button>
          <button onClick={() => setView('week')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: view === 'week' ? 'var(--accent-bg)' : 'none',
              border: 'none', cursor: 'pointer', borderRadius: 8,
              color: view === 'week' ? 'var(--accent-text)' : 'var(--text-secondary)',
              fontSize: 13, textAlign: 'left',
            }}
          >Week View</button>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            CONTENT CALENDAR
          </h1>
          <div style={{ zIndex: 1, marginTop: 16, width: '100%', maxWidth: 640, padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={prevMonth} style={{ width: 32, height: 32, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronLeft size={16} /></button>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{MONTHS[month]} {year}</h2>
                <button onClick={nextMonth} style={{ width: 32, height: 32, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><ChevronRight size={16} /></button>
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-subtle)' }}>
                {DAYS.map(d => <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d}</div>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} style={{ height: 96, border: '1px solid rgba(255,255,255,0.04)' }} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dateKey = formatDate(day);
                  const dayEvents = events[dateKey] || [];
                  return (
                    <div key={day} style={{ height: 96, border: '1px solid rgba(255,255,255,0.04)', padding: 4, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: day === 10 ? '#CCFF00' : 'transparent', color: day === 10 ? '#000' : '#555' }}>{day}</span>
                        <button onClick={() => handleAddEvent(day)} style={{ width: 20, height: 20, background: 'var(--bg-input)', border: 'none', borderRadius: 4, cursor: 'pointer', color: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}><Plus size={12} /></button>
                      </div>
                      <div style={{ marginTop: 4, overflow: 'hidden', flex: 1 }}>
                        {dayEvents.map(ev => (
                          <div key={ev.id} style={{ fontSize: 9, padding: '2px 4px', borderRadius: 4, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4, background: STATUS_COLORS[ev.status] + '30', color: STATUS_COLORS[ev.status] }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[ev.status], flexShrink: 0 }} />
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Calendar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
            <button onClick={handleBulkGenerate} style={{ padding: '8px 16px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Generate All This Week</button>
          </div>
        </DirectorBar>
      }
    />
  );
}
