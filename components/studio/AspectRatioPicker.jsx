'use client';

export default function AspectRatioPicker({ value, onChange, options = ['1:1', '16:9', '9:16', '4:3', '3:4', '2:3', '3:2'] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            value === opt
              ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
              : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
