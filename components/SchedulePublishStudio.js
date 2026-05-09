'use client';

import { useState } from 'react';

const TABS = [
  { id: 'calendar', label: 'Calendar View' },
  { id: 'posts', label: 'Scheduled Posts' },
  { id: 'new', label: 'New Post' },
  { id: 'connect', label: 'Connect Accounts' },
  { id: 'captions', label: 'Caption Generator' },
  { id: 'format', label: 'Platform Formatter' },
  { id: 'analytics', label: 'Post Analytics' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SchedulePublishStudio({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'calendar');

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startDay = startOfMonth.getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const renderNewPost = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Content</label>
        <textarea rows={4} placeholder="Write your post content or paste a video URL..." className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Platform</label>
          <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
            {['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter/X'].map(p => <option key={p} className="bg-[#0D1321]">{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Schedule Date</label>
          <input type="date" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Schedule Time</label>
        <input type="time" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]" />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Caption</label>
        <textarea rows={3} placeholder="Write your caption..." className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-[#F9FAFB] cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7C3AED] focus:ring-[#7C3AED]" />
          Auto-generate hashtags
        </label>
      </div>
      <div className="flex gap-3">
        <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Schedule Post</button>
        <button className="px-6 py-2.5 rounded-lg bg-white/5 text-[#9CA3AF] text-sm font-medium hover:bg-white/10 transition-all">Save as Draft</button>
      </div>
    </div>
  );

  const renderCaptionGenerator = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Topic / Description</label>
        <textarea rows={3} placeholder="Describe your post or video content..." className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Tone</label>
          <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
            {['Professional', 'Casual', 'Funny', 'Inspirational', 'Educational'].map(t => <option key={t} className="bg-[#0D1321]">{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Hashtags Count</label>
          <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
            {[5, 10, 15, 20, 30].map(c => <option key={c} className="bg-[#0D1321]">{c} hashtags</option>)}
          </select>
        </div>
      </div>
      <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Generate Caption & Hashtags</button>
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <p className="text-xs text-[#9CA3AF] text-center">Generated captions and hashtags will appear here</p>
      </div>
    </div>
  );

  const renderPlatformFormatter = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Platform Formatter</h4>
          <p className="text-xs text-[#9CA3AF]">Auto-resize your video to the perfect aspect ratio for each platform</p>
        </div>
      </div>
      <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#7C3AED]/30 transition-all cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" className="mx-auto mb-2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        <p className="text-xs text-[#9CA3AF]">Upload a video to format</p>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Output Formats</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { format: '9:16', label: 'TikTok / Reels', icon: '📱' },
            { format: '16:9', label: 'YouTube', icon: '🖥️' },
            { format: '1:1', label: 'Instagram Feed', icon: '📐' },
            { format: '4:5', label: 'Instagram Portrait', icon: '📲' },
          ].map((f, i) => (
            <label key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7C3AED] focus:ring-[#7C3AED]" />
              <div>
                <div className="text-sm font-medium text-[#F9FAFB]">{f.format}</div>
                <div className="text-[10px] text-[#9CA3AF]">{f.label}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Format & Export</button>
    </div>
  );

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
                    <div key={day} className={`text-center py-2 rounded-lg text-sm relative cursor-pointer transition-all ${isToday ? 'bg-[#7C3AED]/20 text-[#7C3AED] font-bold' : 'text-[#F9FAFB] hover:bg-white/5'}`}>
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
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Scheduled Posts</h3>
              {[
                { title: 'Product Launch Reel', platform: 'Instagram', date: 'May 12, 2026', status: 'Scheduled' },
                { title: 'Behind the Scenes', platform: 'TikTok', date: 'May 14, 2026', status: 'Draft' },
                { title: 'Weekly Roundup', platform: 'LinkedIn', date: 'May 16, 2026', status: 'Scheduled' },
              ].map((post, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#F9FAFB]">{post.title}</div>
                    <div className="text-xs text-[#9CA3AF]">{post.platform} • {post.date}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${post.status === 'Scheduled' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{post.status}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'new' && renderNewPost()}
          {activeTab === 'captions' && renderCaptionGenerator()}
          {activeTab === 'format' && renderPlatformFormatter()}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Posts', value: '24', change: '+12%' },
                  { label: 'Total Reach', value: '45.2K', change: '+28%' },
                  { label: 'Engagement Rate', value: '8.3%', change: '+2.1%' },
                  { label: 'Followers', value: '1,234', change: '+156' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-xs text-[#9CA3AF] mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold text-[#F9FAFB]">{stat.value}</div>
                    <div className="text-xs text-green-400">{stat.change}</div>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#F9FAFB] mb-4">Performance Over Time</h4>
                <div className="h-48 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                  <div className="flex items-end gap-2 h-32">
                    {[65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80, 88].map((h, i) => (
                      <div key={i} className="w-6 rounded-t-lg bg-gradient-to-t from-[#7C3AED] to-[#06B6D4]" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#9CA3AF]">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#F9FAFB] mb-4">Top Performing Posts</h4>
                <div className="space-y-2">
                  {[
                    { title: 'Product Launch Reel', platform: 'Instagram', views: '12.5K', engagement: '9.2%' },
                    { title: 'Behind the Scenes', platform: 'TikTok', views: '8.3K', engagement: '11.4%' },
                    { title: 'Tutorial Video', platform: 'YouTube', views: '15.2K', engagement: '7.8%' },
                  ].map((post, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#F9FAFB]">{post.title}</div>
                        <div className="text-xs text-[#9CA3AF]">{post.platform}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-[#F9FAFB]">{post.views}</div>
                        <div className="text-xs text-green-400">{post.engagement}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
