'use client';

import { useState } from 'react';

export default function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) { setError('Please enter your API key'); return; }
    onSave(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-inter" style={{ background: 'var(--bg-app)' }}>
      <div className="w-full max-w-sm backdrop-blur-xl rounded-xl p-10 shadow-2xl" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-strong)' }}>
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group transition-colors" style={{ background: 'rgba(217,255,0,0.05)', border: '1px solid rgba(217,255,0,0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="1.5" className="group-hover:scale-110 transition-transform">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L12 17.25l-4.5-4.5L15.5 7.5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            Creatify AI
          </h1>
          <p className="text-[13px] leading-relaxed px-4" style={{ color: 'var(--text-secondary)' }}>
            Enter your <a href="https://muapi.ai/access-keys" target="_blank" rel="noreferrer" className="text-[#d9ff00] hover:text-[#e5ff33] transition-colors">Muapi.ai</a> API key to start creating
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold ml-1" style={{ color: 'var(--text-secondary)' }}>
              API Access Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => { setKey(e.target.value); setError(''); }}
              placeholder="Paste your key here..."
              className="w-full rounded-md px-5 py-3 text-sm transition-all"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
              suppressHydrationWarning
            />
            {error && <p className="mt-2 text-red-500/80 text-[11px] font-medium ml-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#d9ff00] text-black font-medium py-2.5 rounded-md hover:bg-[#e5ff33] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#d9ff00]/5"
            suppressHydrationWarning
          >
            Get Started
          </button>

        <p className="text-center text-[12px] pt-2" style={{ color: 'var(--text-quaternary)' }}>
          Need a key?{' '}
          <a href="https://muapi.ai/access-keys" target="_blank" rel="noreferrer" className="transition-colors font-medium" style={{ color: 'var(--text-icon)' }}>
              Get one free →
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
