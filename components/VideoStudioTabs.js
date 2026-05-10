'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const VIDEO_TABS = [
  { id: 'text-to-video', label: 'Text to Video', desc: 'Generate high-quality video clips from any text prompt', icon: '🎬' },
  { id: 'image-to-video', label: 'Image to Video', desc: 'Animate any still image into a smooth, cinematic video', icon: '🖼️' },
  { id: 'smart-shot', label: 'Smart Shot', desc: 'Prompt → storyboard plan → full cinematic video automatically', icon: '⚡' },
  { id: 'motion-sync', label: 'Motion Sync', desc: 'Sync motion patterns from a reference video to your subject', icon: '🔄' },
  { id: 'edit', label: 'Edit Video', desc: 'Inpaint and redo specific regions of any video with AI', icon: '✏️' },
  { id: 'extend', label: 'Extend Video', desc: 'Seamlessly add more seconds to the end of any video', icon: '↗️' },
  { id: 'restyle', label: 'Restyle Video', desc: 'Apply a completely new visual style to any existing video', icon: '🎨' },
  { id: 'replace-character', label: 'Replace Character', desc: 'Swap out and replace characters inside any video clip', icon: '👤' },
  { id: 'upscale', label: 'Video Upscale', desc: 'Enhance any video to HD or 4K resolution with AI', icon: '📈' },
  { id: 'sound-effects', label: 'Add Sound Effects', desc: 'Layer AI-generated sound effects onto any video automatically', icon: '🔊' },
  { id: 'mixed-media', label: 'Mixed Media', desc: 'Blend real footage with AI-generated visuals seamlessly', icon: '🎭' },
  { id: 'camera-motion', label: 'Camera Motion', desc: 'Apply zoom, pan, orbit, and dolly presets to your video', icon: '📷' },
];

const MODELS = [
  { id: 'seedance-2', name: 'Seedance 2.0', provider: 'ByteDance', badge: 'TOP' },
  { id: 'kling-3', name: 'Kling 3.0', provider: 'Kuaishou', badge: 'TOP' },
  { id: 'sora-2', name: 'Sora 2', provider: 'OpenAI', badge: 'NEW' },
  { id: 'veo-3', name: 'Veo 3.1', provider: 'Google', badge: 'NEW' },
  { id: 'wan-2-6', name: 'WAN 2.6', provider: 'Swarma' },
  { id: 'runway-gen3', name: 'Runway Gen-3', provider: 'Runway' },
  { id: 'hunyuan', name: 'Hunyuan Video', provider: 'Tencent' },
  { id: 'grok-t2v', name: 'Grok T2V', provider: 'xAI', badge: 'NEW' },
];

const DURATIONS = ['3s', '5s', '8s', '10s', '15s'];

export default function VideoStudioTabs({ initialTab, apiKey, droppedFiles, onFilesHandled }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'text-to-video');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [duration, setDuration] = useState('5s');
  const [generating, setGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const router = useRouter();

  const handleGenerate = () => {
    if (!prompt && !uploadedImage) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedVideos([
        { id: 1, thumbnail: 'https://picsum.photos/320/180?random=10', duration: '5s' },
        { id: 2, thumbnail: 'https://picsum.photos/320/180?random=11', duration: '5s' },
      ]);
    }, 4000);
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (type === 'image') setUploadedImage(ev.target.result);
        else setUploadedVideo(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderTextToVideo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Model</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {MODELS.map((m) => (
            <button key={m.id} onClick={() => setSelectedModel(m.id)} className={`p-3 rounded-lg border text-left transition-all ${selectedModel === m.id ? 'bg-[#06B6D4]/20 border-[#06B6D4]/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <div className="text-sm font-medium text-white">{m.name}</div>
              <div className="text-[10px] text-[#9CA3AF]">{m.provider}</div>
              {m.badge && <span className={`inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold rounded ${m.badge === 'NEW' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-500/20 text-cyan-400'}`}>{m.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Duration</label>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <button key={d} onClick={() => setDuration(d)} className={`px-4 py-2 rounded-lg border text-sm transition-all ${duration === d ? 'bg-[#06B6D4]/20 border-[#06B6D4]/50 text-white' : 'bg-white/5 border-white/10 text-[#9CA3AF] hover:bg-white/10'}`}>{d}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the video you want to generate..." rows={4} maxLength={1000} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#06B6D4]" />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleGenerate} disabled={!prompt || generating} className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3">
          {generating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
          {generating ? 'Generating...' : 'Generate Video'}
        </button>
      </div>

      {generatedVideos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">Generated Videos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generatedVideos.map((vid) => (
              <div key={vid.id} className="relative group rounded-xl overflow-hidden border border-white/10">
                <img src={vid.thumbnail} alt="Video" className="w-full aspect-video object-cover" />
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-xs text-white">{vid.duration}</div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderImageToVideo = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-[#06B6D4]/50 transition-colors cursor-pointer" onClick={() => document.getElementById('i2v-upload')?.click()}>
        {uploadedImage ? (
          <div className="relative">
            <img src={uploadedImage} alt="Uploaded" className="max-h-64 mx-auto rounded-xl" />
            <button onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }} className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white hover:bg-red-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#06B6D4]/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            </div>
            <div>
              <div className="text-white font-medium">Click to upload image</div>
              <div className="text-[#9CA3AF] text-sm">PNG, JPG up to 10MB</div>
            </div>
          </div>
        )}
        <input type="file" id="i2v-upload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Motion Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the motion you want (e.g., 'camera pans right, clouds drift')..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#06B6D4]" />
      </div>

      <button onClick={handleGenerate} disabled={!uploadedImage || generating} className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] disabled:opacity-50 transition-all">
        {generating ? 'Animating...' : 'Animate Image'}
      </button>
    </div>
  );

  const renderSmartShot = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Story Description</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your story in detail - characters, actions, setting, mood..." rows={6} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#06B6D4]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Genre / Style</label>
        <div className="flex flex-wrap gap-2">
          {['Cinematic', 'Documentary', 'Anime', 'Commercial', 'Music Video', 'Short Film', 'Vlog', 'Action'].map((genre) => (
            <button key={genre} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{genre}</button>
          ))}
        </div>
      </div>

      <button onClick={handleGenerate} disabled={!prompt || generating} className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] disabled:opacity-50 transition-all">
        {generating ? 'Creating Storyboard...' : 'Generate Smart Shot'}
      </button>
    </div>
  );

  const renderMotionSync = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Upload source video (motion reference)</span>
        </div>
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Upload target image/video</span>
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] transition-all">
        Sync Motion
      </button>
    </div>
  );

  const renderEditVideo = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to edit</span>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Edit Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what you want to change in the video..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#06B6D4]" />
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] transition-all">
        Apply Edit
      </button>
    </div>
  );

  const renderExtendVideo = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to extend</span>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Extend By</label>
        <div className="flex gap-2">
          {['3 seconds', '5 seconds', '10 seconds'].map((ext) => (
            <button key={ext} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{ext}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Continuation Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe how the video should continue..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#06B6D4]" />
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] transition-all">
        Extend Video
      </button>
    </div>
  );

  const renderRestyleVideo = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to restyle</span>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Target Style</label>
        <div className="flex flex-wrap gap-2">
          {['Film Noir', 'Cyberpunk', 'Vintage', 'Anime', 'Watercolor', 'Sketch', '3D Animation', 'Retro'].map((style) => (
            <button key={style} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{style}</button>
          ))}
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] transition-all">
        Restyle Video
      </button>
    </div>
  );

  const renderReplaceCharacter = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Upload video</span>
        </div>
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Upload replacement character image</span>
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] transition-all">
        Replace Character
      </button>
    </div>
  );

  const renderUpscale = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to upscale</span>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Resolution</label>
        <div className="flex gap-4">
          {['720p (HD)', '1080p (Full HD)', '4K'].map((res) => (
            <button key={res} className="flex-1 py-4 rounded-xl border text-center bg-white/5 border-white/10">
              <div className="text-lg font-bold text-white">{res}</div>
            </button>
          ))}
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] transition-all">
        Upscale Video
      </button>
    </div>
  );

  const renderSoundEffects = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to add sound effects</span>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Sound Effect Type</label>
        <div className="grid grid-cols-3 gap-2">
          {['Ambient', 'Foley', 'Impact', 'Whoosh', 'UI Sounds', 'Nature', 'Urban', 'Sci-Fi'].map((type) => (
            <button key={type} className="py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{type}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Custom Prompt</label>
        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe specific sounds..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#06B6D4]" />
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] transition-all">
        Add Sound Effects
      </button>
    </div>
  );

  const renderMixedMedia = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Media Sources</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
            <span className="text-[#9CA3AF]">Upload footage</span>
          </div>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
            <span className="text-[#9CA3AF]">Generate AI element</span>
          </div>
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] transition-all">
        Blend Media
      </button>
    </div>
  );

  const renderCameraMotion = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to apply camera motion</span>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Camera Movement</label>
        <div className="grid grid-cols-4 gap-2">
          {['Static', 'Zoom In', 'Zoom Out', 'Pan Left', 'Pan Right', 'Tilt Up', 'Tilt Down', 'Orbit', 'Dolly', 'Crane', 'Tracking', 'Handheld'].map((move) => (
            <button key={move} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{move}</button>
          ))}
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#06B6D4] text-white font-bold hover:bg-[#0891B2] transition-all">
        Apply Camera Motion
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'text-to-video': return renderTextToVideo();
      case 'image-to-video': return renderImageToVideo();
      case 'smart-shot': return renderSmartShot();
      case 'motion-sync': return renderMotionSync();
      case 'edit': return renderEditVideo();
      case 'extend': return renderExtendVideo();
      case 'restyle': return renderRestyleVideo();
      case 'replace-character': return renderReplaceCharacter();
      case 'upscale': return renderUpscale();
      case 'sound-effects': return renderSoundEffects();
      case 'mixed-media': return renderMixedMedia();
      case 'camera-motion': return renderCameraMotion();
      default: return renderTextToVideo();
    }
  };

  return (
    <div className="min-h-full bg-[#0A0F1E] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Video Studio</h1>
        <p className="text-[#9CA3AF]">Create AI videos with Kling, Seedance, Veo, and more</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {VIDEO_TABS.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); router.push(`/studio/video/${tab.id}`); }} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#06B6D4] text-white' : 'bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white'}`}>
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