'use client';

import { useState } from 'react';
import { Sparkles, Upload, Search, Sliders, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';
import UploadZone from '@/components/studio/UploadZone';

const CATEGORIES = ['All', 'Fire & Explosion', 'Weather', 'Magic', 'Creatures', 'Technology', 'Space', 'Nature', 'Destruction', 'Transition', 'Light & Color'];

const EFFECTS = [
  { id: 'explosion', name: 'Explosion', category: 'Fire & Explosion', badge: 'TOP', cost: 50, color: '#FF4500' },
  { id: 'nuclear-blast', name: 'Nuclear Blast', category: 'Fire & Explosion', badge: 'NEW', cost: 80, color: '#FFFF00' },
  { id: 'car-explosion', name: 'Car Explosion', category: 'Fire & Explosion', cost: 45, color: '#FF6347' },
  { id: 'building-collapse', name: 'Building Collapse', category: 'Destruction', badge: 'TOP', cost: 60, color: '#8B4513' },
  { id: 'meteor-impact', name: 'Meteor Impact', category: 'Space', badge: 'TOP', cost: 70, color: '#FF6600' },
  { id: 'fire-engulf', name: 'Fire Engulf', category: 'Fire & Explosion', cost: 40, color: '#FF0000' },
  { id: 'ring-of-fire', name: 'Ring of Fire', category: 'Fire & Explosion', cost: 35, color: '#FF8C00' },
  { id: 'fire-tornado', name: 'Fire Tornado', category: 'Fire & Explosion', badge: 'NEW', cost: 55, color: '#FF4500' },
  { id: 'flamethrower', name: 'Flamethrower', category: 'Fire & Explosion', cost: 40, color: '#FF6B35' },
  { id: 'lightning-strike', name: 'Lightning Strike', category: 'Weather', badge: 'TOP', cost: 30, color: '#E0FFFF' },
  { id: 'thunder-storm', name: 'Thunder Storm', category: 'Weather', cost: 35, color: '#4682B4' },
  { id: 'heavy-rain', name: 'Heavy Rain', category: 'Weather', cost: 25, color: '#87CEEB' },
  { id: 'blizzard', name: 'Blizzard', category: 'Weather', cost: 40, color: '#E0FFFF' },
  { id: 'tornado', name: 'Tornado', category: 'Weather', badge: 'TOP', cost: 50, color: '#708090' },
  { id: 'raven-transition', name: 'Raven Transition', category: 'Transition', badge: 'NEW', cost: 30, color: '#191970' },
  { id: 'butterfly-transform', name: 'Butterfly Transform', category: 'Magic', cost: 35, color: '#FF69B4' },
  { id: 'phoenix-rise', name: 'Phoenix Rise', category: 'Magic', badge: 'TOP', cost: 60, color: '#FFD700' },
  { id: 'dragon-wings', name: 'Dragon Wings', category: 'Creatures', badge: 'TOP', cost: 65, color: '#8B0000' },
  { id: 'werewolf', name: 'Werewolf', category: 'Creatures', cost: 55, color: '#2F4F4F' },
  { id: 'matrix-rain', name: 'Matrix Rain', category: 'Technology', badge: 'TOP', cost: 25, color: '#00FF00' },
  { id: 'glitch-effect', name: 'Glitch Effect', category: 'Technology', cost: 20, color: '#FF00FF' },
  { id: 'hologram', name: 'Hologram', category: 'Technology', cost: 35, color: '#00FFFF' },
  { id: 'laser-beams', name: 'Laser Beams', category: 'Technology', cost: 30, color: '#FF1493' },
  { id: 'portal', name: 'Portal', category: 'Magic', badge: 'TOP', cost: 45, color: '#9400D3' },
  { id: 'galaxy-formation', name: 'Galaxy Formation', category: 'Space', cost: 70, color: '#4169E1' },
  { id: 'solar-flare', name: 'Solar Flare', category: 'Space', cost: 55, color: '#FF4500' },
  { id: 'asteroid-field', name: 'Asteroid Field', category: 'Space', cost: 50, color: '#A0522D' },
  { id: 'black-hole', name: 'Black Hole', category: 'Space', badge: 'TOP', cost: 75, color: '#000000' },
  { id: 'tidal-wave', name: 'Tidal Wave', category: 'Nature', cost: 45, color: '#00CED1' },
  { id: 'earthquake', name: 'Earthquake', category: 'Nature', badge: 'TOP', cost: 40, color: '#8B4513' },
  { id: 'volcanic-eruption', name: 'Volcanic Eruption', category: 'Nature', cost: 55, color: '#FF4500' },
  { id: 'avalanche', name: 'Avalanche', category: 'Nature', cost: 45, color: '#F0F8FF' },
  { id: 'bloom-light', name: 'Bloom Light', category: 'Light & Color', badge: 'TOP', cost: 20, color: '#FFD700' },
  { id: 'lens-flare', name: 'Lens Flare', category: 'Light & Color', cost: 15, color: '#FFFACD' },
  { id: 'rainbow', name: 'Rainbow', category: 'Light & Color', cost: 20, color: '#FF69B4' },
  { id: 'northern-lights', name: 'Northern Lights', category: 'Nature', badge: 'TOP', cost: 45, color: '#00FF7F' },
  { id: 'sunset-burst', name: 'Sunset Burst', category: 'Light & Color', cost: 25, color: '#FF6347' },
  { id: 'paper-burn', name: 'Paper Burn', category: 'Transition', cost: 25, color: '#D2691E' },
  { id: 'film-grain', name: 'Film Grain', category: 'Light & Color', cost: 10, color: '#D3D3D3' },
  { id: 'vhs-effect', name: 'VHS Effect', category: 'Light & Color', cost: 10, color: '#708090' },
  { id: 'chromatic-aberration', name: 'Chromatic Aberration', category: 'Light & Color', cost: 15, color: '#FF0000' },
  { id: 'dust-particles', name: 'Dust Particles', category: 'Nature', cost: 15, color: '#D2B48C' },
];

const INTENSITY_PILLS = ['Subtle', 'Medium', 'Intense', 'Maximum'];
const POSITION_PILLS = ['Full Frame', 'Top Left', 'Top Right', 'Bottom Left', 'Bottom Right', 'Center', 'Background', 'Foreground'];
const BLEND_PILLS = ['Normal', 'Screen', 'Add', 'Overlay', 'Soft Light', 'Hard Light', 'Multiply'];

export default function CinemaVFXPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [intensity, setIntensity] = useState('Medium');
  const [position, setPosition] = useState('Full Frame');
  const [blend, setBlend] = useState('Normal');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const filtered = EFFECTS.filter(e => {
    const matchesCat = category === 'All' || e.category === category;
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApply = (effect) => {
    setSelectedEffect(effect);
    setUploadedFile(null);
  };

  const handleGenerate = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a video first');
      return;
    }
    setLoading(true);
    toast.success(`Applying ${selectedEffect.name}...`);
    try {
      await new Promise(r => setTimeout(r, 3000));
      setResults([{ id: Date.now(), type: 'video', url: 'https://picsum.photos/seed/vfx/1280/720', prompt: selectedEffect.name }]);
      toast.success('VFX applied successfully!');
    } catch (e) {
      toast.error('Failed to apply VFX');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Sparkles} badge="NEW" title="VFX PRESETS" subtitle="200+ one-click visual effects — apply to any video instantly" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search effects..."
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#444]"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    category === c ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map(effect => (
                <button
                  key={effect.id}
                  onClick={() => handleApply(effect)}
                  className="relative bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-3 hover:border-[#7C3AED]/50 transition-all group"
                >
                  <div className="w-full aspect-video rounded-lg mb-2 flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: effect.color + '22', color: effect.color }}>
                    <Zap size={20} />
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{effect.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {effect.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${effect.badge === 'NEW' ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : 'bg-[#CCFF00]/20 text-[#CCFF00]'}`}>
                        {effect.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-[#555]">{effect.cost} credits</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </GenerationPanel>
        {selectedEffect && (
          <GenerationPanel>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[#7C3AED]" />
                <SectionLabel>Applying: {selectedEffect.name}</SectionLabel>
              </div>
              <UploadZone onFile={setUploadedFile} accept="video/*" label="Upload video to apply VFX" icon={Upload} preview={uploadedFile ? URL.createObjectURL(uploadedFile) : null} />
              {uploadedFile && (
                <>
                  <div>
                    <SectionLabel>Intensity</SectionLabel>
                    <PillSelector options={INTENSITY_PILLS} value={intensity} onChange={setIntensity} />
                  </div>
                  <div>
                    <SectionLabel>Position</SectionLabel>
                    <PillSelector options={POSITION_PILLS} value={position} onChange={setPosition} />
                  </div>
                  <div>
                    <SectionLabel>Blend Mode</SectionLabel>
                    <PillSelector options={BLEND_PILLS} value={blend} onChange={setBlend} />
                  </div>
                  <GenerateButton onClick={handleGenerate} loading={loading}>
                    Apply {selectedEffect.name}
                  </GenerateButton>
                </>
              )}
            </div>
          </GenerationPanel>
        )}
        <ResultsGrid results={results} columns={2} />
      </div>
    </div>
  );
}