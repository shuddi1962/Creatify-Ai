'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const IMAGE_TABS = [
  { id: 'text-to-image', label: 'Text to Image', desc: 'Generate stunning AI images from any text prompt' },
  { id: 'image-to-image', label: 'Image to Image', desc: 'Transform images with AI-powered style transfer' },
  { id: 'inpaint', label: 'Inpaint & Edit', desc: 'Brush to edit any region of your image using AI' },
  { id: 'outpaint', label: 'Outpaint / Expand', desc: 'Expand image borders in any direction seamlessly' },
  { id: 'upscale', label: 'Upscale Image', desc: 'Enhance resolution to 2x, 4x, or 8x crystal clarity' },
  { id: 'remove-bg', label: 'Remove Background', desc: 'Clean, instant AI background removal in one click' },
  { id: 'multi-view', label: 'Multi-View', desc: 'Generate 9 different camera angles from one single image' },
  { id: 'camera-angle', label: 'Cinematic Cameras', desc: 'Pro camera controls and depth of field' },
  { id: 'product-placement', label: 'Product Placement', desc: 'Place your product into any scene or environment' },
  { id: 'fashion', label: 'Fashion Generator', desc: 'Place any outfit on a model in any style instantly' },
  { id: 'headshot', label: 'AI Headshot', desc: 'Professional studio-quality headshots generated in seconds' },
  { id: 'meme', label: 'Meme Generator', desc: 'Create viral AI memes from a simple text prompt' },
  { id: 'style-transfer', label: 'Style Transfer', desc: 'Apply the style of any artwork to your own images' },
  { id: 'image-to-3d', label: 'Image to 3D', desc: 'Convert any flat image into a 3D model or render' },
  { id: 'relight', label: 'Relight', desc: 'Adjust lighting position, color, and brightness on photos' },
];

const MODELS = [
  { id: 'gpt-image-2', name: 'GPT Image 2', provider: 'OpenAI', badge: 'NEW' },
  { id: 'nano-banana-pro', name: 'Nano Banana Pro', provider: 'Creatify', badge: 'TOP' },
  { id: 'flux-kontext', name: 'Flux Kontext', provider: 'BlackForest' },
  { id: 'midjourney-v7', name: 'Midjourney v7', provider: 'Midjourney', badge: 'TOP' },
  { id: 'seedream-5', name: 'Seedream 5.0', provider: 'ByteDance' },
  { id: 'ideogram-v3', name: 'Ideogram v3', provider: 'Ideogram' },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: 'Square 1:1' },
  { id: '16:9', label: 'Landscape 16:9' },
  { id: '9:16', label: 'Portrait 9:16' },
  { id: '4:3', label: 'Standard 4:3' },
  { id: '3:2', label: 'Photo 3:2' },
];

export default function ImageStudioTabs({ initialTab, apiKey, droppedFiles, onFilesHandled }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'text-to-image');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [strength, setStrength] = useState(50);
  const [inpaintMask, setInpaintMask] = useState(null);
  const [upscaleFactor, setUpscaleFactor] = useState(2);

  const router = useRouter();

  const handleGenerate = () => {
    if (!prompt && !uploadedImage) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedImages([
        { id: 1, url: 'https://picsum.photos/512/512?random=1', prompt: prompt || 'Generated image' },
        { id: 2, url: 'https://picsum.photos/512/512?random=2', prompt: prompt || 'Generated image' },
      ]);
    }, 2500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const renderTextToImage = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Model</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {MODELS.map((m) => (
            <button key={m.id} onClick={() => setSelectedModel(m.id)} className={`p-3 rounded-lg border text-left transition-all ${selectedModel === m.id ? 'bg-[#7C3AED]/20 border-[#7C3AED]/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <div className="text-sm font-medium text-[#F9FAFB]">{m.name}</div>
              <div className="text-[10px] text-[#9CA3AF]">{m.provider}</div>
              {m.badge && <span className={`inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold rounded ${m.badge === 'NEW' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-violet-500/20 text-violet-400'}`}>{m.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Aspect Ratio</label>
        <div className="flex gap-2">
          {ASPECT_RATIOS.map((ar) => (
            <button key={ar.id} onClick={() => setAspectRatio(ar.id)} className={`px-4 py-2 rounded-lg border text-sm transition-all ${aspectRatio === ar.id ? 'bg-[#7C3AED]/20 border-[#7C3AED]/50 text-white' : 'bg-white/5 border-white/10 text-[#9CA3AF] hover:bg-white/10'}`}>
              {ar.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what you want to generate..." rows={4} maxLength={2000} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] resize-none" />
        <div className="text-xs text-[#9CA3AF] mt-1 text-right">{prompt.length}/2000</div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleGenerate} disabled={!prompt || generating} className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3">
          {generating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>}
          {generating ? 'Generating...' : 'Generate Image'}
        </button>
        {generating && <span className="text-sm text-[#9CA3AF]">Using {MODELS.find(m => m.id === selectedModel)?.name}</span>}
      </div>

      {generatedImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">Generated Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generatedImages.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/10">
                <img src={img.url} alt="Generated" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg></button>
                  <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderImageToImage = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-[#7C3AED]/50 transition-colors cursor-pointer" onClick={() => document.getElementById('i2i-upload')?.click()}>
        {uploadedImage ? (
          <div className="relative">
            <img src={uploadedImage} alt="Uploaded" className="max-h-64 mx-auto rounded-xl" />
            <button onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }} className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white hover:bg-red-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            </div>
            <div>
              <div className="text-white font-medium">Click to upload image</div>
              <div className="text-[#9CA3AF] text-sm">PNG, JPG up to 10MB</div>
            </div>
          </div>
        )}
        <input type="file" id="i2i-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Transformation Strength</label>
        <input type="range" min="0" max="100" value={strength} onChange={(e) => setStrength(e.target.value)} className="w-full" />
        <div className="flex justify-between text-xs text-[#9CA3AF] mt-1"><span>Keep original</span><span>Maximum transformation</span></div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Style Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the style you want..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED]" />
      </div>

      <button onClick={handleGenerate} disabled={!uploadedImage || generating} className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all">
        {generating ? 'Transforming...' : 'Transform Image'}
      </button>
    </div>
  );

  const renderInpaint = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Source Image</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-[#7C3AED]/50" onClick={() => document.getElementById('inpaint-upload')?.click()}>
            {uploadedImage ? <img src={uploadedImage} alt="Source" className="max-h-48 mx-auto rounded-lg" /> : (
              <div className="flex flex-col items-center gap-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span className="text-[#9CA3AF] text-sm">Upload image</span>
              </div>
            )}
            <input type="file" id="inpaint-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Mask & Prompt</label>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-center py-8 text-[#9CA3AF]">Draw on the image to mask areas you want to edit</div>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what to add in the masked area..." rows={3} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED]" />
          </div>
        </div>
      </div>
      <button onClick={handleGenerate} disabled={!uploadedImage || !prompt} className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all">
        Apply Inpaint
      </button>
    </div>
  );

  const renderOutpaint = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        {uploadedImage ? <img src={uploadedImage} alt="Source" className="max-h-64 mx-auto rounded-xl" /> : (
          <div className="flex flex-col items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>
            <span className="text-[#9CA3AF]">Upload image to expand</span>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        {['Left', 'Right', 'Top', 'Bottom'].map((dir) => (
          <button key={dir} className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-[#9CA3AF] hover:bg-white/10 hover:text-white transition-all">{dir}</button>
        ))}
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Expansion Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what should appear in the expanded area..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#7C3AED]" />
      </div>
      <button onClick={handleGenerate} disabled={!uploadedImage} className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all">
        Expand Image
      </button>
    </div>
  );

  const renderUpscale = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        {uploadedImage ? <img src={uploadedImage} alt="Source" className="max-h-64 mx-auto rounded-xl" /> : <span className="text-[#9CA3AF]">Upload image to upscale</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-3">Upscale Factor</label>
        <div className="flex gap-4">
          {[2, 4, 8].map((factor) => (
            <button key={factor} onClick={() => setUpscaleFactor(factor)} className={`flex-1 py-4 rounded-xl border text-center transition-all ${upscaleFactor === factor ? 'bg-[#7C3AED]/20 border-[#7C3AED]/50' : 'bg-white/5 border-white/10'}`}>
              <div className="text-2xl font-bold text-white">{factor}x</div>
              <div className="text-xs text-[#9CA3AF]">{factor === 2 ? 'HD' : factor === 4 ? '4K' : '8K'}</div>
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleGenerate} disabled={!uploadedImage} className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all">
        Upscale Image
      </button>
    </div>
  );

  const renderRemoveBg = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        {uploadedImage ? <img src={uploadedImage} alt="Source" className="max-h-64 mx-auto rounded-xl" /> : <span className="text-[#9CA3AF]">Upload image to remove background</span>}
      </div>
      <div className="flex gap-4">
        <button className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-[#9CA3AF] hover:text-white">Auto Detect</button>
        <button className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-[#9CA3AF] hover:text-white">Manual Select</button>
      </div>
      <button onClick={handleGenerate} disabled={!uploadedImage} className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all">
        Remove Background
      </button>
    </div>
  );

  const renderMultiView = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        {uploadedImage ? <img src={uploadedImage} alt="Source" className="max-h-48 mx-auto rounded-xl" /> : <span className="text-[#9CA3AF]">Upload a portrait to generate 9 angles</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['Front', '3/4 Left', 'Profile Left', 'Back Left', 'Back', 'Back Right', 'Profile Right', '3/4 Right', 'Front'].map((angle, i) => (
          <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#9CA3AF] text-xs">{angle}</div>
        ))}
      </div>
      <button onClick={handleGenerate} disabled={!uploadedImage} className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all">
        Generate 9 Views
      </button>
    </div>
  );

  const renderCameraAngle = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        {uploadedImage ? <img src={uploadedImage} alt="Source" className="max-h-48 mx-auto rounded-xl" /> : <span className="text-[#9CA3AF]">Upload image for cinematic camera control</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Camera Movement</label>
        <div className="grid grid-cols-4 gap-2">
          {['Static', 'Orbit Left', 'Orbit Right', 'Zoom In', 'Zoom Out', 'Pan Left', 'Pan Right', 'Dolly In', 'Tilt Up', 'Tilt Down', 'Crane Up', 'Crane Down'].map((move) => (
            <button key={move} className="py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{move}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the scene..." rows={2} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#7C3AED]" />
      </div>
      <button onClick={handleGenerate} disabled={!uploadedImage} className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all">
        Generate with Camera Control
      </button>
    </div>
  );

  const renderProductPlacement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Upload product image</span>
        </div>
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Upload reference scene</span>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Placement Description</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe where and how to place the product..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#7C3AED]" />
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] transition-all">
        Place Product in Scene
      </button>
    </div>
  );

  const renderFashion = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Upload model photo</span>
        </div>
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Upload outfit image or describe</span>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Outfit Description</label>
        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., red silk dress, casual denim jacket..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#7C3AED]" />
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] transition-all">
        Generate Fashion
      </button>
    </div>
  );

  const renderHeadshot = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        {uploadedImage ? <img src={uploadedImage} alt="Source" className="max-h-48 mx-auto rounded-xl" /> : <span className="text-[#9CA3AF]">Upload a selfie or portrait photo</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Style</label>
        <div className="grid grid-cols-4 gap-2">
          {['Professional', 'Creative', 'Casual', 'Artistic', 'Corporate', 'Modeling', 'Passport', 'Yearbook'].map((style) => (
            <button key={style} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{style}</button>
          ))}
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] transition-all">
        Generate Headshot
      </button>
    </div>
  );

  const renderMeme = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Meme Concept</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your meme idea..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#7C3AED]" />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Meme Format</label>
        <div className="flex gap-2">
          {['Classic', 'Drake', 'Distracted BF', 'Expanding Brain', 'Mocking Spongebob', 'Stonks'].map((format) => (
            <button key={format} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{format}</button>
          ))}
        </div>
      </div>
      <button onClick={handleGenerate} disabled={!prompt} className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all">
        Generate Meme
      </button>
    </div>
  );

  const renderStyleTransfer = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Your image</span>
        </div>
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Style reference</span>
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] transition-all">
        Apply Style Transfer
      </button>
    </div>
  );

  const renderImageTo3d = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        {uploadedImage ? <img src={uploadedImage} alt="Source" className="max-h-48 mx-auto rounded-xl" /> : <span className="text-[#9CA3AF]">Upload image to convert to 3D</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Output Format</label>
        <div className="flex gap-2">
          {['GLB', 'FBX', 'OBJ', 'USDZ'].map((format) => (
            <button key={format} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{format}</button>
          ))}
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] transition-all">
        Convert to 3D
      </button>
    </div>
  );

  const renderRelight = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        {uploadedImage ? <img src={uploadedImage} alt="Source" className="max-h-48 mx-auto rounded-xl" /> : <span className="text-[#9CA3AF]">Upload image to relight</span>}
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Light Position</label>
        <div className="grid grid-cols-3 gap-2">
          {['Top Left', 'Top', 'Top Right', 'Left', 'Center', 'Right', 'Bottom Left', 'Bottom', 'Bottom Right'].map((pos) => (
            <button key={pos} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{pos}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Light Color</label>
        <div className="flex gap-2">
          {['Warm White', 'Cool White', 'Golden Hour', 'Blue Hour', 'Neon', 'Sunset'].map((color) => (
            <button key={color} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{color}</button>
          ))}
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:bg-[#6D28D9] transition-all">
        Apply Relight
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'text-to-image': return renderTextToImage();
      case 'image-to-image': return renderImageToImage();
      case 'inpaint': return renderInpaint();
      case 'outpaint': return renderOutpaint();
      case 'upscale': return renderUpscale();
      case 'remove-bg': return renderRemoveBg();
      case 'multi-view': return renderMultiView();
      case 'camera-angle': return renderCameraAngle();
      case 'product-placement': return renderProductPlacement();
      case 'fashion': return renderFashion();
      case 'headshot': return renderHeadshot();
      case 'meme': return renderMeme();
      case 'style-transfer': return renderStyleTransfer();
      case 'image-to-3d': return renderImageTo3d();
      case 'relight': return renderRelight();
      default: return renderTextToImage();
    }
  };

  return (
    <div className="min-h-full bg-[#0A0F1E] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Image Studio</h1>
        <p className="text-[#9CA3AF]">Generate stunning AI images with 200+ models</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {IMAGE_TABS.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); router.push(`/studio/image/${tab.id}`); }} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#7C3AED] text-white' : 'bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white'}`}>
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