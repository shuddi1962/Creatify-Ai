'use client';

import { Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function StudioHero({ icon: Icon, badge, title, subtitle, backgroundImage }) {
  return (
    <div className="relative text-center py-12 px-4 overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image 
            src={backgroundImage}
            alt=""
            fill
            className="object-cover opacity-20"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-page)]" />
        </div>
      )}
      <div className="relative z-10">
        <div className="inline-flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center border" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-subtle)' }}>
              {Icon && <Icon size={36} style={{ color: 'var(--text-primary)' }} />}
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--btn-generate-bg)' }}>
              <Sparkles size={10} style={{ color: 'var(--btn-generate-text)' }} />
            </div>
          </div>
          {badge && (
            <span className="mt-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-sm" style={{ background: 'rgba(0,200,150,0.2)', color: '#00c896' }}>
              {badge}
            </span>
          )}
        </div>
        <div className="mt-6">
          <h1 className="text-[clamp(28px,5vw,48px)] font-light uppercase leading-tight" style={{ color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
            START CREATING WITH
          </h1>
          <h2 className="text-[clamp(28px,5vw,48px)] font-extrabold uppercase leading-tight" style={{ color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
