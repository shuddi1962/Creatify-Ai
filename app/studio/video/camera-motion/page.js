'use client';

import { useState } from 'react';
import { Video, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const CAMERA_PRESETS = [
  { id: 'static', label: 'Static' },
  { id: 'slow-zoom-in', label: 'Slow Zoom In' },
  { id: 'zoom-out', label: 'Zoom Out' },
  { id: 'pan-left', label: 'Pan Left' },
  { id: 'pan-right', label: 'Pan Right' },
  { id: 'tilt-up', label: 'Tilt Up' },
  { id: 'tilt-down', label: 'Tilt Down' },
  { id: 'orbit-left', label: 'Orbit Left' },
  { id: 'orbit-right', label: 'Orbit Right' },
  { id: 'dolly-push', label: 'Dolly Push' },
  { id: 'dolly-pull', label: 'Dolly Pull' },
  { id: 'crane-up', label: 'Crane Up' },
  { id: 'crane-down', label: 'Crane Down' },
  { id: 'handheld', label: 'Handheld' },
  { id: 'steadicam', label: 'Steadicam' },
  { id: 'dutch-tilt', label: 'Dutch Tilt' },
  { id: 'whip-pan', label: 'Whip Pan' },
];
const SPEED_OPTIONS = ['Slow', 'Normal', 'Fast'];
const INPUT_TABS = ['Prompt', 'Upload video'];

export default function CameraMotionPage() {
  const [inputMode, setInputMode] = useState('Prompt');
  const [prompt, setPrompt] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [cameraPreset, setCameraPreset] = useState('static');
  const [motionSpeed, setMotionSpeed] = useState('Normal');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); }
    else { setVideoFile(null); setVideoPreview(null); }
  };

  const handleGenerate = async () => {
    if (!prompt && !videoFile) {
      toast.error('Please enter a prompt or upload a video');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Applying camera motion!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt: `Camera: ${cameraPreset}`, type: 'video' }]);
        toast.success('Demo: Camera motion applied!');
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
          <LeftPanel title="CAMERA PRESETS">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: '0 2px' }}>
              {CAMERA_PRESETS.map(p => (
                <button key={p.id} onClick={() => setCameraPreset(p.id)}
                  style={{
                    padding: '6px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500, textAlign: 'center',
                    background: cameraPreset === p.id ? 'var(--accent-bg)' : 'var(--bg-input)',
                    border: cameraPreset === p.id ? '1px solid var(--accent-border)' : '1px solid var(--border-default)',
                    color: cameraPreset === p.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 100ms',
                  }}
                  onMouseEnter={e => { if (cameraPreset !== p.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (cameraPreset !== p.id) e.currentTarget.style.background = 'var(--bg-input)'; }}
                >
                  {p.label}
                </button>
              ))}
            </div>
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
                CAMERA MOTION
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                Apply professional camera movements to any AI or real video
              </p>
              {inputMode === 'Upload video' && videoPreview && (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', width: '100%' }}>
                  <video src={videoPreview} controls style={{ width: '100%', height: 240, objectFit: 'contain', background: '#000' }} />
                  <button onClick={() => handleVideoUpload(null)}
                    style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ×
                  </button>
                </div>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Camera Motion">
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {INPUT_TABS.map(tab => (
                <button key={tab} onClick={() => setInputMode(tab)}
                  style={{
                    padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                    background: inputMode === tab ? 'var(--accent-bg)' : 'var(--bg-input)',
                    border: inputMode === tab ? '1px solid var(--accent-border)' : '1px solid var(--border-default)',
                    color: inputMode === tab ? 'var(--accent-text)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}>
                  {tab}
                </button>
              ))}
            </div>
            {inputMode === 'Prompt' ? (
              <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the video you want to create..." />
            ) : !videoPreview ? (
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, flex: 1 }}>
                <Video size={14} />
                Click to upload video
                <input type="file" accept="video/*" onChange={e => handleVideoUpload(e.target.files?.[0])} style={{ display: 'none' }} />
              </label>
            ) : null}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ minWidth: 80 }}>
                <StudioDropdown value={motionSpeed} onChange={setMotionSpeed} options={SPEED_OPTIONS} />
              </div>
              <GenerateButton onClick={handleGenerate}>
                {loading ? 'Applying...' : 'GENERATE ✦ 8'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
