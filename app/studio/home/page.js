'use client';

import { useState, useEffect } from 'react';
import { Image, Video, Copy, TrendingUp, Zap, Users, Clock, BarChart3, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/src/lib/AuthProvider';

const QUICK_CREATE = [
  { icon: Image, label: 'Create Image', desc: 'Text to image generation', href: '/studio/image/text-to-image', color: '#7C3AED' },
  { icon: Video, label: 'Create Video', desc: 'Text to video generation', href: '/studio/video/text-to-video', color: '#7C3AED' },
  { icon: Copy, label: 'Bulk Generate', desc: 'Batch creation from CSV', href: '/studio/bulk/image', color: '#7C3AED' },
  { icon: TrendingUp, label: 'Get Ideas', desc: 'Trending content ideas', href: '/studio/ideas/trending', color: '#7C3AED' },
];

const RECENT_CREATIONS = [
  { id: 1, type: 'image', url: 'https://picsum.photos/seed/cre1/400/300', model: 'GPT Image 2', date: '2 min ago' },
  { id: 2, type: 'video', url: 'https://picsum.photos/seed/cre2/400/300', model: 'Kling 3.0', date: '15 min ago' },
  { id: 3, type: 'image', url: 'https://picsum.photos/seed/cre3/400/300', model: 'Nano Banana Pro', date: '1 hour ago' },
  { id: 4, type: 'audio', url: null, model: 'ElevenLabs Voiceover', date: '2 hours ago' },
  { id: 5, type: 'image', url: 'https://picsum.photos/seed/cre5/400/300', model: 'Midjourney v7', date: '3 hours ago' },
  { id: 6, type: 'video', url: 'https://picsum.photos/seed/cre6/400/300', model: 'Sora 2', date: '5 hours ago' },
];

const TRENDING_IDEAS = [
  { id: 1, title: 'Day in My Life: Tech Edition', platform: 'TikTok', virality: 92, niche: 'Tech' },
  { id: 2, title: 'POV: Finding Money in Thrift Store', platform: 'Instagram', virality: 87, niche: 'Fashion' },
  { id: 3, title: 'Morning Routine That Changed Everything', platform: 'YouTube', virality: 95, niche: 'Lifestyle' },
  { id: 4, title: 'I Tried This for 30 Days — Results', platform: 'TikTok', virality: 89, niche: 'Fitness' },
  { id: 5, title: 'Recipe Hack Nobody Tells You', platform: 'TikTok', virality: 94, niche: 'Food' },
];

export default function HomePage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleNavigate = (href) => {
    window.location.href = href;
  };

  return (
    <div className="min-h-screen bg-[#000] text-white pb-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="pt-8 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{greeting}{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : user?.email?.split('@')[0] ? `, ${user.email.split('@')[0]}` : ''}</h1>
            <span className="px-2.5 py-1 bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-bold rounded-full">PRO</span>
          </div>
          <p className="text-sm text-[#666]">You have <span className="text-[#CCFF00] font-bold">2,450 credits</span> remaining</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {QUICK_CREATE.map((item, i) => (
            <button
              key={i}
              onClick={() => handleNavigate(item.href)}
              className="bg-[#111111] rounded-2xl border border-white/[0.08] p-5 text-left hover:bg-[#161616] hover:border-white/[0.15] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}22` }}>
                <item.icon size={20} style={{ color: item.color }} />
              </div>
              <p className="text-sm font-semibold text-white mb-0.5">{item.label}</p>
              <p className="text-xs text-[#555]">{item.desc}</p>
              <ChevronRight size={16} className="text-[#333] group-hover:text-[#CCFF00] transition-all mt-3" />
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Creations</h2>
            <button onClick={() => handleNavigate('/studio/media/all')} className="text-xs text-[#7C3AED] hover:text-[#6D28D9] font-semibold">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {RECENT_CREATIONS.map((item, i) => (
              <div key={i} className="bg-[#0D0D0D] rounded-xl border border-white/[0.08] overflow-hidden group">
                <div className="relative aspect-video bg-[#1a1a1a]">
                  {item.url ? (
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  ) : item.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-[#CCFF00] rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[10px] border-l-black border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#7C3AED] rounded-full" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <ChevronRight size={20} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-[10px] text-[#555]">{item.model}</p>
                  <p className="text-[10px] text-[#444]">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Trending in Your Niche</h2>
            <button onClick={() => handleNavigate('/studio/ideas/trending')} className="text-xs text-[#7C3AED] hover:text-[#6D28D9] font-semibold">Explore</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {TRENDING_IDEAS.map((idea, i) => (
              <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4 hover:bg-[#161616] cursor-pointer transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    idea.platform === 'TikTok' ? 'bg-pink-500/20 text-pink-400' :
                    idea.platform === 'Instagram' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{idea.platform}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#7C3AED]/20 text-[#7C3AED] rounded-full">{idea.niche}</span>
                </div>
                <p className="text-sm font-medium text-white mb-3">{idea.title}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#CCFF00] rounded-full" style={{ width: `${idea.virality}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-[#CCFF00]">{idea.virality}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Usage This Month</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Image, label: 'Images Generated', value: '847', change: '+12%' },
              { icon: Video, label: 'Videos Created', value: '156', change: '+28%' },
              { icon: Users, label: 'Characters Created', value: '23', change: '+5' },
              { icon: BarChart3, label: 'Storage Used', value: '4.2 GB', change: 'of 10 GB' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={16} className="text-[#7C3AED]" />
                  <span className="text-xs text-[#555]">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-[#444]">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden">
            {[
              { action: 'Image generated', detail: 'GPT Image 2 · "Cyberpunk city at sunset"', time: '2 min ago', status: 'success' },
              { action: 'Video upscaled', detail: 'Kling 3.0 · 4K enhancement', time: '15 min ago', status: 'success' },
              { action: 'Bulk job completed', detail: '50 images from CSV batch', time: '1 hour ago', status: 'success' },
              { action: 'Lip sync generated', detail: 'Infinite Talk · portrait + audio', time: '2 hours ago', status: 'success' },
              { action: 'Voice clone created', detail: '"Professional Male Voice"', time: '5 hours ago', status: 'success' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 px-4 py-3 ${i !== 0 ? 'border-t border-white/[0.05]' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex-1">
                  <p className="text-sm text-white">{item.action}</p>
                  <p className="text-xs text-[#555]">{item.detail}</p>
                </div>
                <span className="text-xs text-[#444]">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">Recommended Apps</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Face Swap', desc: 'Swap faces instantly', badge: 'TOP', icon: '👤' },
              { name: 'VFX Effects Pack', desc: '80 trending effects', badge: 'TOP', icon: '🔥' },
              { name: 'Style Transfer', desc: 'Apply artistic styles', badge: null, icon: '🎨' },
              { name: 'Thumbnail Gen', desc: '5 YouTube thumbnails', badge: 'NEW', icon: '🖼️' },
            ].map((app, i) => (
              <button
                key={i}
                onClick={() => handleNavigate('/studio/apps/all')}
                className="bg-[#111111] rounded-xl border border-white/[0.08] p-4 text-left hover:bg-[#161616] transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{app.icon}</span>
                  {app.badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.badge === 'TOP' ? 'bg-[#CCFF00]/20 text-[#CCFF00]' : 'bg-[#7C3AED]/20 text-[#7C3AED]'}`}>{app.badge}</span>}
                </div>
                <p className="text-sm font-semibold text-white">{app.name}</p>
                <p className="text-xs text-[#555]">{app.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
