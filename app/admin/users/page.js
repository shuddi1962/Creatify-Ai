'use client';

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Users</h2>
          <p className="text-sm text-[#9CA3AF]">Manage all platform users</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-medium hover:bg-[#7C3AED]/30 transition-all">Export CSV</button>
          <button className="px-3 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Invite User</button>
        </div>
      </div>

      <div className="p-8 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <p className="text-[#9CA3AF] text-sm">User management table will render here</p>
          <p className="text-[#6B7280] text-xs mt-1">With search, filters, pagination, and bulk actions</p>
        </div>
      </div>
    </div>
  );
}
