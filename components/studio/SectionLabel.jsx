'use client';

export default function SectionLabel({ children }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
      {children}
    </label>
  );
}
