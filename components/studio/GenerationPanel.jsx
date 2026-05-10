'use client';

export default function GenerationPanel({ children, className = '' }) {
  return (
    <div className={`max-w-[900px] mx-auto px-4 ${className}`}>
      <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
        {children}
      </div>
    </div>
  );
}
