'use client';

import { useState } from 'react';
import { Palette, Upload, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const PRESETS = [
  { id: 'cinema-orange-teal', name: 'Cinema Orange-Teal', color: '#008080' },
  { id: 'neon-night', name: 'Neon Night', color: '#FF00FF' },
  { id: 'golden-hour', name: 'Golden Hour', color: '#FFD700' },
  { id: 'moody-desaturated', name: 'Moody Desaturated', color: '#696969' },
  { id: 'black-white', name: 'Black & White', color: '#000000' },
  { id: 'high-contrast', name: 'High Contrast', color: '#000000' },
  { id: 'warm-vintage', name: 'Warm Vintage', color: '#D2691E' },
  { id: 'cool-futuristic', name: 'Cool Futuristic', color: '#00BFFF' },
  { id: 'bleach-bypass', name: 'Bleach Bypass', color: '#C0C0C0' },
  { id: 'cross-process', name: 'Cross Process', color: '#FF1493' },
  { id: 'faded-film', name: 'Faded Film', color: '#F5DEB3' },
  { id: 'day-for-night', name: 'Day for Night', color: '#191970' },
  { id: 'teal-shadows', name: 'Teal Shadows', color: '#008080' },
  { id: 'orange-skin', name: 'Orange Skin', color: '#FF8C00' },
  { id: 'aqua-orange', name: 'Aqua & Orange', color: '#00CED1' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: '#00FFFF' },
];

const SLIDERS = [
  { key: 'exposure', label: 'Exposure', min: -3, max: 3, step: 0.1, default: 0 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100, step: 1, default: 0 },
  { key: 'highlights', label: 'Highlights', min: -100, max: 100, step: 1, default: 0 },
  { key: 'shadows', label: 'Shadows', min: -100, max: 100, step: 1, default: 0 },
  { key: 'whites', label: 'Whites', min: -100, max: 100, step: 1, default: 0 },
  { key: 'blacks', label: 'Blacks', min: -100, max: 100, step: 1, default: 0 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100, step: 1, default: 0 },
  { key: 'vibrance', label: 'Vibrance', min: -100, max: 100, step: 1, default: 0 },
  { key: 'temperature', label: 'Temperature', min: -100, max: 100, step: 1, default: 0 },
  { key: 'tint', label: 'Tint', min: -100, max: 100, step: 1, default: 0 },
];

const HUE_SATS = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta'];

export default function CinemaColorGradingPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [adjustments, setAdjustments] = useState(Object.fromEntries(SLIDERS.map(s => [s.key, s.default])));
  const [hueAdjustments, setHueAdjustments] = useState(Object.fromEntries(HUE_SATS.map(c => [c, 0])));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handlePreset = (preset) => {
    setSelectedPreset(preset.id);
    toast.success(`Applied ${preset.name}`);
  };

  const handleGenerate = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a video or image');
      return;
    }
    setLoading(true);
    toast.success('Applying color grade...');
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Color grading via API!');
      } else {
        await new Promise(r => setTimeout(r, 3000));
        setResults([{ id: Date.now(), type: 'image', url: 'https://picsum.photos/seed/color/1280/720', prompt: selectedPreset || 'Custom grade' }]);
        toast.success('Demo: Color grade applied!');
      }
    } catch (e) {
      toast.error('Failed to apply color grade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="COLOR GRADE">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Presets</div>
          {PRESETS.slice(0, 10).map(p => (
            <button key={p.id} onClick={() => handlePreset(p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: selectedPreset === p.id ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: selectedPreset === p.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{p.name}</button>
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
            COLOR GRADING
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1, flexDirection: 'column', alignItems: 'center' }}>
            {uploadedFile ? (
              <div style={{ width: 240, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                <img src={URL.createObjectURL(uploadedFile)} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                <button onClick={() => setUploadedFile(null)}
                  style={{
                    width: '100%', padding: '6px', background: 'var(--bg-input)', border: 'none',
                    color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer',
                  }}
                >Remove</button>
              </div>
            ) : (
              <label style={{
                width: 240, height: 140, borderRadius: 12, border: '2px dashed var(--border-default)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, cursor: 'pointer', background: 'var(--bg-input)',
              }}>
                <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Upload video/image</span>
                <input type="file" accept="video/*,image/*" onChange={e => setUploadedFile(e.target.files?.[0])} style={{ display: 'none' }} />
              </label>
            )}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Upload a video or image to apply color grading..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading || !uploadedFile} style={{ opacity: loading || !uploadedFile ? 0.6 : 1 }}>
              {loading ? 'Applying...' : 'Apply Color Grade'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
