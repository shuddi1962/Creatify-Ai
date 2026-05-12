'use client';

import { useState } from 'react';
import { Video, Volume2, Library } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const EFFECT_SOURCE = ['Auto Detect', 'Manual', 'Library'];
const EFFECT_LIBRARY = ['Rain', 'Explosion', 'Footsteps', 'Crowd', 'Ocean', 'Wind', 'Birds', 'City', 'Thunder', 'Fire', 'Glass Breaking', 'Car Engine', 'Door', 'Applause', 'Gunshot'];

export default function SoundEffectsPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [effectSource, setEffectSource] = useState('Auto Detect');
  const [manualPrompt, setManualPrompt] = useState('');
  const [selectedEffects, setSelectedEffects] = useState([]);
  const [volume, setVolume] = useState(80);
  const [mixWithOriginal, setMixWithOriginal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); }
    else { setVideoFile(null); setVideoPreview(null); }
  };

  const toggleEffect = (effect) => {
    if (selectedEffects.includes(effect)) {
      setSelectedEffects(selectedEffects.filter(e => e !== effect));
    } else {
      setSelectedEffects([...selectedEffects, effect]);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Adding sound effects!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt: selectedEffects.length > 0 ? selectedEffects.join(', ') : 'Auto-detected sounds', type: 'video' }]);
        toast.success('Demo: Sound effects added!');
      }
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="EFFECT SOURCE">
            {EFFECT_SOURCE.map(src => (
              <button key={src} onClick={() => setEffectSource(src)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: effectSource === src ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: effectSource === src ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (effectSource !== src) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (effectSource !== src) e.currentTarget.style.background = 'none'; }}
              >
                {src === 'Auto Detect' && <Volume2 size={14} />}
                {src === 'Manual' && <Library size={14} />}
                {src === 'Library' && <Library size={14} />}
                {src}
              </button>
            ))}
            {effectSource === 'Library' && (
              <>
                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '12px 0' }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 4px 10px' }}>
                  Sound Library
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '0 4px' }}>
                  {EFFECT_LIBRARY.map(effect => (
                    <button key={effect} onClick={() => toggleEffect(effect)}
                      style={{
                        padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                        background: selectedEffects.includes(effect) ? 'var(--accent-bg)' : 'var(--bg-input)',
                        border: selectedEffects.includes(effect) ? '1px solid var(--accent-border)' : '1px solid var(--border-default)',
                        color: selectedEffects.includes(effect) ? 'var(--accent-text)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}>
                      {effect}
                    </button>
                  ))}
                </div>
              </>
            )}
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, zIndex: 1, width: '100%', maxWidth: 500, padding: '0 24px' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
                color: 'transparent',
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', lineHeight: 1.2,
              }}>
                ADD SOUND EFFECTS
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                Layer AI-generated sound effects onto any video automatically
              </p>
              {videoPreview ? (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', width: '100%' }}>
                  <video src={videoPreview} controls style={{ width: '100%', height: 240, objectFit: 'contain', background: '#000' }} />
                  <button onClick={() => handleVideoUpload(null)}
                    style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ×
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 40, borderRadius: 12, border: '2px dashed var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-card)', width: '100%' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video size={28} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Upload video to add sound to</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={e => handleVideoUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Sound Effects">
            {effectSource === 'Manual' && (
              <PromptInput value={manualPrompt} onChange={e => setManualPrompt(e.target.value)} placeholder="Describe the sound effects you want..." />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 200 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Vol: {volume}%</span>
                <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(parseInt(e.target.value))}
                  style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-input)', accentColor: '#7C3AED' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setMixWithOriginal(!mixWithOriginal)}
                  style={{ width: 32, height: 18, borderRadius: 100, position: 'relative', background: mixWithOriginal ? '#7C3AED' : 'var(--bg-input)', border: 'none', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', top: 2, left: mixWithOriginal ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 150ms' }} />
                </button>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mix audio</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={handleGenerate}>
                {loading ? 'Adding...' : 'GENERATE ✦ 8'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
