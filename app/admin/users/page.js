'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', plan: 'Pro', status: 'Active', joined: '2025-01-15', initial: 'A', color: 'bg-blue-500' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', plan: 'Free', status: 'Active', joined: '2025-02-20', initial: 'B', color: 'bg-green-500' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', plan: 'Enterprise', status: 'Suspended', joined: '2024-11-10', initial: 'C', color: 'bg-purple-500' },
  { id: 4, name: 'Dave Brown', email: 'dave@example.com', plan: 'Pro', status: 'Active', joined: '2025-03-05', initial: 'D', color: 'bg-yellow-500' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', plan: 'Free', status: 'Active', joined: '2025-04-12', initial: 'E', color: 'bg-pink-500' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', plan: 'Enterprise', status: 'Banned', joined: '2024-08-22', initial: 'F', color: 'bg-red-500' },
];

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const filtered = USERS.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || u.plan === filter || u.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Users</h2>
          <p className="text-sm text-[#9CA3AF]">Manage all platform users</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.success('Exporting...')} className="px-3 py-2 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-medium hover:bg-[#7C3AED]/30 transition-all">Export CSV</button>
          <button onClick={() => toast.success('Opening invite modal...')} className="px-3 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Invite User</button>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-[rgba(17,24,39,0.8)] border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] transition-all"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[rgba(17,24,39,0.8)] border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED] transition-all"
        >
          <option value="">All</option>
          <option value="Free">Free</option>
          <option value="Pro">Pro</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Banned">Banned</option>
        </select>
      </div>

      <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Plan</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${u.color} flex items-center justify-center text-white text-xs font-bold`}>{u.initial}</div>
                    <span className="text-[#F9FAFB] font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#9CA3AF]">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.plan === 'Pro' ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : u.plan === 'Enterprise' ? 'bg-[#06B6D4]/20 text-[#06B6D4]' : 'bg-white/10 text-[#9CA3AF]'}`}>{u.plan}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'Active' ? 'bg-green-500/20 text-green-400' : u.status === 'Suspended' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{u.status}</span>
                </td>
                <td className="px-4 py-3 text-[#9CA3AF]">{u.joined}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => toast.success(`Editing ${u.name}...`)} className="px-2 py-1 rounded text-xs bg-[#7C3AED]/20 text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-all">Edit</button>
                    <button onClick={() => toast.success(`${u.name} suspended`)} className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all">Suspend</button>
                    <button onClick={() => toast.success(`${u.name} deleted`)} className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
