'use client';

import { useState } from 'react';
import { Video } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const SCALE_OPTIONS = ['2x', '4x'];
const RESOLUTION_OPTIONS = ['720p', '1080p', '2K', '4K'];
const ENHANCEMENT_OPTIONS = ['Standard', 'Face Detail', 'Noise Reduction', 'Sharpen', 'Film Grain Remove'];

export default function UpscaleVideoPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [currentResolution, setCurrentResolution] = useState(null);
  const [scale, setScale] = useState('2x');
  const [targetResolution, setTargetResolution] = useState('1080p');
  const [enhancement, setEnhancement] = useState('Standard');
  const [fpsEnhancement, setFpsEnhancement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); setCurrentResolution('720p'); }
    else { setVideoFile(null); setVideoPreview(null); setCurrentResolution(null); }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video to upscale');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Video upscaling started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 4000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt: `Upscaled to ${targetResolution}`, type: 'video' }]);
        toast.success('Demo: Video upscaled!');
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
          <LeftPanel title="SCALE">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 4px 10px' }}>
              Scale Factor
            </div>
            {SCALE_OPTIONS.map(s => (
              <button key={s} onClick={() => setScale(s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: scale === s ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: scale === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (scale !== s) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (scale !== s) e.currentTarget.style.background = 'none'; }}
              >
                {s}
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '12px 0' }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 4px 10px' }}>
              Target Resolution
            </div>
            {RESOLUTION_OPTIONS.map(r => (
              <button key={r} onClick={() => setTargetResolution(r)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: targetResolution === r ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: targetResolution === r ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (targetResolution !== r) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (targetResolution !== r) e.currentTarget.style.background = 'none'; }}
              >
                {r}
              </button>
            ))}
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
                VIDEO UPSCALE
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                Enhance any video to HD or 4K resolution with AI
              </p>
              {videoPreview ? (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', width: '100%' }}>
                  <video src={videoPreview} controls style={{ width: '100%', height: 240, objectFit: 'contain', background: '#000' }} />
                  <div style={{ position: 'absolute', top: 8, left: 8, padding: '2px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.6)', fontSize: 11, color: '#fff' }}>{currentResolution}</div>
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
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Upload video to upscale</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={e => handleVideoUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Video Upscale">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <div style={{ minWidth: 140 }}>
                <StudioDropdown value={enhancement} onChange={setEnhancement} options={ENHANCEMENT_OPTIONS} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setFpsEnhancement(!fpsEnhancement)}
                  style={{ width: 32, height: 18, borderRadius: 100, position: 'relative', background: fpsEnhancement ? '#7C3AED' : 'var(--bg-input)', border: 'none', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', top: 2, left: fpsEnhancement ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 150ms' }} />
                </button>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>24 to 60fps</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={handleGenerate}>
                {loading ? 'Upscaling...' : 'GENERATE'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}

