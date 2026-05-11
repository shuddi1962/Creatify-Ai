'use client';

export default function GenerationPanel({ children, className = '' }) {
  return (
    <div className={`max-w-[900px] mx-auto px-4 ${className}`}>
      <div className="rounded-2xl p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        {children}
      </div>
    </div>
  );
}
