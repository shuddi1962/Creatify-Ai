'use client';

export default function StylePresets({ presets, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {presets.map(preset => (
        <button
          key={preset}
          onClick={() => onChange(preset)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            value === preset
              ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
              : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
          }`}
        >
          {preset}
        </button>
      ))}
    </div>
  );
}
