'use client';

export default function PillSelector({ options = [], value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const id = typeof opt === 'string' ? opt : opt.id;
        const label = typeof opt === 'string' ? opt : opt.label;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              value === id
                ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
