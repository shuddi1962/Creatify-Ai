'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CINEMA_TABS = [
  { id: 'generate', label: 'Cinematic Generator', desc: 'Full cinematic video generation with Hollywood-level quality', icon: '🎬' },
  { id: 'vfx', label: 'VFX Presets', desc: '200+ one-click visual effects — explosion, fire, raven and more', icon: '💥' },
  { id: 'color-grading', label: 'Color Grading', desc: 'Apply professional color grading presets to any video instantly', icon: '🎨' },
  { id: 'storyboard', label: 'Storyboard Builder', desc: 'Plan and visualize your scenes before generating any video', icon: '📋' },
  { id: 'scene', label: 'Scene Composition', desc: 'Director-level control over every element in your scene', icon: '🎭' },
  { id: 'genres', label: 'Genre Presets', desc: 'One-click style presets for action, horror, romance, sci-fi', icon: '🎞️' },
  { id: 'camera', label: 'Camera Controls', desc: 'Lens, focal length, aperture, and depth of field controls', icon: '📷' },
];

const VFX_PRESETS = [
  { id: 'explosion', name: 'Explosion', category: 'Action', icon: '💥' },
  { id: 'fire', name: 'Fire', category: 'Nature', icon: '🔥' },
  { id: 'raven', name: 'Raven', category: 'Creature', icon: '🐦' },
  { id: 'werewolf', name: 'Werewolf', category: 'Creature', icon: '🐺' },
  { id: 'lightning', name: 'Lightning', category: 'Nature', icon: '⚡' },
  { id: 'smoke', name: 'Smoke', category: 'Atmosphere', icon: '☁️' },
  { id: 'water-splash', name: 'Water Splash', category: 'Nature', icon: '💦' },
  { id: 'sparks', name: 'Sparks', category: 'Action', icon: '✨' },
];

const COLOR_GRADES = [
  { id: 'cinematic', name: 'Cinematic', look: 'Teal & Orange' },
  { id: 'noir', name: 'Film Noir', look: 'High Contrast B&W' },
  { id: 'vintage', name: 'Vintage', look: 'Faded & Warm' },
  { id: 'vibrant', name: 'Vibrant', look: 'Saturated Colors' },
  { id: 'muted', name: 'Muted', look: 'Desaturated' },
  { id: 'teal-orange', name: 'Teal & Orange', look: 'Classic Blockbuster' },
  { id: 'cold-war', name: 'Cold War', look: 'Blue & Green' },
  { id: 'sunset', name: 'Sunset', look: 'Warm Golden' },
];

const GENRES = ['Action', 'Horror', 'Romance', 'Sci-Fi', 'Comedy', 'Drama', 'Thriller', 'Fantasy'];

const CAMERA_SETTINGS = {
  lenses: ['24mm', '35mm', '50mm', '85mm', '135mm', '200mm'],
  apertures: ['f/1.4', 'f/2', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11'],
  focalLengths: ['Wide', 'Standard', 'Telephoto'],
};

export default function CinemaStudioTabs({ initialTab, apiKey }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'generate');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [selectedVFX, setSelectedVFX] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [lens, setLens] = useState('50mm');
  const [aperture, setAperture] = useState('f/2.8');

  const router = useRouter();

  const handleGenerate = () => {
    if (!prompt) return;
    setGenerating(true);
    setTimeout(() => setGenerating(false), 5000);
  };

  const renderGenerate = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Cinematic Description</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your cinematic scene in detail - setting, characters, action, mood, lighting..." rows={6} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#EF4444]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Genre</label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button key={g} onClick={() => setSelectedGenre(g)} className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedGenre === g ? 'bg-[#EF4444]/20 border border-[#EF4444]/50 text-white' : 'bg-white/5 border border-white/10 text-[#9CA3AF] hover:text-white'}`}>{g}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Camera Lens</label>
          <div className="grid grid-cols-3 gap-2">
            {CAMERA_SETTINGS.lenses.map((l) => (
              <button key={l} onClick={() => setLens(l)} className={`py-2 rounded-lg text-xs ${lens === l ? 'bg-[#EF4444]/20 text-white border border-[#EF4444]/50' : 'bg-white/5 text-[#9CA3AF] border border-white/10'}`}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Aperture</label>
          <div className="grid grid-cols-4 gap-2">
            {CAMERA_SETTINGS.apertures.map((a) => (
              <button key={a} onClick={() => setAperture(a)} className={`py-2 rounded-lg text-xs ${aperture === a ? 'bg-[#EF4444]/20 text-white border border-[#EF4444]/50' : 'bg-white/5 text-[#9CA3AF] border border-white/10'}`}>{a}</button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={!prompt || generating} className="px-8 py-3 rounded-xl bg-[#EF4444] text-white font-bold hover:bg-[#DC2626] disabled:opacity-50 transition-all">
        {generating ? 'Generating Cinematic...' : 'Generate Cinematic Video'}
      </button>
    </div>
  );

  const renderVFX = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">VFX Category</label>
        <div className="flex flex-wrap gap-2">
          {['All', 'Action', 'Nature', 'Creature', 'Atmosphere', 'Sci-Fi', 'Fantasy'].map((cat) => (
            <button key={cat} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{cat}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Select VFX</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VFX_PRESETS.map((vfx) => (
            <button key={vfx.id} onClick={() => setSelectedVFX(vfx.id)} className={`p-4 rounded-xl border text-center transition-all ${selectedVFX === vfx.id ? 'bg-[#EF4444]/20 border-[#EF4444]/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <div className="text-3xl mb-2">{vfx.icon}</div>
              <div className="text-sm font-medium text-white">{vfx.name}</div>
              <div className="text-[10px] text-[#9CA3AF]">{vfx.category}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to apply VFX</span>
      </div>

      <button disabled={!selectedVFX} className="px-8 py-3 rounded-xl bg-[#EF4444] text-white font-bold hover:bg-[#DC2626] disabled:opacity-50 transition-all">
        Apply VFX
      </button>
    </div>
  );

  const renderColorGrading = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to color grade</span>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Select Color Grade</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COLOR_GRADES.map((grade) => (
            <button key={grade.id} onClick={() => setSelectedGrade(grade.id)} className={`p-4 rounded-xl border text-center transition-all ${selectedGrade === grade.id ? 'bg-[#EF4444]/20 border-[#EF4444]/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <div className="text-sm font-medium text-white">{grade.name}</div>
              <div className="text-[10px] text-[#9CA3AF]">{grade.look}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Manual Adjustments</label>
        <div className="grid grid-cols-3 gap-4">
          {['Exposure', 'Contrast', 'Saturation', 'Temperature', 'Tint', 'Vignette'].map((adj) => (
            <div key={adj}>
              <label className="block text-[10px] text-[#9CA3AF] mb-1">{adj}</label>
              <input type="range" className="w-full" />
            </div>
          ))}
        </div>
      </div>

      <button disabled={!selectedGrade} className="px-8 py-3 rounded-xl bg-[#EF4444] text-white font-bold hover:bg-[#DC2626] disabled:opacity-50 transition-all">
        Apply Color Grade
      </button>
    </div>
  );

  const renderStoryboard = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Story Description</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your story for storyboard generation..." rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#EF4444]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Number of Scenes</label>
        <div className="flex gap-2">
          {[4, 6, 8, 12].map((n) => (
            <button key={n} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#9CA3AF] hover:text-white">{n} panels</button>
          ))}
        </div>
      </div>

      <button className="px-8 py-3 rounded-xl bg-[#EF4444] text-white font-bold hover:bg-[#DC2626] transition-all">
        Generate Storyboard
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-[#9CA3AF] text-sm">Scene {i}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScene = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Background</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
            <span className="text-[#9CA3AF]">Upload or generate background</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Foreground Elements</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
            <span className="text-[#9CA3AF]">Add characters & props</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Lighting</label>
        <div className="grid grid-cols-4 gap-2">
          {['Natural', 'Studio', 'Rembrandt', 'Split', 'Back', 'Ring', 'Soft', 'Hard'].map((light) => (
            <button key={light} className="py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{light}</button>
          ))}
        </div>
      </div>

      <button className="px-8 py-3 rounded-xl bg-[#EF4444] text-white font-bold hover:bg-[#DC2626] transition-all">
        Compose Scene
      </button>
    </div>
  );

  const renderGenres = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Select Genre</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GENRES.map((g) => (
            <button key={g} className="p-6 rounded-xl bg-white/5 border border-white/10 text-center hover:bg-white/10 hover:border-[#EF4444]/50 transition-all">
              <div className="text-lg font-medium text-white mb-1">{g}</div>
              <div className="text-xs text-[#9CA3AF]">Style preset</div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to apply genre preset</span>
      </div>

      <button className="px-8 py-3 rounded-xl bg-[#EF4444] text-white font-bold hover:bg-[#DC2626] transition-all">
        Apply Genre Style
      </button>
    </div>
  );

  const renderCamera = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to adjust camera settings</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Lens</label>
          <div className="space-y-2">
            {CAMERA_SETTINGS.lenses.map((l) => (
              <button key={l} onClick={() => setLens(l)} className={`w-full py-2 rounded-lg text-sm ${lens === l ? 'bg-[#EF4444]/20 text-white border border-[#EF4444]/50' : 'bg-white/5 text-[#9CA3AF] border border-white/10'}`}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Aperture</label>
          <div className="space-y-2">
            {CAMERA_SETTINGS.apertures.map((a) => (
              <button key={a} onClick={() => setAperture(a)} className={`w-full py-2 rounded-lg text-sm ${aperture === a ? 'bg-[#EF4444]/20 text-white border border-[#EF4444]/50' : 'bg-white/5 text-[#9CA3AF] border border-white/10'}`}>{a}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Focal Length</label>
          <div className="space-y-2">
            {CAMERA_SETTINGS.focalLengths.map((f) => (
              <button key={f} className="w-full py-2 rounded-lg text-sm bg-white/5 text-[#9CA3AF] border border-white/10">{f}</button>
            ))}
          </div>
        </div>
      </div>

      <button className="px-8 py-3 rounded-xl bg-[#EF4444] text-white font-bold hover:bg-[#DC2626] transition-all">
        Apply Camera Settings
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'generate': return renderGenerate();
      case 'vfx': return renderVFX();
      case 'color-grading': return renderColorGrading();
      case 'storyboard': return renderStoryboard();
      case 'scene': return renderScene();
      case 'genres': return renderGenres();
      case 'camera': return renderCamera();
      default: return renderGenerate();
    }
  };

  return (
    <div className="min-h-full bg-[#0A0F1E] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Cinema Studio</h1>
        <p className="text-[#9CA3AF]">Cinematic AI video generation with camera controls and scene composition</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CINEMA_TABS.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); router.push(`/studio/cinema/${tab.id}`); }} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#EF4444] text-white' : 'bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white'}`}>
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