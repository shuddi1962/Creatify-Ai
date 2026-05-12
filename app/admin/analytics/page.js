'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days'];
const MODELS = [
  { name: 'Flux Pro', usage: 45 },
  { name: 'Kling 3', usage: 32 },
  { name: 'Midjourney v7', usage: 28 },
  { name: 'Seedance 2', usage: 21 },
  { name: 'Runway Gen-3', usage: 15 },
];

export default function AdminAnalytics() {
  const [range, setRange] = useState('Last 7 days');
  const maxUsage = Math.max(...MODELS.map(m => m.usage));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Analytics</h2>
          <p className="text-sm text-[#9CA3AF]">Platform analytics and insights</p>
        </div>
        <button onClick={() => toast.success('Exporting CSV...')} className="px-3 py-2 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-medium hover:bg-[#7C3AED]/30 transition-all">Export CSV</button>
      </div>

      <div className="flex gap-2">
        {RANGES.map(r => (
          <button key={r} onClick={() => setRange(r)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${range === r ? 'bg-[#7C3AED] text-white' : 'bg-white/10 text-[#9CA3AF] hover:bg-white/20'}`}>{r}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Generations', value: '12,847', color: 'from-[#7C3AED] to-[#06B6D4]' },
          { label: 'Active Users', value: '3,421', color: 'from-[#06B6D4] to-[#10B981]' },
          { label: 'Credits Used', value: '89,230', color: 'from-[#F59E0B] to-[#EF4444]' },
          { label: 'API Calls', value: '142,501', color: 'from-[#8B5CF6] to-[#EC4899]' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10">
            <p className="text-xs text-[#9CA3AF]">{s.label}</p>
            <p className="text-xl font-bold text-[#F9FAFB]">{s.value}</p>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full w-3/4 rounded-full bg-gradient-to-r ${s.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 p-6">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Top Models</h3>
          <div className="space-y-3">
            {MODELS.map(m => (
              <div key={m.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#F9FAFB]">{m.name}</span>
                  <span className="text-[#9CA3AF]">{m.usage}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]" style={{ width: `${(m.usage / maxUsage) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 p-6">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Generations by Type</h3>
          <div className="space-y-3">
            {[{ type: 'Images', pct: 58 }, { type: 'Videos', pct: 25 }, { type: 'Audio', pct: 12 }, { type: 'Other', pct: 5 }].map(item => (
              <div key={item.type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#F9FAFB]">{item.type}</span>
                  <span className="text-[#9CA3AF]">{item.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#06B6D4] to-[#10B981]" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 p-6">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Daily Signups</h3>
          <div className="flex items-end gap-1.5 h-24">
            {[30, 45, 38, 52, 48, 62, 55, 70, 58, 42, 65, 50, 72, 60].map((v, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#7C3AED] to-[#06B6D4] transition-all hover:opacity-80" style={{ height: `${(v / 72) * 100}%` }} title={`${v} signups`} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#6B7280] mt-2">
            <span>Apr 29</span>
            <span>May 12</span>
          </div>
        </div>
      </div>
    </div>
  );
}
