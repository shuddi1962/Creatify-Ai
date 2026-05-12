'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const STYLES = ['Cutout', 'Cartoon', 'Neon', '3D', 'Sketch'];

export default function StickersPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [style, setStyle] = useState('Cutout');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleUpload = (file) => { setImage(file); setPreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!image) return;
    setLoading(true);
    setTimeout(() => {
      setResults(Array.from({ length: 4 }, (_, i) => `https://picsum.photos/seed/stick${i}/200/200`));
      setLoading(false);
    }, 3000);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="STICKER STYLES">
          {STYLES.map(s => (
            <button key={s} onClick={() => setStyle(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: style === s ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: style === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{s}</button>
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
              STICKER GENERATOR
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <label style={{
                width: 260, height: 180, borderRadius: 16,
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, maxWidth: 500 }}>
                  {results.map((url, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 4 }}>
                      <img src={url} style={{ width: '100%', aspectRatio: '1', borderRadius: 10, objectFit: 'cover' }} alt="" />
                    </div>
                  ))}
                </div>
              )}
              {loading && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Generating stickers...</div>}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={generate} disabled={!image || loading}>Generate Stickers</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
