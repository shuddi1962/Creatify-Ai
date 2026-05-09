'use client';

export default function AdminContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#F9FAFB]">Content Moderation</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 flex items-center justify-center">
          <p className="text-[#9CA3AF] text-sm">Flagged content queue with approve/delete</p>
        </div>
        <div className="p-8 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 flex items-center justify-center">
          <p className="text-[#9CA3AF] text-sm">NSFW thresholds & blocked keywords</p>
        </div>
      </div>
    </div>
  );
}
