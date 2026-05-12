'use client';

import { useState } from 'react';
import { Video, Image } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import * as muapi from '@/packages/studio/src/muapi';

const ASPECT_PRESETS = [
  { id: '16:9', label: '16:9', desc: 'Landscape' },
  { id: '9:16', label: '9:16', desc: 'Portrait' },
  { id: '1:1', label: '1:1', desc: 'Square' },
  { id: '4:3', label: '4:3', desc: 'Standard' },
  { id: '2.35:1', label: '2.35:1', desc: 'Cinematic' },
];
const MODELS = ['seedance-2', 'kling', 'veo-2', 'runway-gen3'];
const DURATIONS = ['3s', '5s', '8s', '10s', '15s'];
const QUALITIES = [
  { label: '480p', desc: 'Fast — previews' },
  { label: '720p', desc: 'HD — recommended' },
  { label: '1080p', desc: 'Full HD' },
  { label: '4K', desc: 'Ultra HD' },
];
const MOTION_INTENSITIES = [
  { label: 'Low', desc: 'Subtle' },
  { label: 'Medium', desc: 'Natural' },
  { label: 'High', desc: 'Dynamic' },
  { label: 'Extreme', desc: 'Maximum' },
];
const CAMERA_MOVEMENTS = [
  'Static', 'Zoom In', 'Zoom Out', 'Pan Left', 'Pan Right', 'Orbit', 'Handheld',
];

export default function TextToVideoPage() {
  const [inputMode, setInputMode] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [model, setModel] = useState('seedance-2');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState('5s');
  const [quality, setQuality] = useState('720p');
  const [motionIntensity, setMotionIntensity] = useState('Medium');
  const [cameraMovement, setCameraMovement] = useState('Static');
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
    if (!prompt.trim() && !imageFile) {
      toast.error('Please enter a prompt or upload an image');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        const params = {
          model, prompt: prompt || 'Animate this image',
          aspect_ratio: aspectRatio, duration: parseInt(duration),
          quality: quality.toLowerCase(),
        };
        if (inputMode === 'image' && imageFile) {
          const uploaded = await muapi.uploadFile(imageFile);
          params.image_url = uploaded;
          const response = await muapi.generateI2V(apiKey, params);
          setResults([{ id: `result-${Date.now()}`, url: response.url, prompt, type: 'video' }]);
        } else {
          const response = await muapi.generateVideo(apiKey, params);
          setResults([{ id: `result-${Date.now()}`, url: response.url, prompt, type: 'video' }]);
        }
        toast.success('Video generated successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt, type: 'video' }]);
        toast.success('Demo: Video generated!');
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
          <LeftPanel title="ASPECT RATIO">
            {ASPECT_PRESETS.map(p => (
              <button key={p.id} onClick={() => setAspectRatio(p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: aspectRatio === p.id ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: aspectRatio === p.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (aspectRatio !== p.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (aspectRatio !== p.id) e.currentTarget.style.background = 'none'; }}
              >
                <span style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.desc}</span>
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '12px 0' }} />
            {QUALITIES.map(q => (
              <button key={q.label} onClick={() => setQuality(q.label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: quality === q.label ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: quality === q.label ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (quality !== q.label) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (quality !== q.label) e.currentTarget.style.background = 'none'; }}
              >
                <span style={{ fontWeight: 600, fontSize: 13 }}>{q.label}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>{q.desc}</span>
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
                TEXT TO VIDEO
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                Generate high-quality video clips from any text prompt
              </p>
              {inputMode === 'image' && (
                <div style={{ width: '100%' }}>
                  {imagePreview ? (
                    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'contain', background: '#000' }} />
                      <button onClick={() => handleImageUpload(null)}
                        style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ×
                      </button>
                    </div>
                  ) : (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 24, borderRadius: 12, border: '2px dashed var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-card)' }}>
                      <Image size={32} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Upload image to animate</span>
                      <input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Text to Video">
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => setInputMode('text')}
                style={{
                  padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                  background: inputMode === 'text' ? 'var(--accent-bg)' : 'var(--bg-input)',
                  border: inputMode === 'text' ? '1px solid var(--accent-border)' : '1px solid var(--border-default)',
                  color: inputMode === 'text' ? 'var(--accent-text)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}>
                Text
              </button>
              <button onClick={() => setInputMode('image')}
                style={{
                  padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                  background: inputMode === 'image' ? 'var(--accent-bg)' : 'var(--bg-input)',
                  border: inputMode === 'image' ? '1px solid var(--accent-border)' : '1px solid var(--border-default)',
                  color: inputMode === 'image' ? 'var(--accent-text)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}>
                Image+Text
              </button>
            </div>
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the video you want to create..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 100 }}>
                <StudioDropdown value={model} onChange={setModel} options={MODELS} />
              </div>
              <div style={{ minWidth: 80 }}>
                <StudioDropdown value={duration} onChange={setDuration} options={DURATIONS} />
              </div>
              <div style={{ minWidth: 100 }}>
                <StudioDropdown value={cameraMovement} onChange={setCameraMovement} options={CAMERA_MOVEMENTS} />
              </div>
              <GenerateButton onClick={handleGenerate}>
                {loading ? 'Generating...' : `GENERATE`}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}

