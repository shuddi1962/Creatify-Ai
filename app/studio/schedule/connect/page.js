'use client';

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const PLATFORMS = [
  { name: 'TikTok', color: '#FF0050', icon: '♪', connected: false, handle: null },
  { name: 'Instagram', color: '#E4405F', icon: '◉', connected: false, handle: null },
  { name: 'YouTube', color: '#FF0000', icon: '▶', connected: false, handle: null },
  { name: 'LinkedIn', color: '#0A66C2', icon: 'in', connected: false, handle: null },
  { name: 'Twitter', color: '#1DA1F2', icon: '✈', connected: false, handle: null },
  { name: 'Pinterest', color: '#E60023', icon: '◐', connected: false, handle: null },
  { name: 'Facebook', color: '#1877F2', icon: 'f', connected: false, handle: null },
  { name: 'Snapchat', color: '#FFFC00', icon: '👻', connected: false, handle: null },
];

export default function ConnectPage() {
  const [platforms, setPlatforms] = useState(PLATFORMS);

  const connect = (name) => toast.success(`Connecting to ${name}...`);
  const disconnect = (name) => {
    setPlatforms(platforms.map(p => p.name === name ? { ...p, connected: false, handle: null } : p));
    toast.success(`${name} disconnected`);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <h1 className="text-white font-bold text-2xl mb-2">Connect Social Accounts</h1>
        <p className="text-[#666] text-sm mb-8">Link your social media accounts to schedule and publish directly</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
          {platforms.map(platform => (
            <div key={platform.name} className="bg-[#111111] rounded-xl border border-white/[0.08] p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: platform.color + '30' }}>
                <span style={{ color: platform.color }}>{platform.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{platform.name}</h3>
                {platform.connected ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span className="text-[#10B981] text-xs">{platform.handle || 'Connected'}</span>
                  </div>
                ) : (
                  <p className="text-[#555] text-xs mt-1">Schedule and publish {platform.name} content</p>
                )}
              </div>
              {platform.connected ? (
                <button onClick={() => disconnect(platform.name)} className="px-4 py-2 bg-[#1a1a1a] text-red-500 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-all">Disconnect</button>
              ) : (
                <button onClick={() => connect(platform.name)} className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] transition-all">Connect</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}