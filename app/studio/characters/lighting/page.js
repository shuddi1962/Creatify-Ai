'use client';

import { useState } from 'react';
import { Sun, Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import UploadZone from '@/components/studio/UploadZone';

const CATEGORIES = ['Natural Light', 'Studio', 'Cinematic', 'Neon & Artificial', 'Time of Day', 'Weather'];
const PRESETS = [
  { name: 'Golden Hour', category: 'Time of Day', desc: 'Warm sunset lighting', url: 'https://picsum.photos/seed/golden/300/180' },
  { name: 'Blue Hour', category: 'Time of Day', desc: 'Cool twilight tones', url: 'https://picsum.photos/seed/blue/300/180' },
  { name: 'Soft Box', category: 'Studio', desc: 'Even diffused light', url: 'https://picsum.photos/seed/softbox/300/180' },
  { name: 'Rembrandt', category: 'Studio', desc: 'Classic portrait lighting', url: 'https://picsum.photos/seed/rembrandt/300/180' },
  { name: 'Film Noir', category: 'Cinematic', desc: 'High contrast dramatic', url: 'https://picsum.photos/seed/filmnoir/300/180' },
  { name: 'Neon Glow', category: 'Neon & Artificial', desc: 'Vibrant neon colors', url: 'https://picsum.photos/seed/neon/300/180' },
  { name: 'Overcast', category: 'Weather', desc: 'Soft outdoor diffuse', url: 'https://picsum.photos/seed/overcast/300/180' },
  { name: 'Rainy Mood', category: 'Weather', desc: 'Wet reflective surfaces', url: 'https://picsum.photos/seed/rainy/300/180' },
];

export default function LightingPage() {
  const [category, setCategory] = useState('Natural Light');
  const [applyPreset, setApplyPreset] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleUpload = (file) => { setUploadImage(file); setUploadPreview(URL.createObjectURL(file)); };

  const handleApply = (preset) => setApplyPreset(preset);

  const handleGenerate = () => {
    if (!uploadImage) { toast.error('Upload an image first'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Image generated with lighting!'); }, 3000);
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="CATEGORIES">
            {CATEGORIES.map(p => (
              <button key={p} onClick={() => setCategory(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: category === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: category === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >{p}</button>
            ))}
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '40px' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
                color: 'transparent',
                background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                LIGHTING PRESETS
              </h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16, maxWidth: 800, margin: '0 auto' }}>
                {PRESETS.filter(p => p.category === category).map((preset, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                    <img src={preset.url} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} alt="" />
                    <div style={{ padding: 12 }}>
                      <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{preset.name}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 12 }}>{preset.desc}</p>
                      <button onClick={() => handleApply(preset.name)} style={{
                        width: '100%', padding: '8px 12px', background: 'var(--bg-input)',
                        color: '#CCFF00', fontSize: 12, fontWeight: 600, borderRadius: 8,
                        border: 'none', cursor: 'pointer',
                      }}>Apply Preset</button>
                    </div>
                  </div>
                ))}
              </div>

              {applyPreset && (
                <div style={{ maxWidth: 700, margin: '24px auto 0', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>Apply {applyPreset}</h3>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Upload Image</label>
                    <UploadZone onFile={handleUpload} accept="image/*" label="Upload image to apply lighting" preview={uploadPreview} icon={Upload} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Model</label>
                    <select value={model} onChange={e => setModel(e.target.value)} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }}>
                      <option>flux</option><option>flux-pro</option><option>juggernaut</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Controls">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the lighting effect..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {applyPreset && (
                <GenerateButton onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate'}
                </GenerateButton>
              )}
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
