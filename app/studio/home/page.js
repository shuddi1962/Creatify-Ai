'use client';

import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import SpotlightRow from '@/components/home/SpotlightRow';
import FeatureBlock from '@/components/home/FeatureBlock';
import ToolCard from '@/components/home/ToolCard';
import CommunityStrip from '@/components/home/CommunityStrip';
import EffectsStrip from '@/components/home/EffectsStrip';

const MODEL_PILLS = [
  { label: 'Nano Banana Pro', href: '/studio/image/text-to-image' },
  { label: 'Seedance 2.0', href: '/studio/video/text-to-video' },
  { label: 'Kling 3.0', href: '/studio/video/text-to-video' },
  { label: 'Bulk Generate', href: '/studio/bulk/image' },
  { label: 'Content Ideas', href: '/studio/ideas' },
  { label: 'Voice Cloning', href: '/studio/audio/voice-clone' },
  { label: 'Smart Shot', href: '/studio/video/smart-shot' },
];

const TOOLS_DATA = [
  { name: 'Create Image', description: 'Generate AI images', href: '/studio/image/text-to-image', gradient: 'from-violet-950 to-purple-950' },
  { name: 'Create Video', description: 'Generate AI videos', href: '/studio/video/text-to-video', gradient: 'from-blue-950 to-indigo-950' },
  { name: 'Lip Sync', description: 'Animate portraits with audio', href: '/studio/lipsync/portrait', gradient: 'from-pink-950 to-rose-950' },
  { name: 'Bulk Generate', description: '500 assets from one CSV', href: '/studio/bulk/image', gradient: 'from-amber-950 to-orange-950' },
  { name: 'Content Ideas', description: 'Trending topics for your niche', href: '/studio/ideas', gradient: 'from-emerald-950 to-teal-950' },
  { name: 'Voice Cloning', description: 'Clone any voice in 10 seconds', href: '/studio/audio/voice-clone', gradient: 'from-cyan-950 to-sky-950' },
  { name: 'Smart Shot', description: 'Prompt to full cinematic video', href: '/studio/video/smart-shot', gradient: 'from-indigo-950 to-violet-950' },
  { name: 'Characters', description: 'Build reusable Soul ID characters', href: '/studio/characters/create', gradient: 'from-fuchsia-950 to-purple-950' },
  { name: 'Marketing Ads', description: 'UGC ads that convert', href: '/studio/marketing/ugc', gradient: 'from-rose-950 to-red-950' },
  { name: 'Edit Image', description: 'Brush to edit any region', href: '/studio/image/inpaint', gradient: 'from-slate-950 to-gray-950' },
];

const TOP_TOOLS = [
  { name: 'Nano Banana Pro', description: 'Best 4K image model ever', href: '/studio/image/text-to-image', gradient: 'from-violet-950 to-purple-950', badge: 'TOP', badgeType: 'TOP' },
  { name: 'Bulk Lip Sync', description: '1 character x 100 audio files', href: '/studio/lipsync/bulk', gradient: 'from-pink-950 to-rose-950', badge: 'NEW', badgeType: 'NEW' },
  { name: 'Content Ideas', description: 'Daily trending topics for any niche', href: '/studio/ideas', gradient: 'from-emerald-950 to-teal-950', badge: 'TOP', badgeType: 'TOP' },
  { name: 'Face Swap', description: 'Swap faces on image or video instantly', href: '/studio/apps/face', gradient: 'from-amber-950 to-orange-950', badge: 'TOP', badgeType: 'TOP' },
  { name: 'Voice Cloning', description: 'Clone any voice in 10 seconds', href: '/studio/audio/voice-clone', gradient: 'from-cyan-950 to-sky-950', badge: 'NEW', badgeType: 'NEW' },
  { name: 'Smart Shot', description: 'Prompt to storyboard to cinematic video', href: '/studio/video/smart-shot', gradient: 'from-indigo-950 to-violet-950', badge: 'NEW', badgeType: 'NEW' },
  { name: 'Viral Effects Pack', description: '80 trending one-click VFX presets', href: '/studio/apps/vfx', gradient: 'from-fuchsia-950 to-purple-950', badge: 'TOP', badgeType: 'TOP' },
  { name: 'Marketing Studio', description: 'UGC ads from one product link', href: '/studio/marketing/ugc', gradient: 'from-rose-950 to-red-950', badge: 'TOP', badgeType: 'TOP' },
];

const COMM_STRIPS = [
  {
    title: 'Image Showcase',
    subtitle: 'Browse stunning AI-generated images from our community',
    href: '/studio/image/text-to-image',
    items: [
      { className: 'w-[130px] h-[170px]' }, { className: 'w-[110px] h-[150px]' }, { className: 'w-[140px] h-[120px]' },
      { className: 'w-[120px] h-[160px]' }, { className: 'w-[150px] h-[110px]' }, { className: 'w-[130px] h-[140px]' },
      { className: 'w-[110px] h-[170px]' }, { className: 'w-[140px] h-[130px]' },
    ],
  },
  {
    title: 'Video Showcase',
    subtitle: 'Watch incredible AI-generated videos by creators worldwide',
    href: '/studio/video/text-to-video',
    items: [
      { className: 'w-[140px] h-[180px]' }, { className: 'w-[120px] h-[140px]' }, { className: 'w-[130px] h-[110px]' },
      { className: 'w-[150px] h-[130px]' }, { className: 'w-[110px] h-[160px]' }, { className: 'w-[140px] h-[150px]' },
      { className: 'w-[120px] h-[170px]' }, { className: 'w-[130px] h-[120px]' },
    ],
  },
  {
    title: 'Marketing Ads Showcase',
    subtitle: 'See how creators are using AI to generate converting ads',
    href: '/studio/marketing/ugc',
    items: [
      { className: 'w-[120px] h-[150px]' }, { className: 'w-[140px] h-[130px]' }, { className: 'w-[110px] h-[170px]' },
      { className: 'w-[150px] h-[120px]' }, { className: 'w-[130px] h-[160px]' }, { className: 'w-[120px] h-[110px]' },
      { className: 'w-[140px] h-[170px]' }, { className: 'w-[110px] h-[140px]' },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <div className="max-w-[1280px] mx-auto px-6">

        {/********* SECTION 1: Feature Spotlight Cards Row *********/}
        <section className="py-16 lg:py-20">
          <SpotlightRow />
        </section>

        {/********* SECTION 2: Model Quick Links *********/}
        <section className="pb-4 mb-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            <span className="text-sm text-[#888] whitespace-nowrap flex-shrink-0">Explore &rarr;</span>
            {MODEL_PILLS.map((pill, i) => (
              <Link
                key={i}
                href={pill.href}
                className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] text-white/80 hover:text-white hover:bg-white/10 transition-all"
                style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </section>

        {/********* SECTION 3: Meet GPT Image 2 *********/}
        <section className="py-4">
          <FeatureBlock
            badge="NEW MODEL"
            headlines={[{ text: 'Meet GPT Image 2', weight: 800, color: '#fff' }]}
            subtitle="4K images with near-perfect text rendering"
            buttons={[{ text: 'Try Model \u2192', variant: 'primary', href: '/studio/image/text-to-image' }]}
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 flex flex-col gap-3">
                <Link href="/studio/image/text-to-image" className="rounded-xl aspect-[3/4] relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                  <img src="https://picsum.photos/seed/ai-fashion/400/600" alt="AI Fashion" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Fashion</span>
                </Link>
                <Link href="/studio/image/text-to-image" className="rounded-xl aspect-[4/3] relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                  <img src="https://picsum.photos/seed/ai-portrait/400/300" alt="AI Portrait" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Portrait</span>
                </Link>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-3">
                <Link href="/studio/image/text-to-image" className="rounded-xl aspect-square relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                  <img src="https://picsum.photos/seed/ai-landscape/400/400" alt="AI Landscape" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Landscape</span>
                </Link>
                <Link href="/studio/image/text-to-image" className="rounded-xl aspect-[3/4] relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                  <img src="https://picsum.photos/seed/ai-abstract/400/600" alt="AI Abstract" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Abstract</span>
                </Link>
                <Link href="/studio/image/text-to-image" className="rounded-xl aspect-[4/3] relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                  <img src="https://picsum.photos/seed/ai-product/400/300" alt="AI Product" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Product</span>
                </Link>
                <Link href="/studio/image/text-to-image" className="rounded-xl aspect-square relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                  <img src="https://picsum.photos/seed/ai-architecture/400/400" alt="AI Architecture" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Architecture</span>
                </Link>
              </div>
            </div>
          </FeatureBlock>
        </section>

        {/********* SECTION 4: One prompt in. Marketing out. *********/}
        <section className="py-4">
          <FeatureBlock
            badge="MARKETING STUDIO"
            headlines={[
              { text: 'One prompt in.', weight: 300, color: '#888' },
              { text: 'Marketing out.', weight: 800, color: '#fff' },
            ]}
            subtitle="Create UGC, demos, and ads across all channels"
            buttons={[{ text: 'Try Marketing Studio \u2192', variant: 'secondary', href: '/studio/marketing/ugc' }]}
            extraContent={
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-10 rounded-full bg-white/5 border border-white/[0.08] flex items-center px-4 text-[12px] text-[#555]">
                  Link your product...
                </div>
                <Link
                  href="/studio/marketing/product-url"
                  className="w-10 h-10 rounded-full bg-[#CCFF00] flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-all"
                >
                  <ArrowRight size={16} className="text-black" />
                </Link>
              </div>
            }
          >
            <div className="grid grid-cols-5 gap-3">
              <Link href="/studio/marketing/ugc" className="col-span-2 row-span-2 rounded-xl aspect-[3/4] relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                <img src="https://picsum.photos/seed/ad-creative/400/600" alt="Ad Creative" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] text-white/60">UGC Ad</span>
              </Link>
              <Link href="/studio/marketing/ugc" className="col-span-3 rounded-xl aspect-[16/9] relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                <img src="https://picsum.photos/seed/ad-video/600/338" alt="Ad Video" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Video Ad</span>
              </Link>
              <Link href="/studio/marketing/brand-kit" className="rounded-xl aspect-[4/3] relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                <img src="https://picsum.photos/seed/brand-kit/400/300" alt="Brand Kit" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Brand Kit</span>
              </Link>
              <Link href="/studio/marketing/hooks" className="rounded-xl aspect-square relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                <img src="https://picsum.photos/seed/hook-generator/400/400" alt="Hook Generator" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Hooks</span>
              </Link>
              <Link href="/studio/marketing/demo" className="rounded-xl aspect-[3/2] relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                <img src="https://picsum.photos/seed/product-demo/400/267" alt="Product Demo" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Demo</span>
              </Link>
            </div>
          </FeatureBlock>
        </section>

        {/********* SECTION 5: Seedance 2.0 *********/}
        <section className="py-4">
          <FeatureBlock
            badge="AVAILABLE FOR EVERYONE"
            badgeColor="#888"
            headlines={[
              { text: 'World\u2019s Best', weight: 800, color: '#fff' },
              { text: 'Video Model', weight: 800, color: '#fff' },
            ]}
            subtitle="Up to 30% OFF with limited offer"
            buttons={[
              { text: 'Get Seedance 2.0 \u2192', variant: 'primary', href: '/studio/video/text-to-video' },
              { text: 'Learn more', variant: 'ghost', href: '/studio/video/text-to-video' },
            ]}
          >
            <div className="grid grid-cols-4 gap-3">
              {[
                'https://picsum.photos/seed/video-cinematic/400/225',
                'https://picsum.photos/seed/video-nature/400/225',
                'https://picsum.photos/seed/video-action/400/225',
              ].map((src, i) => (
                <Link key={i} href="/studio/video/text-to-video" className="rounded-xl aspect-video relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                  <img src={src} alt="Video" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/studio/video/text-to-video" className="rounded-xl aspect-video relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02] flex items-center justify-center bg-[#1a1a1a]">
                <span className="text-[12px] text-white/40 font-medium">View all &rarr;</span>
              </Link>
            </div>
          </FeatureBlock>
        </section>

        {/********* SECTION 6: One Canvas. Every Workflow. *********/}
        <section className="py-4">
          <div className="bg-[#050f0d] border border-emerald-500/15 rounded-[20px] p-8 mb-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="w-full lg:w-1/2">
                <span
                  className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full mb-4"
                  style={{ backgroundColor: 'rgba(0,200,150,0.15)', color: '#00c896' }}
                >
                  NEW FEATURE
                </span>
                <p className="text-[clamp(22px,2.5vw,32px)] font-extrabold text-white leading-tight">ONE CANVAS.</p>
                <p className="text-[clamp(22px,2.5vw,32px)] font-extrabold text-white leading-tight">EVERY WORKFLOW.</p>
                <p className="text-[13px] text-[#888] mt-3 max-w-[360px]">
                  Moodboard, chain workflows, and share with your team &mdash; all in one place
                </p>
                <Link
                  href="/studio/workflows/canvas"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-bold mt-5 transition-all hover:opacity-90"
                  style={{ backgroundColor: '#00c896', color: '#000' }}
                >
                  Try Canvas &rarr;
                </Link>
              </div>
              <div className="w-full lg:w-[35%] flex items-center gap-4 justify-center lg:justify-end">
                <div
                  className="w-[140px] h-[100px] rounded-xl relative overflow-hidden"
                  style={{ backgroundColor: '#0a1a14', border: '1px solid rgba(0,200,150,0.2)' }}
                >
                  <svg className="w-full h-full p-3" viewBox="0 0 100 60">
                    <circle cx="25" cy="30" r="6" fill="rgba(0,200,150,0.3)" />
                    <circle cx="75" cy="20" r="6" fill="rgba(0,200,150,0.3)" />
                    <circle cx="60" cy="45" r="6" fill="rgba(0,200,150,0.3)" />
                    <line x1="31" y1="30" x2="69" y2="20" stroke="rgba(0,200,150,0.2)" strokeWidth="1" />
                    <line x1="31" y1="30" x2="54" y2="45" stroke="rgba(0,200,150,0.2)" strokeWidth="1" />
                    <line x1="69" y1="20" x2="54" y2="45" stroke="rgba(0,200,150,0.2)" strokeWidth="1" />
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-[50px] h-[70px] rounded-xl bg-[#0a1a14] border border-white/[0.05]" />
                  <div className="w-[50px] h-[70px] rounded-xl bg-[#0a1a14] border border-white/[0.05]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/********* SECTION 7: What will you create today? *********/}
        <section className="py-16 lg:py-20">
          <div className="text-center mb-10">
            <p className="text-[clamp(28px,4vw,48px)] font-light text-[#888]">What will you</p>
            <p className="text-[clamp(28px,4vw,48px)] font-extrabold text-white -mt-3">create today?</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {TOOLS_DATA.map((tool, i) => (
              <ToolCard key={i} {...tool} />
            ))}
            <Link
              href="/studio/apps"
              className="w-[200px] h-[220px] flex-shrink-0 bg-[#0D0D0D] rounded-2xl border border-white/[0.07] flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:border-[#CCFF00]/30 group"
            >
              <span className="text-[#CCFF00] text-[13px] font-semibold">View All Tools</span>
              <ChevronRight size={20} className="text-[#CCFF00] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/********* SECTION 8: Top Choice *********/}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] text-[#888] uppercase tracking-[0.1em] font-semibold mb-1">Top Choice</p>
              <h2 className="text-[22px] font-bold text-white">Creator-recommended tools</h2>
            </div>
            <Link
              href="/studio/apps"
              className="text-[12px] text-[#CCFF00] font-semibold flex items-center gap-1 hover:underline"
            >
              See all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {TOP_TOOLS.map((tool, i) => (
              <ToolCard key={i} {...tool} />
            ))}
          </div>
        </section>

        {/********* SECTION 9: Cinematic VFX *********/}
        <section className="py-4">
          <FeatureBlock
            badge="CINEMA STUDIO"
            headlines={[
              { text: 'Cinematic VFX', weight: 800, color: '#fff' },
              { text: 'Ready to Use', weight: 800, color: '#fff' },
            ]}
            subtitle="Turn any shot cinematic with 200+ preset effects"
            buttons={[{ text: 'Explore All Presets \u2192', variant: 'secondary', href: '/studio/cinema/vfx' }]}
          >
            <div className="relative h-[200px] flex items-center justify-center">
              <Link href="/studio/cinema/vfx"
                className="absolute w-[130px] h-[170px] rounded-xl border border-white/[0.05] overflow-hidden transition-all duration-200 hover:scale-[1.03]"
                style={{ transform: 'rotate(-6deg) translateX(-15px)' }}
              >
                <img src="https://picsum.photos/seed/cinema-vfx1/260/340" alt="VFX" className="w-full h-full object-cover" />
              </Link>
              <Link href="/studio/cinema/vfx"
                className="relative w-[150px] h-[190px] rounded-xl border border-white/[0.08] z-10 overflow-hidden transition-all duration-200 hover:scale-[1.03]"
                style={{ transform: 'scale(1.05)' }}
              >
                <img src="https://picsum.photos/seed/cinema-vfx2/300/380" alt="VFX" className="w-full h-full object-cover" />
              </Link>
              <Link href="/studio/cinema/vfx"
                className="absolute w-[130px] h-[170px] rounded-xl border border-white/[0.05] overflow-hidden transition-all duration-200 hover:scale-[1.03]"
                style={{ transform: 'rotate(6deg) translateX(15px)' }}
              >
                <img src="https://picsum.photos/seed/cinema-vfx3/260/340" alt="VFX" className="w-full h-full object-cover" />
              </Link>
            </div>
          </FeatureBlock>
        </section>

        {/********* SECTION 10: Different Scenes, Same Star *********/}
        <section className="py-4">
          <FeatureBlock
            reversed
            badge="CHARACTERS & WORLDS"
            headlines={[
              { text: 'Different Scenes.', weight: 800, color: '#fff' },
              { text: 'Same Character.', weight: 800, color: '#fff' },
            ]}
            subtitle="Build your character once. Use across any scene, style, or video."
            buttons={[{ text: 'Try Characters \u2192', variant: 'primary', href: '/studio/characters/create' }]}
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: 'https://picsum.photos/seed/character-urban/400/600', label: 'Urban style' },
                { src: 'https://picsum.photos/seed/character-fantasy/400/600', label: 'Fantasy world' },
                { src: 'https://picsum.photos/seed/character-beach/400/600', label: 'Beach day' },
                { src: 'https://picsum.photos/seed/character-cyberpunk/400/600', label: 'Cyberpunk' },
              ].map((item, i) => (
                <Link
                  key={i}
                  href="/studio/characters/create"
                  className="rounded-xl aspect-[3/4] relative group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02]"
                >
                  <img src={item.src} alt={item.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-[9px] text-white/40 font-medium">
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </FeatureBlock>
        </section>

        {/********* SECTION 11: Visual Effects Preset Strip *********/}
        <section className="py-8">
          <EffectsStrip />
        </section>

        {/********* SECTION 12: Community Gallery Strips *********/}
        <section className="py-8 space-y-10">
          {COMM_STRIPS.map((strip, i) => (
            <CommunityStrip
              key={i}
              title={strip.title}
              subtitle={strip.subtitle}
              viewAllHref={strip.href}
              items={strip.items}
            />
          ))}
        </section>

        {/********* SECTION 13: Footer CTA Band *********/}
        <section className="py-20 text-center">
          <p className="text-[clamp(28px,4vw,48px)] font-extrabold text-white">Start creating for free</p>
          <p className="text-[15px] text-[#888] mt-3">Join thousands of creators. No credit card required.</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link
              href="/studio/image/text-to-image"
              className="inline-flex items-center gap-1.5 px-7 py-3 rounded-full text-[13px] font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: '#CCFF00', color: '#000' }}
            >
              Start Creating Free
            </Link>
            <Link
              href="/studio/apps"
              className="inline-flex items-center gap-1.5 px-7 py-3 rounded-full text-[13px] font-medium transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
            >
              View all tools
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
