'use client';

import { Loader2 } from 'lucide-react';

export default function GenerateButton({ onClick, loading, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        padding: '12px 28px',
        background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)',
        color: 'var(--btn-generate-text)',
        border: 'none', borderRadius: 12,
        fontSize: 15, fontWeight: 800,
        cursor: loading ? 'not-allowed' : 'pointer',
        letterSpacing: '0.02em',
        transition: 'opacity 150ms, transform 100ms',
        display: 'flex', alignItems: 'center', gap: 8,
        marginLeft: 'auto',
      }}
      onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {loading && <Loader2 size={16} style={{ animation: 'spin 600ms linear infinite' }} />}
      {loading ? 'Generating...' : children || 'Generate'}
    </button>
  );
}
