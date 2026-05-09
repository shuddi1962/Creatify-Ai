'use client';

import { useState } from 'react';

const TABS = [
  { id: 'mine', label: 'My Characters', desc: 'View and manage your characters' },
  { id: 'library', label: 'Character Library', desc: 'Browse the character template library' },
  { id: 'create', label: 'Create Character', desc: 'Design a new AI character' },
  { id: 'worlds', label: 'My Worlds', desc: 'View and manage your worlds' },
  { id: 'worlds-create', label: 'Create World', desc: 'Build a new immersive world' },
];

const SAMPLE_CHARACTERS = [
  { name: 'Alex Rivera', type: 'Narrator', style: 'Modern', image: null },
  { name: 'Dr. Sarah Chen', type: 'Expert', style: 'Professional', image: null },
  { name: 'Captain Nova', type: 'Sci-Fi', style: 'Futuristic', image: null },
];

export default function CharactersWorldsStudio() {
  const [activeTab, setActiveTab] = useState('mine');

  return (
    <div className="flex-1 bg-[#0A0F1E] overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Characters & Worlds</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Create consistent AI characters and immersive worlds</p>
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
          {activeTab === 'mine' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#F9FAFB]">My Characters</h3>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all"
                >
                  + New Character
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SAMPLE_CHARACTERS.map((c, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20 mb-3 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <h4 className="text-sm font-medium text-[#F9FAFB]">{c.name}</h4>
                    <p className="text-xs text-[#9CA3AF]">{c.type} • {c.style}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'library' && (
            <div className="flex items-center justify-center py-16">
              <p className="text-[#9CA3AF] text-sm">Character template library coming soon</p>
            </div>
          )}
          {activeTab === 'create' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Character Name</label>
                <input type="text" placeholder="Enter character name..." className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Description</label>
                <textarea rows={4} placeholder="Describe your character's appearance, personality, and backstory..." className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] resize-none" />
              </div>
              <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Create Character</button>
            </div>
          )}
          {activeTab.startsWith('worlds') && (
            <div className="flex items-center justify-center py-16">
              <p className="text-[#9CA3AF] text-sm">Worlds feature coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
