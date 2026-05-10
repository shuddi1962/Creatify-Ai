'use client';

import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function DrivePage() {
  const [connected, setConnected] = useState(false);
  const handleConnect = () => { setConnected(true); toast.success('Google Drive connected!'); };
  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <h1 className="text-white font-bold text-2xl mb-2">Google Drive</h1>
        <p className="text-[#666] text-sm mb-8">Connect Google Drive to save and sync your generated content</p>
        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-12 text-center">
          <div className="w-16 h-16 bg-[#4285F4]/20 rounded-2xl flex items-center justify-center mx-auto mb-4"><Link2 size={32} className="text-[#4285F4]" /></div>
          {connected ? (
            <div><p className="text-white font-semibold mb-2">Connected to Google Drive</p><p className="text-[#555] text-sm">Your files are being synced</p></div>
          ) : (
            <div><button onClick={handleConnect} className="px-8 py-3 bg-[#4285F4] text-white font-bold rounded-xl hover:bg-[#3b73e5] transition-all">Connect Google Drive</button></div>
          )}
        </div>
      </div>
    </div>
  );
}