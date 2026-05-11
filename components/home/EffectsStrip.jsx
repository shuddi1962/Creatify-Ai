'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const EFFECTS = [
  'Explosion', 'Raven Transition', 'Air Bending', 'Water Bending',
  'Fire Tornado', 'Shadow Smoke', 'Splash Transition', 'Flame On',
  'Melt Transition', 'Point Cloud', 'Giant Grab', 'Earth Wave',
  'Train Rush', 'Flame Transition', 'Flying Camera', 'Animalization',
  'Firelava', 'Ahegao', 'Earth Zoom Out', 'Mouth In',
];

export default function EffectsStrip() {
  const ref = useRef(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Visual Effects</h2>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Big-budget visual effects \u2014 from explosions to surreal transformations
          </p>
        </div>
        <Link
          href="/studio/cinema/vfx"
          className="hidden sm:inline-flex items-center gap-1 text-[#CCFF00] text-[12px] font-semibold hover:underline"
        >
          View All Effects <ChevronRight size={14} />
        </Link>
      </div>
      <div ref={ref} className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {EFFECTS.map((effect, i) => (
          <Link
            key={i}
            href="/studio/cinema/vfx"
            className="flex-shrink-0 px-3.5 py-2 rounded-lg text-[12px] transition-all"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            {effect}
          </Link>
        ))}
        <Link
          href="/studio/cinema/vfx"
          className="flex-shrink-0 inline-flex items-center gap-1 px-3.5 py-2 text-[12px] text-[#CCFF00] font-semibold hover:underline"
        >
          + more <ChevronRight size={14} />
        </Link>
      </div>
      <Link
        href="/studio/cinema/vfx"
        className="sm:hidden inline-flex items-center gap-1 text-[#CCFF00] text-[12px] font-semibold mt-2 hover:underline"
      >
        View All Effects <ChevronRight size={14} />
      </Link>
    </div>
  );
}
