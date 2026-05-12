'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const LEVELS = ['Light', 'Medium', 'Strong'];

export default function SkinPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [level, setLevel] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = (file) => { setImage(file); setPreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!image) return;
    setLoading(true);
    setTimeout(() => { setResult('https://picsum.photos/seed/skinresult/600/400'); setLoading(false); }, 3000);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="ENHANCEMENT LEVEL">
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: level === l ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: level === l ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{l}</button>
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
              SKIN ENHANCER
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <label style={{
                width: 300, height: 180, borderRadius: 16,
                border: '2px dashed var(--border-default)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', background: 'var(--bg-card)',
              }}>
                {preview ? (
                  <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />
                ) : (
                  <><Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} /><span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Upload Portrait</span></>
                )}
                <input type="file" accept="image/*" onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} style={{ display: 'none' }} />
              </label>
              {result && <img src={result} alt="" style={{ maxWidth: 400, borderRadius: 12, border: '1px solid var(--border-subtle)' }} />}
              {loading && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Enhancing skin...</div>}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={level} onChange={() => {}} placeholder="Level: " />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={generate} disabled={!image || loading}>Enhance Skin</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
