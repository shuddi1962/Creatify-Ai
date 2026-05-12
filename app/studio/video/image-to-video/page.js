'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const MOTION_PRESETS = ['Zoom In', 'Zoom Out', 'Pan Right', 'Pan Left', 'Orbit', 'Float', 'Shake', 'Cinematic Drift', 'Breathing', 'Subtle Motion'];
const DURATION_OPTIONS = ['3s', '5s', '8s', '10s', '15s'];
const ASPECT_OPTIONS = ['Keep Original', '16:9', '9:16', '1:1'];
const STRENGTH_OPTIONS = ['Low', 'Medium', 'High'];

export default function ImageToVideoPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [motionPrompt, setMotionPrompt] = useState('');
  const [motionPreset, setMotionPreset] = useState('Zoom In');
  const [duration, setDuration] = useState('5s');
  const [aspectRatio, setAspectRatio] = useState('Keep Original');
  const [motionStrength, setMotionStrength] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleImageUpload = (file) => {
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      toast.error('Please upload an image to animate');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Image animation started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt: motionPrompt || motionPreset, type: 'video' }]);
        toast.success('Demo: Image animated!');
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
          <LeftPanel title="MOTION PRESETS">
            {MOTION_PRESETS.map(p => (
              <button key={p} onClick={() => setMotionPreset(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: motionPreset === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: motionPreset === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (motionPreset !== p) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (motionPreset !== p) e.currentTarget.style.background = 'none'; }}
              >
                {p}
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
                IMAGE TO VIDEO
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                Animate any still image into a smooth, cinematic video
              </p>
              {imagePreview ? (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', width: '100%' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 240, objectFit: 'contain', background: '#000' }} />
                  <button onClick={() => handleImageUpload(null)}
                    style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ×
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 40, borderRadius: 12, border: '2px dashed var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-card)', width: '100%' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={28} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Upload image to animate</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Image to Video">
            <PromptInput value={motionPrompt} onChange={e => setMotionPrompt(e.target.value)} placeholder="Describe how the image should move..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 80 }}>
                <StudioDropdown value={duration} onChange={setDuration} options={DURATION_OPTIONS} />
              </div>
              <div style={{ minWidth: 100 }}>
                <StudioDropdown value={aspectRatio} onChange={setAspectRatio} options={ASPECT_OPTIONS} />
              </div>
              <div style={{ minWidth: 80 }}>
                <StudioDropdown value={motionStrength} onChange={setMotionStrength} options={STRENGTH_OPTIONS} />
              </div>
              <GenerateButton onClick={handleGenerate}>
                {loading ? 'Animating...' : 'GENERATE'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}

