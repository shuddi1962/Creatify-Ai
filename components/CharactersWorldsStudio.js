'use client';

import { useState } from 'react';

const TABS = [
  { id: 'mine', label: 'My Characters' },
  { id: 'library', label: 'Character Library' },
  { id: 'create', label: 'Create Character' },
  { id: 'swap', label: 'Character Swap' },
  { id: 'multi', label: 'Multi-character Scene' },
  { id: 'worlds', label: 'My Worlds' },
  { id: 'worlds-create', label: 'Create World' },
  { id: 'lighting', label: 'Lighting Presets' },
  { id: 'templates', label: 'Scene Templates' },
];

const SAMPLE_CHARACTERS = [
  { name: 'Alex Rivera', type: 'Narrator', style: 'Modern' },
  { name: 'Dr. Sarah Chen', type: 'Expert', style: 'Professional' },
  { name: 'Captain Nova', type: 'Sci-Fi', style: 'Futuristic' },
];

const TAB_MAP = { mine: 'mine', library: 'library', create: 'create', swap: 'swap', multi: 'multi', worlds: 'worlds', lighting: 'lighting', templates: 'templates' };

export default function CharactersWorldsStudio({ initialTab }) {
  const [activeTab, setActiveTab] = useState(TAB_MAP[initialTab] || 'mine');

  const renderCharacterSwap = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><path d="M16 3h5v5M8 21H3v-5M21 3l-7 7M3 21l7-7"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Character Swap</h4>
          <p className="text-xs text-[#9CA3AF]">Replace or swap characters in any existing video with AI</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Original Video</label>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#7C3AED]/30 transition-all cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" className="mx-auto mb-2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            <p className="text-xs text-[#9CA3AF]">Upload original video</p>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">New Character Reference</label>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#7C3AED]/30 transition-all cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" className="mx-auto mb-2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <p className="text-xs text-[#9CA3AF]">Upload character image</p>
          </div>
        </div>
      </div>
      <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Swap Character</button>
    </div>
  );

  const renderMultiScene = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Multi-character Scene</h4>
          <p className="text-xs text-[#9CA3AF]">Place multiple characters together in one scene</p>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider">Characters in Scene</h4>
        {['Character 1', 'Character 2', 'Character 3'].map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] text-xs font-bold">{i + 1}</div>
            <select className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-xs focus:outline-none focus:border-[#7C3AED]">
              <option className="bg-[#0D1321]">Select a character...</option>
              {SAMPLE_CHARACTERS.map(ch => <option key={ch.name} className="bg-[#0D1321]">{ch.name}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Scene Description</label>
        <textarea rows={3} placeholder="Describe the scene and character interactions..." className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] resize-none" />
      </div>
      <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Generate Scene</button>
    </div>
  );

  const renderLightingPresets = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Lighting Presets</h4>
          <p className="text-xs text-[#9CA3AF]">Apply professional lighting setups to your scenes</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { name: 'Golden Hour', icon: '🌅', temp: 'Warm' },
          { name: 'Studio Soft', icon: '💡', temp: 'Neutral' },
          { name: 'Night Scene', icon: '🌙', temp: 'Cool' },
          { name: 'Dramatic', icon: '🎭', temp: 'High Contrast' },
          { name: 'Neon City', icon: '🌆', temp: 'Colorful' },
          { name: 'Candlelight', icon: '🕯️', temp: 'Very Warm' },
          { name: 'Overcast', icon: '☁️', temp: 'Soft' },
          { name: 'Backlit', icon: '✨', temp: 'Silhouette' },
        ].map((p, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center hover:bg-white/[0.06] hover:border-[#7C3AED]/30 transition-all cursor-pointer">
            <div className="text-2xl mb-2">{p.icon}</div>
            <div className="text-sm font-medium text-[#F9FAFB]">{p.name}</div>
            <div className="text-xs text-[#9CA3AF]">{p.temp}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSceneTemplates = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'Interview Setup', desc: 'Two-person interview with professional backdrop', scenes: '3 scenes' },
          { name: 'Product Review', desc: 'Desk setup with product showcase angles', scenes: '4 scenes' },
          { name: 'Talking Head', desc: 'Solo presenter with dynamic background', scenes: '2 scenes' },
          { name: 'Outdoor Vlog', desc: 'Nature backdrop with natural lighting', scenes: '5 scenes' },
          { name: 'Cinematic', desc: 'Film-style scene with dramatic lighting', scenes: '6 scenes' },
          { name: 'Tutorial', desc: 'Screen + presenter side by side', scenes: '3 scenes' },
        ].map((t, i) => (
          <div key={i} className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#7C3AED]/30 transition-all cursor-pointer">
            <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20 mb-3 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
            </div>
            <h4 className="text-sm font-medium text-[#F9FAFB]">{t.name}</h4>
            <p className="text-xs text-[#9CA3AF] mt-1">{t.desc}</p>
            <div className="text-[10px] text-[#7C3AED] mt-2">{t.scenes}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#0A0F1E] overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
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
                <button onClick={() => setActiveTab('create')} className="px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">+ New Character</button>
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
          {activeTab === 'swap' && renderCharacterSwap()}
          {activeTab === 'multi' && renderMultiScene()}
          {activeTab === 'worlds' && (
            <div className="flex items-center justify-center py-16">
              <p className="text-[#9CA3AF] text-sm">Worlds feature coming soon</p>
            </div>
          )}
          {activeTab === 'worlds-create' && (
            <div className="flex items-center justify-center py-16">
              <p className="text-[#9CA3AF] text-sm">Worlds feature coming soon</p>
            </div>
          )}
          {activeTab === 'lighting' && renderLightingPresets()}
          {activeTab === 'templates' && renderSceneTemplates()}
        </div>
      </div>
    </div>
  );
}
