'use client';

export default function AdminStaff() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Staff</h2>
          <p className="text-sm text-[#9CA3AF]">Manage admin staff members</p>
        </div>
        <button className="px-3 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Invite Staff</button>
      </div>
      <div className="p-8 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 flex items-center justify-center">
        <p className="text-[#9CA3AF] text-sm">Staff management table with invite modal</p>
      </div>
    </div>
  );
}
