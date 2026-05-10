'use client';

import { Sparkles } from 'lucide-react';

export default function StudioHero({ icon: Icon, badge, title, subtitle }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex flex-col items-center">
        <div className="relative">
          <div className="w-20 h-20 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-white/8">
            {Icon && <Icon size={36} className="text-white" />}
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#CCFF00] rounded-full flex items-center justify-center">
            <Sparkles size={10} className="text-black" />
          </div>
        </div>
        {badge && (
          <span className="mt-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#7C3AED]/20 text-[#7C3AED] rounded-sm">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-6">
        <h1 className="text-[clamp(28px,5vw,48px)] font-light text-[#555] tracking-[0.02em] uppercase leading-tight">
          START CREATING WITH
        </h1>
        <h2 className="text-[clamp(28px,5vw,48px)] font-extrabold text-white tracking-[0.02em] uppercase leading-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-3 text-sm text-[#666] max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
