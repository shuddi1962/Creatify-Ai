'use client';

export default function SectionLabel({ children }) {
  return (
    <label className="block text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2">
      {children}
    </label>
  );
}
