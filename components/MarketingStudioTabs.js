'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MARKETING_TABS = [
  { id: 'ugc', label: 'UGC Ad Generator', desc: 'Create scroll-stopping UGC-style video ads that convert' },
  { id: 'product-url', label: 'Product URL to Ad', desc: 'Paste any product URL and get auto-generated video ads' },
  { id: 'brand-kit', label: 'Brand Kit', desc: 'Upload logo, colors, and fonts once — applied to all outputs' },
  { id: 'formatter', label: 'Platform Formatter', desc: 'Auto-resize content to 9:16, 1:1, 16:9, and 4:5 formats' },
  { id: 'hooks', label: 'Hook Generator', desc: 'Generate 20 proven viral opening hooks for any niche or product' },
  { id: 'batch', label: 'Batch Ad Generator', desc: 'Create 10 different ad variants from one product in one click' },
  { id: 'stories', label: 'Story Ad Builder', desc: 'Build high-converting short-form story ads for any platform' },
  { id: 'demo', label: 'Product Demo', desc: 'Showcase your product in motion with stunning AI video demos' },
];

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter', 'Facebook'];
const ASPECTS = [
  { id: '9:16', label: 'Stories/Reels' },
  { id: '1:1', label: 'Square' },
  { id: '16:9', label: 'Landscape' },
  { id: '4:5', label: 'Portrait' },
];

const HOOK_EXAMPLES = [
  'This one trick changed everything...',
  'Stop doing this if you want to...',
  'I tried this for 30 days and here\'s what happened...',
  'The secret no one tells you about...',
  'Most people don\'t know that...',
];

export default function MarketingStudioTabs({ initialTab, apiKey, droppedFiles, onFilesHandled }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'ugc');
  const [prompt, setPrompt] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedAds, setGeneratedAds] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['TikTok']);
  const [selectedAspects, setSelectedAspects] = useState(['9:16']);
  const [brandColors, setBrandColors] = useState(['#7C3AED', '#06B6D4']);

  const router = useRouter();

  const handleGenerate = () => {
    if (!prompt && !productUrl) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedAds([
        { id: 1, thumbnail: 'https://picsum.photos/320/180?random=30', platform: 'TikTok' },
        { id: 2, thumbnail: 'https://picsum.photos/320/180?random=31', platform: 'Instagram' },
      ]);
    }, 3500);
  };

  const togglePlatform = (p) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const toggleAspect = (a) => {
    setSelectedAspects(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const renderUGC = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Product/Service Description</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what you're advertising - product features, benefits, target audience..." rows={5} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#10B981]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Target Platform</label>
        <div className="flex gap-2">
          {PLATFORMS.map((p) => (
            <button key={p} onClick={() => togglePlatform(p)} className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedPlatforms.includes(p) ? 'bg-[#10B981]/20 border border-[#10B981]/50 text-white' : 'bg-white/5 border border-white/10 text-[#9CA3AF]'}`}>{p}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">UGC Style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['Testimonial', 'Day in Life', 'Product Review', 'Tutorial', 'Before/After', 'Comparison', 'Unboxing', 'ROI Story'].map((style) => (
            <button key={style} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{style}</button>
          ))}
        </div>
      </div>

      <button onClick={handleGenerate} disabled={!prompt || generating} className="px-8 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] disabled:opacity-50 transition-all">
        {generating ? 'Generating UGC Ads...' : 'Generate UGC Ad'}
      </button>

      {generatedAds.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">Generated Ads</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generatedAds.map((ad) => (
              <div key={ad.id} className="relative group rounded-xl overflow-hidden border border-white/10">
                <img src={ad.thumbnail} alt="Ad" className="w-full aspect-video object-cover" />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-xs text-white">{ad.platform}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProductUrl = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Product URL</label>
        <div className="flex gap-2">
          <input type="url" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="Paste product URL (Amazon, Shopify, etc.)" className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#10B981]" />
          <button onClick={handleGenerate} disabled={!productUrl || generating} className="px-6 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] disabled:opacity-50">
            {generating ? 'Analyzing...' : 'Fetch & Generate'}
          </button>
        </div>
      </div>

      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        {generating ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#9CA3AF]">Fetching product info and generating ads...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            <span className="text-[#9CA3AF]">Product info will appear here</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderBrandKit = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Logo</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
            <span className="text-[#9CA3AF]">Upload logo (PNG/SVG)</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Brand Fonts</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
            <span className="text-[#9CA3AF]">Upload font files</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Brand Colors</label>
        <div className="flex gap-4 items-center">
          {brandColors.map((color, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="color" value={color} onChange={(e) => setBrandColors(prev => { const n = [...prev]; n[i] = e.target.value; return n; })} className="w-10 h-10 rounded-lg cursor-pointer" />
              <span className="text-xs text-[#9CA3AF]">{color}</span>
            </div>
          ))}
          <button className="text-xs text-[#10B981] hover:underline">+ Add color</button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Brand Voice</label>
        <div className="flex gap-2">
          {['Professional', 'Casual', 'Humorous', 'Inspirational', 'Luxury'].map((v) => (
            <button key={v} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{v}</button>
          ))}
        </div>
      </div>

      <button className="px-8 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-all">
        Save Brand Kit
      </button>
    </div>
  );

  const renderFormatter = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video or image to format</span>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Target Formats</label>
        <div className="grid grid-cols-4 gap-2">
          {ASPECTS.map((a) => (
            <button key={a.id} onClick={() => toggleAspect(a.id)} className={`p-4 rounded-xl border text-center transition-all ${selectedAspects.includes(a.id) ? 'bg-[#10B981]/20 border-[#10B981]/50' : 'bg-white/5 border-white/10'}`}>
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center mx-auto mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              </div>
              <div className="text-xs text-white">{a.label}</div>
              <div className="text-[10px] text-[#9CA3AF]">{a.id}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Platform</label>
        <div className="flex gap-2">
          {PLATFORMS.map((p) => (
            <button key={p} onClick={() => togglePlatform(p)} className={`px-4 py-2 rounded-lg text-sm ${selectedPlatforms.includes(p) ? 'bg-[#10B981]/20 text-white border border-[#10B981]/50' : 'bg-white/5 text-[#9CA3AF] border border-white/10'}`}>{p}</button>
          ))}
        </div>
      </div>

      <button className="px-8 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-all">
        Format for All Platforms
      </button>
    </div>
  );

  const renderHooks = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Niche / Topic</label>
        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., fitness, marketing, cooking..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#10B981]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Number of Hooks</label>
        <div className="flex gap-2">
          {[5, 10, 20, 50].map((n) => (
            <button key={n} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{n} hooks</button>
          ))}
        </div>
      </div>

      <button onClick={handleGenerate} disabled={!prompt || generating} className="px-8 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] disabled:opacity-50 transition-all">
        {generating ? 'Generating Hooks...' : 'Generate Viral Hooks'}
      </button>

      {generating === false && prompt && (
        <div className="space-y-2 mt-4">
          {HOOK_EXAMPLES.map((hook, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-white text-sm">{hook}</span>
              <button className="text-[#10B981] text-xs hover:underline">Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBatch = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload product images or describe product</span>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Number of Variants</label>
        <div className="flex gap-2">
          {[5, 10, 15, 20].map((n) => (
            <button key={n} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{n} variants</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Variation Styles</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {['Different Angle', 'Different Background', 'Lifestyle', 'Product Only', 'With Model', 'Flat Lay', 'Close Up', 'Contextual', 'Minimal', 'Colorful'].map((style) => (
            <button key={style} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{style}</button>
          ))}
        </div>
      </div>

      <button className="px-8 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-all">
        Generate Batch Ads
      </button>
    </div>
  );

  const renderStories = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Story Concept</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your story ad concept..." rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#10B981]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Platform</label>
        <div className="flex gap-2">
          {['Instagram', 'Facebook', 'Snapchat'].map((p) => (
            <button key={p} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{p}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Story Template</label>
        <div className="grid grid-cols-3 gap-2">
          {['Problem/Solution', 'Testimonial', 'Behind the Scenes', 'How-To', 'Unboxing', 'Countdown'].map((t) => (
            <button key={t} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{t}</button>
          ))}
        </div>
      </div>

      <button className="px-8 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-all">
        Build Story Ad
      </button>
    </div>
  );

  const renderDemo = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload product images or 3D model</span>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Product Description</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your product features and how it should be showcased..." rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#10B981]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Demo Style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['360 Spin', 'Lifestyle', 'Comparison', 'Feature Highlight', 'Use Case', 'Animated', 'White BG', 'Social Media'].map((style) => (
            <button key={style} className="py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{style}</button>
          ))}
        </div>
      </div>

      <button className="px-8 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-all">
        Generate Product Demo
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'ugc': return renderUGC();
      case 'product-url': return renderProductUrl();
      case 'brand-kit': return renderBrandKit();
      case 'formatter': return renderFormatter();
      case 'hooks': return renderHooks();
      case 'batch': return renderBatch();
      case 'stories': return renderStories();
      case 'demo': return renderDemo();
      default: return renderUGC();
    }
  };

  return (
    <div className="min-h-full bg-[#0A0F1E] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Marketing Studio</h1>
        <p className="text-[#9CA3AF]">Generate UGC-style ads, product demos, and marketing content at scale</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {MARKETING_TABS.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); router.push(`/studio/marketing/${tab.id}`); }} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#10B981] text-white' : 'bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
        {renderContent()}
      </div>
    </div>
  );
}