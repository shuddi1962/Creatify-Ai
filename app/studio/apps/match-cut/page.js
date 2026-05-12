'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

export default function MatchCutPage() {
  const [clip1, setClip1] = useState(null);
  const [clip1Preview, setClip1Preview] = useState(null);
  const [clip2, setClip2] = useState(null);
  const [clip2Preview, setClip2Preview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClip1 = (file) => { setClip1(file); setClip1Preview(URL.createObjectURL(file)); };
  const handleClip2 = (file) => { setClip2(file); setClip2Preview(URL.createObjectURL(file)); };

  const generate = () => {
    if (!clip1 || !clip2) return;
    setLoading(true);
    setTimeout(() => { setResult('https://www.w3schools.com/html/mov_bbb.mp4'); setLoading(false); }, 3500);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="MATCH CUT">
          <div style={{ padding: 8, color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6 }}>
            Upload two video clips to create a seamless match cut transition between them.
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
              MATCH CUT
            </h1>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'First Clip', preview: clip1Preview, handler: handleClip1 },
                { label: 'Second Clip', preview: clip2Preview, handler: handleClip2 },
              ].map((item, idx) => (
                <label key={idx} style={{
                  width: 240, height: 160, borderRadius: 16,
                  border: '2px dashed var(--border-default)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', background: 'var(--bg-card)',
                }}>
                  {item.preview ? (
                    <img src={item.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />
                  ) : (
                    <><Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} /><span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{item.label}</span></>
                  )}
                  <input type="file" accept="video/*" onChange={e => e.target.files[0] && item.handler(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              ))}
            </div>
            {result && (
              <video src={result} controls style={{ maxWidth: 500, width: '100%', borderRadius: 12, marginTop: 24 }} />
            )}
            {loading && <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 16 }}>Creating match cut...</div>}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={generate} disabled={!clip1 || !clip2 || loading}>Create Match Cut</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
