'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const STAFF = [
  { id: 1, name: 'Sarah Connor', email: 'sarah@creatify.ai', role: 'Admin', lastActive: '2 min ago' },
  { id: 2, name: 'Mike Peters', email: 'mike@creatify.ai', role: 'Moderator', lastActive: '1 hour ago' },
  { id: 3, name: 'Lisa Ray', email: 'lisa@creatify.ai', role: 'Support', lastActive: '3 hours ago' },
  { id: 4, name: 'Tom Cruz', email: 'tom@creatify.ai', role: 'Admin', lastActive: 'Yesterday' },
  { id: 5, name: 'Nina Williams', email: 'nina@creatify.ai', role: 'Moderator', lastActive: '2 days ago' },
];

export default function AdminStaff() {
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Moderator');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Staff</h2>
          <p className="text-sm text-[#9CA3AF]">Manage admin staff members</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-3 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Invite Staff</button>
      </div>

      <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Last Active</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {STAFF.map(s => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-4 py-3 text-[#F9FAFB] font-medium">{s.name}</td>
                <td className="px-4 py-3 text-[#9CA3AF]">{s.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.role === 'Admin' ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : s.role === 'Moderator' ? 'bg-[#06B6D4]/20 text-[#06B6D4]' : 'bg-white/10 text-[#9CA3AF]'}`}>{s.role}</span>
                </td>
                <td className="px-4 py-3 text-[#9CA3AF]">{s.lastActive}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => toast.success(`Editing ${s.name}...`)} className="px-2 py-1 rounded text-xs bg-[#7C3AED]/20 text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-all">Edit</button>
                    <button onClick={() => toast.success(`${s.name} access revoked`)} className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">Revoke</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md p-6 rounded-xl bg-[#0A0F1E] border border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-[#F9FAFB] mb-4">Invite Staff</h3>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[rgba(17,24,39,0.8)] border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED]"
              />
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[rgba(17,24,39,0.8)] border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]"
              >
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="Support">Support</option>
              </select>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-white/10 text-[#F9FAFB] text-xs font-medium hover:bg-white/20 transition-all">Cancel</button>
              <button onClick={() => { toast.success(`Invitation sent to ${inviteEmail}`); setShowModal(false); }} className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
