'use client';

import { useState } from 'react';
import { Sparkles, Upload, Search, Sliders, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

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
    <StudioEditorLayout
      left={
        <LeftPanel title="VFX OPTIONS">
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 8, color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search effects..."
              style={{
                width: '100%', padding: '6px 10px 6px 28px', borderRadius: 8,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                color: 'var(--text-primary)', fontSize: 12,
              }}
            />
          </div>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '6px 10px',
                background: category === c ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 6,
                color: category === c ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 11, textAlign: 'left', transition: 'all 100ms',
              }}
            >{c}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
            color: 'transparent',
            background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            VFX PRESETS
          </h1>
          {!selectedEffect && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
              gap: 8, marginTop: 16, zIndex: 1, maxWidth: 500, width: '100%', padding: '0 16px',
            }}>
              {filtered.slice(0, 12).map(effect => (
                <button key={effect.id} onClick={() => handleApply(effect)}
                  style={{
                    background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border-subtle)',
                    padding: 8, cursor: 'pointer', textAlign: 'left',
                  }}>
                  <div style={{
                    aspectRatio: '16/9', borderRadius: 6, marginBottom: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: effect.color + '22',
                  }}>
                    <Zap size={14} style={{ color: effect.color }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{effect.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{effect.cost} credits</div>
                </button>
              ))}
            </div>
          )}
          {selectedEffect && (
            <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1 }}>
              {uploadedFile ? (
                <div style={{ width: 200, borderRadius: 12, border: '1px solid var(--border-default)', overflow: 'hidden' }}>
                  <video src={URL.createObjectURL(uploadedFile)} style={{ width: '100%', height: 120, objectFit: 'contain' }} />
                  <button onClick={() => setUploadedFile(null)}
                    style={{
                      width: '100%', padding: '4px', background: 'var(--bg-input)', border: 'none',
                      color: 'var(--text-secondary)', fontSize: 10, cursor: 'pointer',
                    }}
                  >Remove</button>
                </div>
              ) : (
                <label style={{
                  width: 200, height: 120, borderRadius: 12, border: '2px dashed var(--border-default)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 6, cursor: 'pointer', background: 'var(--bg-input)',
                }}>
                  <Upload size={20} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Upload video</span>
                  <input type="file" accept="video/*" onChange={e => setUploadedFile(e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              )}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-text)', marginBottom: 8 }}>{selectedEffect.name}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Intensity: {intensity}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {INTENSITY_PILLS.map(o => (
                    <button key={o} onClick={() => setIntensity(o)}
                      style={{
                        padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                        background: intensity === o ? 'var(--accent-bg)' : 'var(--bg-input)',
                        border: '1px solid var(--border-default)', cursor: 'pointer',
                        color: intensity === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                      }}
                    >{o}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder={selectedEffect ? `Applying ${selectedEffect.name} — upload video...` : 'Browse VFX presets or search above...'} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading || !uploadedFile} style={{ opacity: loading || !uploadedFile ? 0.6 : 1 }}>
              {loading ? 'Applying...' : `Apply ${selectedEffect?.name || 'VFX'}`}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
