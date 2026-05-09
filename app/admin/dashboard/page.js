'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats] = useState([
    { label: 'Total Users', value: '—', change: '+0%' },
    { label: 'Active Today', value: '—', change: '+0%' },
    { label: 'Generations Today', value: '—', change: '+0%' },
    { label: 'API Calls Today', value: '—', change: '+0%' },
    { label: 'Failed Jobs', value: '—', change: '0' },
    { label: 'Revenue Today', value: '—', change: '$0' },
  ]);

  const [systemStatus] = useState([
    { name: 'Muapi API', status: 'checking' },
    { name: 'Supabase', status: 'checking' },
    { name: 'Storage', status: 'checking' },
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
            <div className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider">{s.label}</div>
            <div className="text-2xl font-bold text-[#F9FAFB] mt-1">{s.value}</div>
            <div className="text-xs text-[#6B7280] mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">7-Day Overview</h3>
          <div className="h-48 flex items-center justify-center text-[#9CA3AF] text-sm">
            Chart will render here with real data
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">System Status</h3>
          <div className="space-y-3">
            {systemStatus.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm text-[#9CA3AF]">{s.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-xs text-[#6B7280]">Checking...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Recent Activity</h3>
          <div className="flex items-center justify-center h-32 text-[#9CA3AF] text-sm">
            Live activity feed loading...
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Alerts</h3>
          <div className="flex items-center justify-center h-32 text-[#9CA3AF] text-sm">
            No active alerts
          </div>
        </div>
      </div>
    </div>
  );
}
