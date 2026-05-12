'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

const TABS = ['Overview', 'Generations', 'Billing', 'Activity'];

export default function AdminUserDetail() {
  const params = useParams();
  const [tab, setTab] = useState('Overview');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#F9FAFB]">User Profile</h2>
        <p className="text-sm text-[#9CA3AF]">User ID: {params.id}</p>
      </div>

      <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-2xl font-bold">JD</div>
          <div>
            <h3 className="text-lg font-bold text-[#F9FAFB]">John Doe</h3>
            <p className="text-sm text-[#9CA3AF]">john@example.com</p>
          </div>
        </div>

        <div className="flex gap-1 border-b border-white/10 pb-1 mb-6">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${tab === t ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-[#9CA3AF]">Total Generations</p>
                <p className="text-xl font-bold text-[#F9FAFB]">1,247</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-[#9CA3AF]">Credits Used</p>
                <p className="text-xl font-bold text-[#F9FAFB]">5,832</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-[#9CA3AF]">Plan</p>
                <p className="text-xl font-bold text-[#7C3AED]">Pro</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-[#9CA3AF]">Member Since</p>
                <p className="text-xl font-bold text-[#F9FAFB]">Jan 2025</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => toast.success('Opening edit profile...')} className="px-3 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Edit Profile</button>
              <button onClick={() => toast.success('Opening add credits...')} className="px-3 py-2 rounded-lg bg-[#06B6D4]/20 text-[#06B6D4] text-xs font-medium hover:bg-[#06B6D4]/30 transition-all">Add Credits</button>
              <button onClick={() => toast.success('User suspended')} className="px-3 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs font-medium hover:bg-yellow-500/30 transition-all">Suspend</button>
              <button onClick={() => toast.success('User deleted')} className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-all">Delete</button>
            </div>
          </div>
        )}

        {tab === 'Generations' && (
          <p className="text-[#9CA3AF] text-sm">Generation history will render here.</p>
        )}
        {tab === 'Billing' && (
          <p className="text-[#9CA3AF] text-sm">Billing information will render here.</p>
        )}
        {tab === 'Activity' && (
          <p className="text-[#9CA3AF] text-sm">Activity log will render here.</p>
        )}
      </div>
    </div>
  );
}
