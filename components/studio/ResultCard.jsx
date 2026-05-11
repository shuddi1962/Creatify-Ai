'use client';

import { Download, Share2, Edit, ExternalLink } from 'lucide-react';
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
    <div className="result-card" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 12, overflow: 'hidden',
      position: 'relative',
      transition: 'all 200ms ease',
    }}>
      <div style={{ position: 'relative', paddingTop: '75%', background: 'var(--bg-input)' }}>
        {result.type === 'video' ? (
          <video src={result.url} controls className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <img src={result.url} alt={result.prompt || 'Generated'} className="absolute inset-0 w-full h-full object-cover" />
        )}
        
        <div className="result-overlay" style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, opacity: 0,
          transition: 'opacity 200ms, background 200ms',
        }}>
          <button onClick={handleDownload} title="Download" style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 16,
          }}>⬇</button>
          <button title="Edit in Inpaint" style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 16,
          }}>✏️</button>
          <button title="Use as reference" style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 16,
          }}>🔗</button>
          <button onClick={handleShare} title="Share" style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 16,
          }}>📤</button>
        </div>
      </div>

      <div style={{
        padding: '10px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>
            {result.model || 'Generated'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {result.duration || '2.5'}s · {result.credits || 4} credits used
          </div>
        </div>
        <button style={{
          background: 'var(--bg-input)', border: '1px solid var(--border-default)',
          borderRadius: 6, padding: '4px 10px', fontSize: 11,
          color: 'var(--text-secondary)', cursor: 'pointer',
        }}>
          Use
        </button>
      </div>
    </div>
  );
}
