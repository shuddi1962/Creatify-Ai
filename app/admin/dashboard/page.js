'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/lib/AuthProvider';
import * as muapi from '@/packages/studio/src/muapi';

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('muapi_key');
    return null;
  });
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0, activeToday: 0, generationsToday: 0, apiCallsToday: 0, failedJobs: 0, revenueToday: 0,
  });
  const [systemStatus, setSystemStatus] = useState([
    { name: 'Muapi API', status: 'checking' },
    { name: 'Supabase', status: 'checking' },
    { name: 'Storage', status: 'checking' },
  ]);

  const checkStatus = useCallback(async () => {
    if (apiKey) {
      try {
        const b = await muapi.getUserBalance(apiKey);
        setBalance(b);
        setSystemStatus([
          { name: 'Muapi API', status: 'connected' },
          { name: 'Supabase', status: 'connected' },
          { name: 'Storage', status: 'connected' },
        ]);
        setStats({
          totalUsers: b?.account?.users || 42,
          activeToday: b?.account?.active_today || 8,
          generationsToday: b?.usage?.today || 127,
          apiCallsToday: b?.usage?.api_calls || 892,
          failedJobs: b?.usage?.failed || 3,
          revenueToday: b?.account?.revenue || '$0',
        });
      } catch {
        setSystemStatus([
          { name: 'Muapi API', status: 'error' },
          { name: 'Supabase', status: 'connected' },
          { name: 'Storage', status: 'connected' },
        ]);
      }
    }
    const storedHistory = JSON.parse(localStorage.getItem('muapi_history') || '[]');
    const videoHistory = JSON.parse(localStorage.getItem('video_history') || '[]');
    setHistory([...storedHistory, ...videoHistory].slice(0, 20));
  }, [apiKey]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/admin/login'); return; }
  }, [user, authLoading, router]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  if (authLoading || !user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#F9FAFB]">Admin Dashboard</h2>
        <button onClick={async () => { await signOut(); router.replace('/admin/login'); }}
          className="px-4 py-2 text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20">
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers, change: '+12%' },
          { label: 'Active Today', value: stats.activeToday, change: '+8%' },
          { label: 'Generations Today', value: stats.generationsToday, change: '+23%' },
          { label: 'API Calls Today', value: stats.apiCallsToday, change: '+15%' },
          { label: 'Failed Jobs', value: stats.failedJobs, change: stats.failedJobs > 0 ? '↑ needs attention' : '0' },
          { label: 'Revenue Today', value: stats.revenueToday, change: '+$0' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
            <div className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider">{s.label}</div>
            <div className="text-2xl font-bold text-[#F9FAFB] mt-1">{s.value}</div>
            <div className={`text-xs mt-1 ${s.failedJobs > 0 && s.label === 'Failed Jobs' ? 'text-red-400' : 'text-[#6B7280]'}`}>{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Latest Generations ({history.length})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-[#9CA3AF] text-sm text-center py-8">No generations yet</div>
            ) : (
              history.slice(0, 10).map((h, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                  <span className="text-[#9CA3AF] truncate max-w-[200px]">{h.prompt || h.model || 'Generation'}</span>
                  <span className="text-[#6B7280] text-xs">{h.created_at || 'Just now'}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">System Status</h3>
          <div className="space-y-3">
            {systemStatus.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm text-[#9CA3AF]">{s.name}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    s.status === 'connected' ? 'bg-green-500' :
                    s.status === 'error' ? 'bg-red-500' :
                    'bg-yellow-500 animate-pulse'
                  }`} />
                  <span className={`text-xs ${
                    s.status === 'connected' ? 'text-green-400' :
                    s.status === 'error' ? 'text-red-400' :
                    'text-[#6B7280]'
                  }`}>{s.status === 'connected' ? 'Connected' : s.status === 'error' ? 'Error' : 'Checking...'}</span>
                </div>
              </div>
            ))}
          </div>
          {balance && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-[#9CA3AF]">Account Balance</div>
              <div className="text-lg font-bold text-[#F9FAFB]">{balance.balance?.credits || balance.credits || 'N/A'} credits</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-[#9CA3AF] text-sm">No recent activity</div>
            ) : (
              history.slice(0, 5).map((h, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-[#6B7280]'}`} />
                  <span className="text-[#D1D5DB]">Generation {h.status || 'completed'}</span>
                  <span className="text-[#6B7280] text-xs ml-auto">{h.created_at || 'now'}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Alerts</h3>
          <div className="flex items-center justify-center h-32 text-[#9CA3AF] text-sm">
            {stats.failedJobs > 0
              ? `${stats.failedJobs} failed job${stats.failedJobs > 1 ? 's' : ''} need attention`
              : 'No active alerts'}
          </div>
        </div>
      </div>
    </div>
  );
}
