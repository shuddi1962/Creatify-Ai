'use client';

export default function ResultsGrid({ results, columns = 3 }) {
  if (!results || results.length === 0) return null;

  return (
    <div className={`mt-8 grid grid-cols-1 ${columns === 3 ? 'sm:grid-cols-2 md:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
      {results.map((result, i) => (
        <div key={result.id || i} className="bg-[#0D0D0D] rounded-xl border border-white/[0.08] overflow-hidden">
          <div className="relative aspect-video bg-[#1a1a1a]">
            {result.url ? (
              result.type === 'video' ? (
                <video src={result.url} controls className="w-full h-full object-cover" />
              ) : (
                <img src={result.url} alt="" className="w-full h-full object-contain" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#333] border-t-[#CCFF00] rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="p-3 flex items-center justify-between">
            <span className="text-xs text-[#555] truncate flex-1 mr-2">{result.prompt || result.model || 'Result'}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (result.url) {
                    const a = document.createElement('a');
                    a.href = result.url;
                    a.download = `creatify-${result.id || i}.${result.type === 'video' ? 'mp4' : 'png'}`;
                    a.click();
                  }
                }}
                className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              </button>
              <button
                onClick={() => {
                  if (result.url) {
                    navigator.clipboard.writeText(result.url);
                  }
                }}
                className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
