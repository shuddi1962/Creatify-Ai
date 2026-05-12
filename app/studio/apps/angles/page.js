'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const ANGLES = ['1', '3', '5', '7', '9'];

export default function AnglesPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [angleCount, setAngleCount] = useState('5');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleUpload = (file) => { setImage(file); setPreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!image) return;
    setLoading(true);
    setTimeout(() => {
      const imgs = Array.from({ length: parseInt(angleCount) }, (_, i) => `https://picsum.photos/seed/angle${i}/300/200`);
      setResults(imgs);
      setLoading(false);
    }, 3000);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="ANGLES">
          {ANGLES.map(n => (
            <button key={n} onClick={() => setAngleCount(n)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: angleCount === n ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: angleCount === n ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{n} angles</button>
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
              CAMERA ANGLES
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
                  <><Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} /><span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Upload Image</span></>
                )}
                <input type="file" accept="image/*" onChange={e => e.target.files[0] && handleUpload(e.target.files[0])} style={{ display: 'none' }} />
              </label>
              {results.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, maxWidth: 600 }}>
                  {results.map((url, i) => <img key={i} src={url} alt="" style={{ width: '100%', borderRadius: 10, border: '1px solid var(--border-subtle)' }} />)}
                </div>
              )}
              {loading && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Generating angles...</div>}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={angleCount} onChange={() => {}} placeholder="Angles: " />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={generate} disabled={!image || loading}>Generate Angles</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
