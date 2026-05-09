'use client';

export default function AdminMarketing() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#F9FAFB]">Marketing</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 flex items-center justify-center">
          <p className="text-[#9CA3AF] text-sm">Promo codes table with create modal</p>
        </div>
        <div className="p-8 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 flex items-center justify-center">
          <p className="text-[#9CA3AF] text-sm">Referral settings & platform banners</p>
        </div>
      </div>
    </div>
  );
}
