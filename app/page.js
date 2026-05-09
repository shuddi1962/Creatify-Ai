import Link from 'next/link';

const tools = [
  { id: 'image', label: 'Image Studio', desc: 'Generate stunning AI images with 200+ models — Flux, Midjourney, Nano Banana, and more.' },
  { id: 'video', label: 'Video Studio', desc: 'Create AI videos with Kling, Seedance, Veo, and other state-of-the-art models.' },
  { id: 'lipsync', label: 'Lip Sync', desc: 'Animate faces with audio — talking avatars, dubbing, and lip-sync videos.' },
  { id: 'cinema', label: 'Cinema Studio', desc: 'Cinematic AI video generation with camera controls and scene composition.' },
  { id: 'marketing', label: 'Marketing Studio', desc: 'Generate UGC-style ads, product demos, and marketing content at scale.' },
  { id: 'workflows', label: 'Workflows', desc: 'Chain multiple AI operations together in reusable pipelines.' },
  { id: 'agents', label: 'Agents', desc: 'Create and customize AI agents for automated content generation.' },
  { id: 'apps', label: 'Explore Apps', desc: 'One-click apps for viral effects, face swap, angles, and more.' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#d9ff00]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#d9ff00]/3 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/50 mb-8">
              Free open-source AI studio
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
              <span className="text-white/20">Create</span>{' '}
              <span className="text-white">Anything</span>
              <br />
              <span className="text-white/20">with</span>{' '}
              <span className="text-[#d9ff00]">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-white/40 max-w-2xl leading-relaxed mb-10">
              Generate AI images, videos, lip sync, and cinematic content using 200+ models.
              Free, open-source, and powered by Muapi.ai.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#d9ff00] text-black font-bold text-sm hover:bg-[#e5ff33] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#d9ff00]/10"
              >
                Start Creating
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="https://github.com/shuddi1962/Creatify-Ai"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to create
          </h2>
          <p className="text-white/40 text-base max-w-xl mx-auto">
            A complete AI content studio — from image generation to cinematic video, all in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/studio/${tool.id}`}
              className="group relative p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d9ff00]/10 flex items-center justify-center group-hover:bg-[#d9ff00]/20 transition-colors">
                  <div className="w-5 h-5 rounded-[4px] bg-[#d9ff00] opacity-80" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white/90 group-hover:text-white transition-colors">
                    {tool.label}
                  </h3>
                  <p className="text-xs text-white/30 mt-1 leading-relaxed group-hover:text-white/40 transition-colors">
                    {tool.desc}
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Open Source Banner */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.04] bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#d9ff00]/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d9ff00]/10 border border-[#d9ff00]/20 text-[#d9ff00] text-xs font-semibold mb-4">
                Open Source
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Built for creators, by creators
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-lg">
                Creatify AI is free and open-source. No subscriptions, no paywalls.
                Just connect your Muapi.ai API key and start creating.
              </p>
              <div className="flex items-center gap-6 mt-6">
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all"
                >
                  Get Started
                </Link>
                <Link
                  href="https://github.com/shuddi1962/Creatify-Ai"
                  className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                >
                  View on GitHub
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 w-32 h-32 rounded-2xl bg-[#d9ff00]/5 border border-[#d9ff00]/10 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.03]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white/60">Creatify AI</span>
          </div>
          <p className="text-xs text-white/20">
            Open-source AI content studio. Powered by Muapi.ai.
          </p>
        </div>
      </footer>
    </main>
  );
}
