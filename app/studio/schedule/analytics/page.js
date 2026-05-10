'use client';

import { useState } from 'react';
import { BarChart3, Eye, Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

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

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [platformFilter, setPlatformFilter] = useState('All');

  const filteredPosts = platformFilter === 'All' ? POSTS_DATA : POSTS_DATA.filter(p => p.platform === platformFilter);

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-bold text-2xl">Post Analytics</h1>
            <p className="text-[#666] text-sm mt-1">Track views, reach, engagement, and clicks for all your posts</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map(r => (
              <button key={r} onClick={() => setDateRange(r)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${dateRange === r ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{r}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {METRICS.map(metric => (
            <div key={metric.label} className="bg-[#111111] rounded-xl border border-white/[0.08] p-5">
              <div className="flex items-center gap-2 mb-2">
                <metric.icon size={16} className="text-[#555]" />
                <span className="text-[#555] text-xs">{metric.label}</span>
              </div>
              <p className="text-white text-2xl font-bold">{metric.value}</p>
              <p className="text-[#10B981] text-xs mt-1">{metric.change} vs last period</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111111] rounded-xl border border-white/[0.08] p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Performance Over Time</h3>
          <div className="h-40 flex items-end gap-2">
            {[65, 72, 58, 80, 85, 90, 78, 95, 88, 92, 88, 96].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-[#7C3AED] to-[#CCFF00] rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[#555] text-[10px]">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['All', 'TikTok', 'Instagram', 'YouTube', 'LinkedIn'].map(p => (
            <button key={p} onClick={() => setPlatformFilter(p)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${platformFilter === p ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{p}</button>
          ))}
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase">Post</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase">Platform</th>
                <th className="text-right p-4 text-[10px] font-semibold text-[#444] uppercase">Views</th>
                <th className="text-right p-4 text-[10px] font-semibold text-[#444] uppercase">Likes</th>
                <th className="text-right p-4 text-[10px] font-semibold text-[#444] uppercase">Comments</th>
                <th className="text-right p-4 text-[10px] font-semibold text-[#444] uppercase">Shares</th>
                <th className="text-right p-4 text-[10px] font-semibold text-[#444] uppercase">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="p-4 text-white text-sm">{post.title}</td>
                  <td className="p-4"><span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: PLATFORM_COLORS[post.platform] + '30', color: PLATFORM_COLORS[post.platform] }}>{post.platform}</span></td>
                  <td className="p-4 text-right text-[#ccc] text-xs">{post.views}</td>
                  <td className="p-4 text-right text-[#ccc] text-xs">{post.likes}</td>
                  <td className="p-4 text-right text-[#ccc] text-xs">{post.comments}</td>
                  <td className="p-4 text-right text-[#ccc] text-xs">{post.shares}</td>
                  <td className="p-4 text-right text-[#ccc] text-xs">{post.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}