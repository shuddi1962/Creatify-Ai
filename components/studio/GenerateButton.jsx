'use client';

import { Loader2 } from 'lucide-react';

export default function GenerateButton({ onClick, loading, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 ml-auto"
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {loading ? 'Generating...' : children || 'Generate'}
    </button>
  );
}
