'use client';

import { useState } from 'react';
import { User, Upload } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

export default function FaceSwapPage() {
  const [sourceImg, setSourceImg] = useState(null);
  const [sourcePreview, setSourcePreview] = useState(null);
  const [targetImg, setTargetImg] = useState(null);
  const [targetPreview, setTargetPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSource = (file) => { setSourceImg(file); setSourcePreview(URL.createObjectURL(file)); };
  const handleTarget = (file) => { setTargetImg(file); setTargetPreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!sourceImg || !targetImg) return;
    setLoading(true);
    setTimeout(() => { setResult('https://picsum.photos/seed/faceresult/600/400'); setLoading(false); }, 3500);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="FACE SWAP">
          <div style={{ padding: 8, color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6 }}>
            Upload a source face and a target image. The face from the source will be swapped onto the target.
          </div>
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
              FACE SWAP
            </h1>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Source Face', preview: sourcePreview, handler: handleSource, icon: User },
                { label: 'Target Image', preview: targetPreview, handler: handleTarget, icon: Upload },
              ].map((item, idx) => (
                <label key={idx} style={{
                  width: 240, height: 180, borderRadius: 16,
                  border: '2px dashed var(--border-default)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', background: 'var(--bg-card)',
                }}>
                  {item.preview ? (
                    <img src={item.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />
                  ) : (
                    <><item.icon size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} /><span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{item.label}</span></>
                  )}
                  <input type="file" accept="image/*" onChange={e => e.target.files[0] && item.handler(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              ))}
            </div>
            {result && (
              <div style={{ marginTop: 24, maxWidth: 400, margin: '24px auto 0' }}>
                <img src={result} alt="" style={{ width: '100%', borderRadius: 12, border: '1px solid var(--border-subtle)' }} />
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button onClick={() => {}}
                    style={{
                      flex: 1, padding: '10px 24px', background: 'var(--bg-card)',
                      border: '1px solid var(--border-default)', borderRadius: 10,
                      color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer',
                    }}
                  >Download</button>
                  <button onClick={() => {}}
                    style={{
                      flex: 1, padding: '10px 24px', background: '#CCFF00',
                      border: 'none', borderRadius: 10, color: '#000', fontWeight: 700,
                      fontSize: 13, cursor: 'pointer',
                    }}
                  >Share</button>
                </div>
              </div>
            )}
            {loading && <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 16 }}>Swapping face...</div>}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={generate} disabled={!sourceImg || !targetImg || loading}>Swap Face</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
