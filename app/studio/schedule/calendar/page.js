'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Image, Video } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

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
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [selectedPost, setSelectedPost] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDate = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-bold text-2xl">Content Calendar</h1>
            <p className="text-[#666] text-sm mt-1">Drag-and-drop visual calendar for all your scheduled posts</p>
          </div>
          <div className="flex gap-2">
            {['month', 'week', 'day'].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${view === v ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#888] hover:text-white"><ChevronLeft size={16} /></button>
            <h2 className="text-white font-semibold text-lg">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#888] hover:text-white"><ChevronRight size={16} /></button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all"><Plus size={14} /> New Post</button>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/[0.08]">
            {DAYS.map(d => <div key={d} className="py-3 text-center text-[10px] font-semibold text-[#444] uppercase tracking-widest">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} className="h-28 border border-white/[0.04]" />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dayPosts = posts.filter(p => p.date === formatDate(day));
              return (
                <div key={day} className="h-28 border border-white/[0.04] p-1 cursor-pointer hover:bg-[#1a1a1a] transition-all">
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${day === 10 ? 'bg-[#CCFF00] text-black' : 'text-[#555]'}`}>{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayPosts.slice(0, 2).map(post => (
                      <div key={post.id} className="flex items-center gap-1 p-1 bg-[#1a1a1a] rounded text-[9px] cursor-pointer" onClick={() => setSelectedPost(post)}>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[post.platform] || '#7C3AED' }} />
                        <span className="text-white truncate">{post.title.slice(0, 15)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}