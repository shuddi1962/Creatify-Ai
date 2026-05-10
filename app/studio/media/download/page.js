'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <h1 className="text-white font-bold text-2xl mb-2">Export & Download</h1>
        <p className="text-[#666] text-sm mb-8">Download your generated content individually or in bulk</p>
        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-12 text-center">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4"><Download size={32} className="text-[#444]" /></div>
          <p className="text-[#555] text-sm">Select assets from Media Library to download</p>
        </div>
      </div>
    </div>
  );
}