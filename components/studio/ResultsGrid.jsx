'use client';

import { useState } from 'react';

async function downloadFile(url, filename) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('fetch failed');
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(url, '_blank');
    }
  }
}

export default function ResultsGrid({ results, columns = 2 }) {
  const [fullView, setFullView] = useState(null);

  if (!results || results.length === 0) return null;

  return (
    <>
      <div className={`grid grid-cols-1 ${columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3'} gap-4 w-full`}>
        {results.map((result, i) => (
          <div key={result.id || i} className="bg-[#1a1a2e] rounded-2xl border border-white/[0.1] overflow-hidden group">
            <div
              className="relative aspect-square bg-[#0D0D0D] cursor-pointer"
              onClick={() => setFullView({ ...result, index: i })}
            >
              {result.url ? (
                result.type === 'video' ? (
                  <video src={result.url} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={result.url} alt="" className="w-full h-full object-contain" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-[#444] border-t-[#CCFF00] rounded-full animate-spin" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={(e) => { e.stopPropagation(); setFullView({ ...result, index: i }); }}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
                <button onClick={async (e) => { e.stopPropagation(); await downloadFile(result.url, `creatify-${result.id || i}.${result.type === 'video' ? 'mp4' : 'png'}`); }}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                </button>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between bg-[#1a1a2e]">
              <span className="text-xs text-[#888] truncate flex-1 mr-2">{result.prompt || result.model || 'Generated'}</span>
              <button onClick={() => { if (result.url) navigator.clipboard.writeText(result.url); }}
                className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#666] hover:text-white hover:bg-white/10 transition-all whitespace-nowrap">
                Copy URL
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen lightbox */}
      {fullView && (
        <div className="fixed inset-0 z-[9999] bg-black/92 flex items-center justify-center p-0"
          onClick={() => setFullView(null)}>
          <div className="flex flex-col items-center gap-4"
            style={{ maxWidth: '95vw', maxHeight: '95vh' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex gap-3 self-end">
              <button onClick={async () => { await downloadFile(fullView.url, `creatify-${fullView.id || fullView.index}.${fullView.type === 'video' ? 'mp4' : 'png'}`); }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-sm transition-all">
                Download
              </button>
              <button onClick={() => setFullView(null)}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {fullView.type === 'video' ? (
              <video src={fullView.url} controls autoPlay className="rounded-2xl shadow-2xl" style={{ maxWidth: '95vw', maxHeight: '80vh' }} />
            ) : (
              <img src={fullView.url} alt="" className="rounded-2xl shadow-2xl object-contain" style={{ maxWidth: '95vw', maxHeight: '80vh' }} />
            )}
            {fullView.prompt && (
              <div className="text-sm text-[#aaa] text-center max-w-lg">{fullView.prompt}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
