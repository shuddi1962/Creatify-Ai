'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function SetupPage() {
  const [step, setStep] = useState('welcome');
  const [serviceKey, setServiceKey] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runSetup = async () => {
    if (!serviceKey.trim()) { toast.error('Enter your service_role key'); return; }
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceRoleKey: serviceKey }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) {
        toast.success('Database initialized successfully!');
        setStep('complete');
      } else {
        toast.error('Some migrations failed');
      }
    } catch (err) {
      toast.error('Setup failed: ' + err.message);
      setResult({ success: false, error: err.message });
    }
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <Toaster position="top-center" />
      <div className="w-full max-w-lg">
        {step === 'welcome' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 bg-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-center text-[#F9FAFB] mb-2">Database Setup</h1>
            <p className="text-sm text-[#9CA3AF] text-center mb-8">
              This will create all required database tables, storage buckets, and RLS policies.
            </p>
            <div className="space-y-4 mb-8">
              <div className="bg-[#0A0F1E] rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-semibold text-[#F9FAFB] mb-2">What will be created:</h3>
                <ul className="space-y-2 text-xs text-[#9CA3AF]">
                  <li className="flex items-center gap-2">• 17 database tables (workflows, agents, media, notifications, subscriptions, etc.)</li>
                  <li className="flex items-center gap-2">• 5 storage buckets with RLS policies</li>
                  <li className="flex items-center gap-2">• Database functions and triggers</li>
                  <li className="flex items-center gap-2">• Row Level Security on all tables</li>
                </ul>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-2">
                  Supabase Service Role Key
                </label>
                <input
                  type="password"
                  value={serviceKey}
                  onChange={e => setServiceKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIs..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] text-sm font-mono outline-none focus:border-[#7C3AED]"
                />
                <p className="text-xs text-[#6B7280] mt-2">
                  Find it at: Supabase Dashboard → Settings → API → service_role key
                </p>
              </div>
            </div>
            <button
              onClick={runSetup}
              disabled={running || !serviceKey.trim()}
              className="w-full py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {running ? 'Initializing...' : 'Initialize Database'}
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-[#F9FAFB] mb-2">Setup Complete</h1>
            <p className="text-sm text-[#9CA3AF] mb-6">
              All database tables, storage buckets, and RLS policies have been created.
            </p>
            <div className="bg-[#0A0F1E] rounded-xl p-4 border border-white/5 mb-6 text-left text-xs text-[#9CA3AF]">
              {result?.results?.map((r, i) => (
                <div key={i} className={`flex items-center gap-2 py-1 ${r.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  <span>{r.status === 'success' ? '✓' : '✗'}</span>
                  <span>{r.file}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => router.push('/admin/dashboard')}
                className="flex-1 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] transition-all">
                Go to Admin
              </button>
              <button onClick={() => router.push('/admin/providers')}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[#F9FAFB] font-bold hover:bg-white/10 transition-all">
                Configure Providers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
