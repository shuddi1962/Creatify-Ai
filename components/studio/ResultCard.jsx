'use client';

import { Download, Share2, Edit, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResultCard({ result }) {
  const handleDownload = () => {
    if (result.url) {
      const a = document.createElement('a');
      a.href = result.url;
      a.download = result.filename || 'output';
      a.click();
      toast.success('Download started');
    }
  };

  const handleShare = () => {
    if (result.url) {
      navigator.clipboard.writeText(result.url);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="bg-[#0D0D0D] rounded-xl border border-white/[0.08] overflow-hidden">
      <div className="relative aspect-video bg-[#1a1a1a]">
        {result.type === 'video' ? (
          <video src={result.url} controls className="w-full h-full object-cover" />
        ) : (
          <img src={result.url} alt={result.prompt || 'Generated'} className="w-full h-full object-contain" />
        )}
        {result.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-[#CCFF00] rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[14px] border-l-black border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent ml-1" />
            </div>
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs text-[#555] truncate flex-1 mr-2">{result.prompt || result.model || 'Result'}</span>
        <div className="flex items-center gap-1">
          <button onClick={handleDownload} className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white transition-all" title="Download">
            <Download size={14} />
          </button>
          <button onClick={handleShare} className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white transition-all" title="Share">
            <Share2 size={14} />
          </button>
          {result.editHref && (
            <button onClick={() => window.location.href = result.editHref} className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white transition-all" title="Edit">
              <Edit size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
