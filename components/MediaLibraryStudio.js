'use client';

import { useState } from 'react';

const TABS = [
  { id: 'all', label: 'All Assets' },
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
  { id: 'projects', label: 'Projects' },
  { id: 'storage', label: 'Connected Storage' },
];

const SAMPLE_ASSETS = [
  { type: 'image', name: 'Sunset landscape', date: '2 days ago', size: '2.4 MB' },
  { type: 'video', name: 'Product showcase', date: '5 days ago', size: '45 MB' },
  { type: 'audio', name: 'Voiceover narration', date: '1 week ago', size: '3.1 MB' },
  { type: 'image', name: 'Character portrait', date: '1 week ago', size: '1.8 MB' },
  { type: 'video', name: 'TikTok compilation', date: '2 weeks ago', size: '120 MB' },
];

export default function MediaLibraryStudio() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex-1 bg-[#0A0F1E] overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Media Library</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Organize, store, and manage all your creative assets</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
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
          <button className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_ASSETS.map((asset, i) => (
            <div key={i} className="p-4 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 hover:bg-[rgba(17,24,39,0.95)] transition-all cursor-pointer group">
              <div className={`w-full aspect-video rounded-lg mb-3 flex items-center justify-center ${
                asset.type === 'image' ? 'bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20' :
                asset.type === 'video' ? 'bg-gradient-to-br from-[#EC4899]/20 to-[#F59E0B]/20' :
                'bg-gradient-to-br from-[#10B981]/20 to-[#3B82F6]/20'
              }`}>
                {asset.type === 'image' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                {asset.type === 'video' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
                {asset.type === 'audio' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>}
              </div>
              <h4 className="text-sm font-medium text-[#F9FAFB] truncate">{asset.name}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-[#9CA3AF]">{asset.date}</span>
                <span className="text-xs text-[#6B7280]">{asset.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
