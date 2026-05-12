'use client';

import toast from 'react-hot-toast';

const ROLES = [
  { id: 1, name: 'Super Admin', description: 'Full access to everything', staffCount: 2, permissions: ['Users', 'Staff', 'Content', 'Jobs', 'Models', 'SEO', 'Pages', 'Analytics', 'Settings', 'Audit'] },
  { id: 2, name: 'Admin', description: 'Most access except sensitive settings', staffCount: 3, permissions: ['Users', 'Staff', 'Content', 'Jobs', 'Models', 'SEO', 'Pages', 'Analytics', 'Audit'] },
  { id: 3, name: 'Moderator', description: 'Content moderation only', staffCount: 5, permissions: ['Content', 'Users (read)', 'Audit (read)'] },
  { id: 4, name: 'Support', description: 'User support and ticket management', staffCount: 4, permissions: ['Users (read)', 'Content (read)'] },
  { id: 5, name: 'Content Manager', description: 'Manage SEO, pages, and content', staffCount: 2, permissions: ['Content', 'SEO', 'Pages'] },
];

export default function AdminRoles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Roles</h2>
          <p className="text-sm text-[#9CA3AF]">Manage admin roles and permissions</p>
        </div>
        <button onClick={() => toast.success('Opening create role modal...')} className="px-3 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Create Role</button>
      </div>

      <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Description</th>
              <th className="text-left px-4 py-3 font-medium">Staff</th>
              <th className="text-left px-4 py-3 font-medium">Permissions</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ROLES.map(r => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-4 py-3 text-[#F9FAFB] font-medium">{r.name}</td>
                <td className="px-4 py-3 text-[#9CA3AF]">{r.description}</td>
                <td className="px-4 py-3 text-[#F9FAFB]">{r.staffCount}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {r.permissions.map(p => (
                      <span key={p} className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-[#9CA3AF]">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => toast.success(`Editing ${r.name}...`)} className="px-2 py-1 rounded text-xs bg-[#7C3AED]/20 text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-all">Edit</button>
                    <button onClick={() => toast.success(`${r.name} deleted`)} className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">Delete</button>
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
