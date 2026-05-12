'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const PROMOS = [
  { code: 'LAUNCH20', type: '%', value: 20, uses: '45/100', expires: '2026-06-30', status: 'Active' },
  { code: 'FREEMONTH', type: 'Credits', value: 100, uses: '12/50', expires: '2026-07-15', status: 'Active' },
  { code: 'VIP50', type: '%', value: 50, uses: '3/10', expires: '2026-05-20', status: 'Active' },
  { code: 'OLD20', type: 'Fixed', value: 20, uses: '100/100', expires: '2026-04-01', status: 'Expired' },
];

export default function AdminMarketing() {
  const [referralEnabled, setReferralEnabled] = useState(true);
  const [rewardAmount, setRewardAmount] = useState(50);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#F9FAFB]">Marketing</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#F9FAFB]">Promo Codes</h3>
            <button onClick={() => toast.success('Opening create promo code modal...')} className="px-3 py-1.5 rounded text-xs bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all">Create Promo Code</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="text-left px-2 py-2 font-medium">Code</th>
                  <th className="text-left px-2 py-2 font-medium">Type</th>
                  <th className="text-left px-2 py-2 font-medium">Value</th>
                  <th className="text-left px-2 py-2 font-medium">Uses</th>
                  <th className="text-left px-2 py-2 font-medium">Expires</th>
                  <th className="text-left px-2 py-2 font-medium">Status</th>
                  <th className="text-right px-2 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {PROMOS.map(p => (
                  <tr key={p.code} className="border-b border-white/5">
                    <td className="px-2 py-2 text-[#F9FAFB] font-mono text-xs">{p.code}</td>
                    <td className="px-2 py-2 text-[#9CA3AF]">{p.type}</td>
                    <td className="px-2 py-2 text-[#F9FAFB]">{p.value}{p.type === '%' ? '%' : ''}</td>
                    <td className="px-2 py-2 text-[#9CA3AF]">{p.uses}</td>
                    <td className="px-2 py-2 text-[#9CA3AF]">{p.expires}</td>
                    <td className="px-2 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{p.status}</span>
                    </td>
                    <td className="px-2 py-2 text-right">
                      <button onClick={() => toast.success(`Editing ${p.code}...`)} className="px-2 py-1 rounded text-xs bg-[#7C3AED]/20 text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-all">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 p-6">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Referral Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#F9FAFB]">Enable Referrals</span>
              <button
                onClick={() => { setReferralEnabled(!referralEnabled); toast.success(`Referrals ${referralEnabled ? 'disabled' : 'enabled'}`); }}
                className={`w-10 h-5 rounded-full transition-all ${referralEnabled ? 'bg-[#7C3AED]' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${referralEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#F9FAFB]">Reward Amount (credits)</span>
              <input
                type="number"
                value={rewardAmount}
                onChange={e => setRewardAmount(Number(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm text-right focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <button onClick={() => toast.success('Referral settings saved')} className="w-full px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Save Settings</button>
          </div>
        </div>

      </div>
    </div>
  );
}
