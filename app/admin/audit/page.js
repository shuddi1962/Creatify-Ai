'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const ADMINS = ['All', 'Sarah Connor', 'Mike Peters', 'Lisa Ray', 'Tom Cruz'];
const ACTION_TYPES = ['All', 'user.login', 'user.suspend', 'content.approve', 'content.delete', 'staff.invite', 'settings.update'];

const ENTRIES = [
  { timestamp: '2026-05-12 10:23:45', admin: 'Sarah Connor', action: 'user.suspend', target: 'user', targetId: 'usr_4921', details: 'Suspended for TOS violation' },
  { timestamp: '2026-05-12 09:15:22', admin: 'Mike Peters', action: 'content.approve', target: 'generation', targetId: 'gen_8812', details: 'Approved flagged image' },
  { timestamp: '2026-05-12 08:44:10', admin: 'Sarah Connor', action: 'staff.invite', target: 'staff', targetId: 'staff_003', details: 'Invited new moderator' },
  { timestamp: '2026-05-11 16:30:00', admin: 'Lisa Ray', action: 'settings.update', target: 'settings', targetId: 'global', details: 'Updated platform name' },
  { timestamp: '2026-05-11 14:12:33', admin: 'Tom Cruz', action: 'content.delete', target: 'generation', targetId: 'gen_7745', details: 'Deleted copyright-infringing video' },
  { timestamp: '2026-05-11 11:05:18', admin: 'Mike Peters', action: 'user.login', target: 'user', targetId: 'usr_1023', details: 'Manual login verification' },
];

export default function AdminAudit() {
  const [adminFilter, setAdminFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');

  const filtered = ENTRIES.filter(e => {
    return (adminFilter === 'All' || e.admin === adminFilter) && (actionFilter === 'All' || e.action === actionFilter);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Audit Log</h2>
          <p className="text-sm text-[#9CA3AF]">Track all admin actions</p>
        </div>
        <button onClick={() => toast.success('Exporting CSV...')} className="px-3 py-2 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-medium hover:bg-[#7C3AED]/30 transition-all">Export CSV</button>
      </div>

      <div className="flex gap-3">
        <select value={adminFilter} onChange={e => setAdminFilter(e.target.value)} className="px-4 py-2 rounded-lg bg-[rgba(17,24,39,0.8)] border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
          {ADMINS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="px-4 py-2 rounded-lg bg-[rgba(17,24,39,0.8)] border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
          {ACTION_TYPES.map(a => <option key={a} value={a}>{a === 'All' ? 'All Actions' : a}</option>)}
        </select>
      </div>

      <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Timestamp</th>
              <th className="text-left px-4 py-3 font-medium">Admin</th>
              <th className="text-left px-4 py-3 font-medium">Action</th>
              <th className="text-left px-4 py-3 font-medium">Target Type</th>
              <th className="text-left px-4 py-3 font-medium">Target ID</th>
              <th className="text-left px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-4 py-3 text-[#9CA3AF] font-mono text-xs">{e.timestamp}</td>
                <td className="px-4 py-3 text-[#F9FAFB]">{e.admin}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-[#7C3AED]/20 text-[#7C3AED]">{e.action}</span>
                </td>
                <td className="px-4 py-3 text-[#9CA3AF]">{e.target}</td>
                <td className="px-4 py-3 text-[#9CA3AF] font-mono text-xs">{e.targetId}</td>
                <td className="px-4 py-3 text-[#9CA3AF] text-xs">{e.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
