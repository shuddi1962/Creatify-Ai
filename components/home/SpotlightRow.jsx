'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CARDS = [
  { label: 'IMAGE STUDIO', name: 'Create stunning visuals with 14+ tools', href: '/studio/image/text-to-image', gradient: 'from-violet-950 to-purple-950' },
  { label: 'VIDEO STUDIO', name: 'Animate anything \u2014 text, image, motion', href: '/studio/video/text-to-video', gradient: 'from-blue-950 to-indigo-950' },
  { label: 'CONTENT IDEAS', name: 'Trending topics for any niche, any region', href: '/studio/ideas', gradient: 'from-emerald-950 to-teal-950' },
  { label: 'BULK GENERATE', name: '500 images or videos from one CSV upload', href: '/studio/bulk/image', gradient: 'from-amber-950 to-orange-950' },
  { label: 'MARKETING STUDIO', name: 'UGC ads, hooks, and product demos at scale', href: '/studio/marketing/ugc', gradient: 'from-rose-950 to-pink-950' },
];

export default function SpotlightRow() {
  const ref = useRef(null);

  const scroll = (dir) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div ref={ref} className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {CARDS.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="relative w-[320px] h-[180px] rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer border border-white/[0.08] bg-[#141414] transition-all duration-200 hover:border-white/20 hover:-translate-y-0.5 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-[9px] font-semibold text-[#888] tracking-[0.1em] uppercase mb-1">{card.label}</p>
              <p className="text-[13px] font-semibold text-white leading-tight">{card.name}</p>
            </div>
          </Link>
        ))}
      </div>
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all -ml-3"
        aria-label="Scroll left"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all -mr-3"
        aria-label="Scroll right"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
