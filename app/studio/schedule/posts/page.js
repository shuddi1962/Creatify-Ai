'use client';

import { useState } from 'react';
import { Edit, Trash2, Play, Clock, Filter } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const POSTS = [
  { id: 1, title: 'Product launch reel', caption: 'Introducing our new product...', platform: 'TikTok', thumbnail: 'https://picsum.photos/seed/sp1/100/60', scheduled: 'May 12, 9:00 AM', status: 'scheduled' },
  { id: 2, title: 'Behind the scenes', caption: 'A look at our creative process...', platform: 'Instagram', thumbnail: 'https://picsum.photos/seed/sp2/100/60', scheduled: 'May 14, 2:00 PM', status: 'scheduled' },
  { id: 3, title: 'Tutorial video', caption: 'How to use our app...', platform: 'YouTube', thumbnail: 'https://picsum.photos/seed/sp3/100/60', scheduled: 'May 15, 6:00 PM', status: 'scheduled' },
  { id: 4, title: 'Weekly tip', caption: 'Quick tip for productivity...', platform: 'LinkedIn', thumbnail: null, scheduled: 'May 16, 10:00 AM', status: 'draft' },
];

const PLATFORM_COLORS = { TikTok: '#FF0050', Instagram: '#E4405F', YouTube: '#FF0000', LinkedIn: '#0A66C2' };

export default function ScheduledPostsPage() {
  const [posts, setPosts] = useState(POSTS);
  const [platformFilter, setPlatformFilter] = useState('All');

  const filtered = platformFilter === 'All' ? posts : posts.filter(p => p.platform === platformFilter);

  const deletePost = (id) => { setPosts(posts.filter(p => p.id !== id)); toast.success('Post deleted'); };
  const publishNow = (title) => toast.success(`Publishing "${title}"...`);

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-bold text-2xl">Scheduled Posts</h1>
            <p className="text-[#666] text-sm mt-1">View and manage all your upcoming social media posts</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['All', 'TikTok', 'Instagram', 'YouTube', 'LinkedIn'].map(p => (
            <button key={p} onClick={() => setPlatformFilter(p)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${platformFilter === p ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{p}</button>
          ))}
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase">Content</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase">Platform</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase">Scheduled</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase">Status</th>
                <th className="text-left p-4 text-[10px] font-semibold text-[#444] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id} className="border-b border-white/[0.04]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {post.thumbnail && <img src={post.thumbnail} className="w-12 h-8 rounded object-cover" alt="" />}
                      <div>
                        <p className="text-white text-sm font-medium">{post.title}</p>
                        <p className="text-[#555] text-xs truncate max-w-[200px]">{post.caption}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: PLATFORM_COLORS[post.platform] + '30', color: PLATFORM_COLORS[post.platform] }}>{post.platform}</span>
                  </td>
                  <td className="p-4"><span className="text-[#555] text-xs flex items-center gap-1"><Clock size={12} /> {post.scheduled}</span></td>
                  <td className="p-4"><span className={`text-[10px] px-2 py-0.5 rounded ${post.status === 'scheduled' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>{post.status}</span></td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => toast.success('Opening editor...')} className="p-1.5 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><Edit size={14} /></button>
                      <button onClick={() => toast.success('Rescheduling...')} className="p-1.5 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all"><Clock size={14} /></button>
                      <button onClick={() => publishNow(post.title)} className="p-1.5 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-[#CCFF00] transition-all"><Play size={14} /></button>
                      <button onClick={() => deletePost(post.id)} className="p-1.5 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}