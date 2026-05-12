'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const EFFECTS = ['Glitch', 'Chromatic', 'VHS', 'Blur', 'Pixelate', 'Neon'];

export default function EffectsPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [effect, setEffect] = useState('Glitch');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = (file) => { setImage(file); setPreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!image) return;
    setLoading(true);
    setTimeout(() => { setResult('https://picsum.photos/seed/effectresult/600/400'); setLoading(false); }, 3000);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="EFFECTS">
          {EFFECTS.map(e => (
            <button key={e} onClick={() => setEffect(e)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: effect === e ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: effect === e ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{e}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, textAlign: 'center', padding: 24, width: '100%' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 24,
            }}>
              EFFECTS PACK
            </h1>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            }}>
              <label style={{
                width: 300, height: 180, borderRadius: 16,
                border: '2px dashed var(--border-default)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', background: 'var(--bg-card)',
              }}>
                {preview ? (
                  <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />
                ) : (
                  <><Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} /><span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Upload Image</span></>
                )}
                <input type="file" accept="image/*" onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} style={{ display: 'none' }} />
              </label>
              {result && <img src={result} alt="" style={{ maxWidth: 400, borderRadius: 12, border: '1px solid var(--border-subtle)' }} />}
              {loading && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Processing...</div>}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={effect} onChange={() => {}} placeholder="Effect: " />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={generate} disabled={!image || loading}>Apply Effect</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
