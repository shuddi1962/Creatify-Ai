'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const tools = [
  { id: 'image', label: 'Image Studio', desc: 'Generate stunning AI images with 200+ models — Flux, Midjourney, and more.', color: '#7C3AED' },
  { id: 'video', label: 'Video Studio', desc: 'Create AI videos with Kling, Seedance, Veo, and other state-of-the-art models.', color: '#06B6D4' },
  { id: 'lipsync', label: 'Lip Sync', desc: 'Animate faces with audio — talking avatars, dubbing, and lip-sync videos.', color: '#EC4899' },
  { id: 'audio', label: 'Audio Studio', desc: 'Generate voiceovers, music, sound effects, and more with AI.', color: '#F59E0B' },
  { id: 'cinema', label: 'Cinema Studio', desc: 'Cinematic AI video generation with camera controls and scene composition.', color: '#EF4444' },
  { id: 'marketing', label: 'Marketing Studio', desc: 'Generate UGC-style ads, product demos, and marketing content at scale.', color: '#10B981' },
  { id: 'bulk', label: 'Bulk Generate', desc: 'Generate hundreds of images, videos, and voiceovers from a single CSV.', color: '#8B5CF6' },
  { id: 'ideas', label: 'Content Ideas', desc: 'Discover trending content ideas for any niche, platform, and region.', color: '#3B82F6' },
  { id: 'characters', label: 'Characters & Worlds', desc: 'Create consistent AI characters and immersive worlds.', color: '#F97316' },
  { id: 'workflows', label: 'Workflows', desc: 'Chain multiple AI operations together in reusable pipelines.', color: '#14B8A6' },
  { id: 'agents', label: 'Agents', desc: 'Create and customize AI agents for automated content generation.', color: '#A855F7' },
  { id: 'apps', label: 'Explore Apps', desc: 'One-click apps for viral effects, face swap, angles, and more.', color: '#06B6D4' },
  { id: 'media', label: 'Media Library', desc: 'Organize, store, and manage all your creative assets in one place.', color: '#6B7280' },
  { id: 'schedule', label: 'Schedule & Publish', desc: 'Plan, schedule, and publish content across multiple platforms.', color: '#84CC16' },
  { id: 'admin', label: 'Admin Portal', desc: 'Manage users, monitor jobs, and configure platform settings.', color: '#DC2626' },
];

const stats = [
  { value: '200+', label: 'AI Models' },
  { value: '15', label: 'Creative Studios' },
  { value: '100%', label: 'Free & Open Source' },
  { value: '500', label: 'Bulk at Once' },
  { value: '200+', label: 'Niches for Ideas' },
];

const steps = [
  { num: '01', title: 'Get an API Key', desc: 'Sign up at Muapi.ai, add credits, and copy your API key.' },
  { num: '02', title: 'Paste in Settings', desc: 'Open Creatify AI, go to Settings, and paste your key.' },
  { num: '03', title: 'Start Creating', desc: 'Choose a studio, enter a prompt, and generate in seconds.' },
];

const sampleOutputs = [
  { label: 'Image Generation', desc: 'Flux Dev — Photorealistic' },
  { label: 'Video Generation', desc: 'Kling v3 — Cinematic' },
  { label: 'Lip Sync', desc: 'Talking Avatar' },
  { label: 'Music Generation', desc: 'AI Composed' },
];

const trustedModels = [
  'Kling', 'Sora', 'Veo', 'Seedance', 'Flux',
  'GPT-Image', 'Seedream', 'Wan', 'Runway', 'Midjourney'
];

const trendingNiches = [
  'Fitness', 'Fashion', 'Finance', 'Food', 'Travel',
  'Gaming', 'Beauty', 'Real Estate', 'Tech', 'Crypto'
];

export default function HomeContent({ onTabChange }) {
  const [currentSample, setCurrentSample] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSample((prev) => (prev + 1) % sampleOutputs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full bg-[#0A0F1E] text-white overflow-y-auto">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#7C3AED]/3 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-[#9CA3AF] mb-8">
              Free open-source AI studio
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
              <span className="text-white/20">Create</span>{' '}
              <span className="text-white">Anything</span>
              <br />
              <span className="text-white/20">with</span>{' '}
              <span className="text-[#7C3AED]">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl leading-relaxed mb-8">
              Generate AI images, videos, lip sync, music, and cinematic content using 200+ models.
              Free, open-source, and powered by Muapi.ai.
            </p>

            {/* Live Preview */}
            <div className="w-full max-w-md mb-10">
              <div className="p-4 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] font-mono">preview.mode</span>
                  <div className="flex-1" />
                  <div className="flex gap-1">
                    {sampleOutputs.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentSample ? 'bg-[#7C3AED] w-3' : 'bg-white/20'}`} />
                    ))}
                  </div>
                </div>
                <div className="h-16 flex items-center justify-center transition-all duration-500">
                  <div className="text-center animate-fade-in">
                    <div className="text-sm font-semibold text-[#F9FAFB]">{sampleOutputs[currentSample].label}</div>
                    <div className="text-xs text-[#9CA3AF]">{sampleOutputs[currentSample].desc}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onTabChange?.('image')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#7C3AED] text-white font-bold text-sm hover:bg-[#6D28D9] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#7C3AED]/20 cursor-pointer"
              >
                Start Creating Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/10 bg-white/5 text-[#9CA3AF] text-sm font-medium hover:bg-white/10 hover:text-[#F9FAFB] transition-all cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02]">
              <div className="text-3xl md:text-4xl font-black text-[#7C3AED] mb-1">{stat.value}</div>
              <div className="text-sm text-[#9CA3AF]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4">
            Everything you need to create
          </h2>
          <p className="text-[#9CA3AF] text-base max-w-xl mx-auto">
            A complete AI content studio — from image generation to cinematic video, all in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onTabChange?.(tool.id)}
              className="group relative p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 hover:scale-[1.02] transition-all duration-300 text-left cursor-pointer"
            >
              <div className="flex flex-col gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                  style={{ background: `${tool.color}15` }}
                >
                  <div className="w-5 h-5 rounded-[4px]" style={{ background: tool.color, opacity: 0.8 }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#F9FAFB] group-hover:text-white transition-colors">{tool.label}</h3>
                  <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed group-hover:text-white/40 transition-colors">{tool.desc}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4">How it works</h2>
          <p className="text-[#9CA3AF] text-base max-w-xl mx-auto">Get started in three simple steps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="relative p-8 rounded-2xl border border-white/[0.04] bg-white/[0.02]">
              <div className="text-5xl font-black text-white/5 mb-4">{step.num}</div>
              <h3 className="text-lg font-bold text-[#F9FAFB] mb-2">{step.title}</h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Ideas Preview */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4">Trending Content Ideas</h2>
          <p className="text-[#9CA3AF] text-base max-w-xl mx-auto">
            Discover what is trending in your niche, pick a platform, and get AI-generated content ideas.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-xs appearance-none cursor-pointer focus:outline-none focus:border-[#7C3AED]">
                  <option>Select Niche</option>
                  {trendingNiches.map((n) => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                {['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter/X'].map((p) => (
                  <button key={p} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${p === 'TikTok' ? 'bg-[#7C3AED]/20 border-[#7C3AED]/30 text-[#7C3AED]' : 'border-white/10 text-[#9CA3AF] hover:bg-white/5'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {[
              { niche: 'Fitness', hook: 'Try this 5-min morning routine that changed everything 🔥', score: 92 },
              { niche: 'Finance', hook: 'I asked AI to invest $1000 — heres what it picked', score: 88 },
              { niche: 'Fashion', hook: '3 outfits under $50 that look like designer 💸', score: 95 },
              { niche: 'Food', hook: 'This pasta hack will ruin restaurant pasta for you', score: 91 },
            ].map((idea, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-medium text-[#7C3AED] uppercase tracking-wider">{idea.niche}</span>
                  <span className="text-[10px] font-bold text-[#06B6D4]">{idea.score}/100</span>
                </div>
                <p className="text-sm text-[#F9FAFB] leading-snug mb-2">{idea.hook}</p>
                <div className="flex gap-1.5 mt-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-[#9CA3AF]">Generate Script</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-[#9CA3AF]">Schedule</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Generation Section */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4">Generate at Scale</h2>
          <p className="text-[#9CA3AF] text-base max-w-xl mx-auto">
            Upload a CSV with hundreds of rows and generate images, videos, or voiceovers in one click.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm p-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <span className="text-xs text-[#9CA3AF] font-medium">1. Upload CSV</span>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" className="hidden md:block"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <span className="text-xs text-[#9CA3AF] font-medium">2. AI Generates</span>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" className="hidden md:block"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <span className="text-xs text-[#9CA3AF] font-medium">3. Download ZIP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Models */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4">Powered by Leading Models</h2>
          <p className="text-[#9CA3AF] text-base max-w-xl mx-auto">
            Access 200+ state-of-the-art AI models through a single API.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {trustedModels.map((model) => (
            <div
              key={model}
              className="px-5 py-3 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 text-sm font-semibold text-[#9CA3AF] hover:border-[#7C3AED]/30 hover:text-[#7C3AED] transition-all"
            >
              {model}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-28 text-center">
        <div className="p-12 md:p-16 rounded-3xl border border-white/10 bg-gradient-to-br from-[#7C3AED]/5 to-[#06B6D4]/5 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4">Ready to create?</h2>
            <p className="text-[#9CA3AF] text-base mb-8">No sign-up required. Just paste your API key and go.</p>
            <button
              onClick={() => onTabChange?.('image')}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#7C3AED] text-white font-bold text-sm hover:bg-[#6D28D9] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#7C3AED]/20 cursor-pointer"
            >
              Launch Studio
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.03]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#7C3AED] rounded-md flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#9CA3AF]">Creatify AI</span>
          </div>
          <p className="text-xs text-white/20">Open-source AI content studio. Powered by Muapi.ai.</p>
        </div>
      </footer>
    </div>
  );
}
