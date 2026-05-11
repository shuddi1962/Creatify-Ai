'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GRADIENTS = {
  'IMAGE STUDIO': 'linear-gradient(135deg, #3730a3 0%, #1e1b4b 100%)',
  'VIDEO STUDIO': 'linear-gradient(135deg, #1e3a5f 0%, #0c1a2e 100%)',
  'CONTENT IDEAS': 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
  'BULK GENERATE': 'linear-gradient(135deg, #44200a 0%, #1c0a02 100%)',
  'MARKETING STUDIO': 'linear-gradient(135deg, #3b0764 0%, #1a0330 100%)',
};

const CARDS = [
  { label: 'IMAGE STUDIO', name: 'Create stunning visuals with 14+ tools', href: '/studio/image/text-to-image', img: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { label: 'VIDEO STUDIO', name: 'Animate anything \u2014 text, image, motion', href: '/studio/video/text-to-video', img: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { label: 'CONTENT IDEAS', name: 'Trending topics for any niche, any region', href: '/studio/ideas', img: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { label: 'BULK GENERATE', name: '500 images or videos from one CSV upload', href: '/studio/bulk/image', img: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { label: 'MARKETING STUDIO', name: 'UGC ads, hooks, and product demos at scale', href: '/studio/marketing/ugc', img: 'https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=800' },
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
        {CARDS.map((card, i) => {
          const gradient = GRADIENTS[card.label] || 'linear-gradient(135deg, #3730a3, #1e1b4b)';
          return (
            <Link
              key={i}
              href={card.href}
              className="relative w-[320px] h-[180px] rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer border transition-all duration-200 hover:-translate-y-0.5 group home-section-card"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
            >
              <div className="absolute inset-0 z-0" style={{ background: gradient, opacity: 0.4 }} />
              <img src={card.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <p className="text-[9px] font-semibold text-[#00C896] tracking-[0.1em] uppercase mb-1">{card.label}</p>
                <p className="text-[13px] font-semibold text-white leading-tight">{card.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center transition-all -ml-3"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
        aria-label="Scroll left"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center transition-all -mr-3"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
        aria-label="Scroll right"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
