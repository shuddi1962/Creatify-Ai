'use client';

import { useState } from 'react';
import { HardDrive, Trash2, Link2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const USAGE = { used: 4.2, total: 10, breakdown: { images: 1.2, videos: 2.8, audio: 0.2 } };

export default function StoragePage() {
  const [cleaning, setCleaning] = useState(false);
  const [connected, setConnected] = useState({ drive: false, dropbox: false });

  const handleCleanUp = () => {
    setCleaning(true);
    setTimeout(() => { setCleaning(false); toast.success('Storage cleaned! 1.2 GB freed'); }, 3000);
  };

  const connectDrive = () => { setConnected({ ...connected, drive: true }); toast.success('Google Drive connected!'); };
  const connectDropbox = () => { setConnected({ ...connected, dropbox: true }); toast.success('Dropbox connected!'); };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <h1 className="text-white font-bold text-2xl mb-2">Storage Manager</h1>
        <p className="text-[#666] text-sm mb-6">View and manage your storage usage</p>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <HardDrive size={24} className="text-[#CCFF00]" />
              <span className="text-white font-semibold">{USAGE.used} GB used of {USAGE.total} GB</span>
            </div>
            <button onClick={handleCleanUp} disabled={cleaning} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm rounded-lg hover:text-white flex items-center gap-2 disabled:opacity-50">
              {cleaning ? <div className="w-4 h-4 border-2 border-[#333] border-t-[#888] rounded-full animate-spin" /> : <Trash2 size={14} />}
              Clean Up
            </button>
          </div>
          <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#CCFF00] rounded-full" style={{ width: `${(USAGE.used / USAGE.total) * 100}%` }} />
          </div>
          <p className="text-[#555] text-xs mt-2">{((USAGE.used / USAGE.total) * 100).toFixed(1)}% used · {USAGE.total - USAGE.used} GB available</p>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Usage Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#7C3AED]" /><span className="text-[#888] text-sm">Images</span></div>
              <span className="text-white text-sm">{USAGE.breakdown.images} GB</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#CCFF00]" /><span className="text-[#888] text-sm">Videos</span></div>
              <span className="text-white text-sm">{USAGE.breakdown.videos} GB</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#06B6D4]" /><span className="text-[#888] text-sm">Audio</span></div>
              <span className="text-white text-sm">{USAGE.breakdown.audio} GB</span>
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-white font-semibold mb-4">Connected Storage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#4285F4]/20 rounded-lg flex items-center justify-center text-[#4285F4]"><Link2 size={16} /></div>
                <div><p className="text-white text-sm font-medium">Google Drive</p></div>
              </div>
              {connected.drive ? (
                <span className="text-[10px] text-[#10B981] px-2 py-0.5 bg-[#10B981]/20 rounded">Connected</span>
              ) : (
                <button onClick={connectDrive} className="px-3 py-1.5 bg-[#4285F4]/20 text-[#4285F4] text-xs font-semibold rounded-lg hover:bg-[#4285F4]/30 transition-all">Connect</button>
              )}
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0061FF]/20 rounded-lg flex items-center justify-center text-[#0061FF]"><Link2 size={16} /></div>
                <div><p className="text-white text-sm font-medium">Dropbox</p></div>
              </div>
              {connected.dropbox ? (
                <span className="text-[10px] text-[#10B981] px-2 py-0.5 bg-[#10B981]/20 rounded">Connected</span>
              ) : (
                <button onClick={connectDropbox} className="px-3 py-1.5 bg-[#0061FF]/20 text-[#0061FF] text-xs font-semibold rounded-lg hover:bg-[#0061FF]/30 transition-all">Connect</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}