'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

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
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Calendar} title="CONTENT CALENDAR" subtitle="Plan and schedule your content creation pipeline" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#888] hover:text-white"><ChevronLeft size={16} /></button>
            <h2 className="text-white font-semibold text-lg">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#888] hover:text-white"><ChevronRight size={16} /></button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('month')} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${view === 'month' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#666]'}`}>Month</button>
            <button onClick={() => setView('week')} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${view === 'week' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#666]'}`}>Week</button>
            <button onClick={handleBulkGenerate} className="px-4 py-1.5 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] transition-all">Generate All This Week</button>
          </div>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/[0.08]">
            {DAYS.map(d => (
              <div key={d} className="py-3 text-center text-[10px] font-semibold text-[#444] uppercase tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {[...Array(firstDay)].map((_, i) => (
              <div key={`empty-${i}`} className="h-24 border border-white/[0.04]" />
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateKey = formatDate(day);
              const dayEvents = events[dateKey] || [];
              return (
                <div key={day} className="h-24 border border-white/[0.04] p-1 relative group">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${day === 10 ? 'bg-[#CCFF00] text-black' : 'text-[#555]'}`}>{day}</span>
                    <button onClick={() => handleAddEvent(day)} className="opacity-0 group-hover:opacity-100 w-5 h-5 bg-[#1a1a1a] rounded text-[#444] hover:text-[#CCFF00] flex items-center justify-center transition-all"><Plus size={12} /></button>
                  </div>
                  <div className="mt-1 space-y-0.5 overflow-hidden">
                    {dayEvents.map(ev => (
                      <div key={ev.id} className="text-[9px] px-1.5 py-0.5 rounded truncate flex items-center gap-1" style={{ backgroundColor: STATUS_COLORS[ev.status] + '30', color: STATUS_COLORS[ev.status] }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[ev.status] }} />
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-[#555]">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}