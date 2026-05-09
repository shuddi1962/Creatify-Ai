'use client';

import { useParams } from 'next/navigation';

export default function AdminUserDetail() {
  const params = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#F9FAFB]">User Profile</h2>
        <p className="text-sm text-[#9CA3AF]">User ID: {params.id}</p>
      </div>

      <div className="p-8 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#9CA3AF] text-sm">Full user profile with tabs (Overview, Creations, Billing, etc.)</p>
        </div>
      </div>
    </div>
  );
}
