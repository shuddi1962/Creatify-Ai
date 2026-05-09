'use client';

import { useState } from 'react';

const TABS = [
  { id: 'calendar', label: 'Calendar View' },
  { id: 'connect', label: 'Connect Accounts' },
  { id: 'posts', label: 'Scheduled Posts' },
  { id: 'analytics', label: 'Post Analytics' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SchedulePublishStudio() {
  const [activeTab, setActiveTab] = useState('calendar');

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startDay = startOfMonth.getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  return (
    <div className="flex-1 bg-[#0A0F1E] overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Schedule & Publish</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Plan, schedule, and publish content across platforms</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30' : 'text-[#9CA3AF] hover:text-[#F9FAFB] border border-transparent'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)]">
          {activeTab === 'calendar' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[#F9FAFB]">{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white/5 text-[#9CA3AF] hover:bg-white/10 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <button className="p-2 rounded-lg bg-white/5 text-[#9CA3AF] hover:bg-white/10 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[10px] font-medium text-[#9CA3AF] py-2">{d}</div>
                ))}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === today.getDate();
                  const hasPost = [5, 12, 19, 26].includes(day);
                  return (
                    <div
                      key={day}
                      className={`text-center py-2 rounded-lg text-sm relative cursor-pointer transition-all ${
                        isToday ? 'bg-[#7C3AED]/20 text-[#7C3AED] font-bold' : 'text-[#F9FAFB] hover:bg-white/5'
                      }`}
                    >
                      {day}
                      {hasPost && <div className="w-1 h-1 rounded-full bg-[#06B6D4] mx-auto mt-0.5" />}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider mb-3">Today's Schedule</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="w-1 h-8 rounded-full bg-[#06B6D4]" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-[#F9FAFB]">Product Launch Reel</div>
                      <div className="text-[10px] text-[#9CA3AF]">Instagram • 3:00 PM</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Scheduled</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="w-1 h-8 rounded-full bg-[#F59E0B]" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-[#F9FAFB]">Behind the Scenes</div>
                      <div className="text-[10px] text-[#9CA3AF]">TikTok • 6:30 PM</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">Draft</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'connect' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Connected Accounts</h3>
              {[
                { name: 'TikTok', connected: false },
                { name: 'Instagram', connected: false },
                { name: 'YouTube', connected: false },
                { name: 'LinkedIn', connected: false },
                { name: 'Twitter/X', connected: false },
              ].map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-medium text-[#F9FAFB]">{platform.name}</span>
                  <button className="px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Connect</button>
                </div>
              ))}
            </div>
          )}
          {(activeTab === 'posts' || activeTab === 'analytics') && (
            <div className="flex items-center justify-center py-16">
              <p className="text-[#9CA3AF] text-sm">Coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
