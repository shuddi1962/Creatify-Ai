'use client';

export default function AdminAudit() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Audit Log</h2>
          <p className="text-sm text-[#9CA3AF]">Track all admin actions</p>
        </div>
        <button className="px-3 py-2 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-medium hover:bg-[#7C3AED]/30 transition-all">Export CSV</button>
      </div>
      <div className="p-8 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 flex items-center justify-center">
        <p className="text-[#9CA3AF] text-sm">Audit log table with filters by admin, action, date range</p>
      </div>
    </div>
  );
}
