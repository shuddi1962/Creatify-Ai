'use client';

import { useState } from 'react';
import { Video, Layers } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const BLEND_MODES = ['Overlay', 'Replace Background', 'Add Foreground', 'Full Composite'];
const POSITION_OPTIONS = ['Full Frame', 'Background Only', 'Foreground Only', 'Custom Region'];
const STYLE_OPTIONS = ['Auto', 'Manual style prompt'];

export default function MixedMediaPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [blendMode, setBlendMode] = useState('Overlay');
  const [elementPosition, setElementPosition] = useState('Full Frame');
  const [realFootageOpacity, setRealFootageOpacity] = useState(70);
  const [styleMode, setStyleMode] = useState('Auto');
  const [manualStyle, setManualStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); }
    else { setVideoFile(null); setVideoPreview(null); }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload real footage');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Creating mixed media!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt: aiPrompt, type: 'video' }]);
        toast.success('Demo: Mixed media created!');
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
          <LeftPanel title="BLEND MODE">
            {BLEND_MODES.map(b => (
              <button key={b} onClick={() => setBlendMode(b)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: blendMode === b ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: blendMode === b ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (blendMode !== b) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (blendMode !== b) e.currentTarget.style.background = 'none'; }}
              >
                <Layers size={14} />
                {b}
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '12px 0' }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 4px 10px' }}>
              Position
            </div>
            {POSITION_OPTIONS.map(p => (
              <button key={p} onClick={() => setElementPosition(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: elementPosition === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: elementPosition === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (elementPosition !== p) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (elementPosition !== p) e.currentTarget.style.background = 'none'; }}
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
                MIXED MEDIA
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                Blend real footage with AI-generated visuals seamlessly
              </p>
              {videoPreview ? (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', width: '100%' }}>
                  <video src={videoPreview} controls style={{ width: '100%', height: 240, objectFit: 'contain', background: '#000' }} />
                  <button onClick={() => handleVideoUpload(null)}
                    style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ×
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 40, borderRadius: 12, border: '2px dashed var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-card)', width: '100%' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video size={28} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Upload real footage base video</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={e => handleVideoUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Mixed Media">
            <PromptInput value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Describe the AI-generated elements..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 140 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Opacity: {realFootageOpacity}%</span>
                <input type="range" min="0" max="100" value={realFootageOpacity} onChange={e => setRealFootageOpacity(parseInt(e.target.value))}
                  style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-input)', accentColor: '#7C3AED' }} />
              </div>
              <div style={{ minWidth: 90 }}>
                <StudioDropdown value={styleMode} onChange={setStyleMode} options={STYLE_OPTIONS} />
              </div>
              <GenerateButton onClick={handleGenerate}>
                {loading ? 'Creating...' : 'GENERATE ✦ 10'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
