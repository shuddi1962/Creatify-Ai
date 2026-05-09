'use client';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#F9FAFB]">Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 flex items-center justify-center">
          <p className="text-[#9CA3AF] text-sm">Platform settings: name, logo, favicon</p>
        </div>
        <div className="p-8 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 flex items-center justify-center">
          <p className="text-[#9CA3AF] text-sm">Feature flags, maintenance mode, API keys</p>
        </div>
      </div>
    </div>
  );
}
