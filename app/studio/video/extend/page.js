'use client';

import { useState } from 'react';
import { Video } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const EXTENSION_OPTIONS = ['+2s', '+4s', '+6s', '+8s', 'Custom'];
const DIRECTION_OPTIONS = ['Extend End', 'Extend Beginning', 'Both'];

export default function ExtendVideoPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [duration, setDuration] = useState(null);
  const [extensionAmount, setExtensionAmount] = useState('+4s');
  const [customDuration, setCustomDuration] = useState(5);
  const [direction, setDirection] = useState('Extend End');
  const [extensionPrompt, setExtensionPrompt] = useState('');
  const [loopMode, setLoopMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); setDuration('5s'); }
    else { setVideoFile(null); setVideoPreview(null); setDuration(null); }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video to extend');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Video extension started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt: `Extended by ${extensionAmount}`, type: 'video' }]);
        toast.success('Demo: Video extended!');
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
          <LeftPanel title="EXTENSION">
            {EXTENSION_OPTIONS.map(ext => (
              <button key={ext} onClick={() => setExtensionAmount(ext)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: extensionAmount === ext ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: extensionAmount === ext ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (extensionAmount !== ext) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (extensionAmount !== ext) e.currentTarget.style.background = 'none'; }}
              >
                {ext}
              </button>
            ))}
            {extensionAmount === 'Custom' && (
              <div style={{ padding: '8px 4px' }}>
                <input type="number" value={customDuration} onChange={e => setCustomDuration(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: 8, background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: 13 }} />
              </div>
            )}
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
                EXTEND VIDEO
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                Seamlessly add more seconds to the end of any video
              </p>
              {videoPreview ? (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', width: '100%' }}>
                  <video src={videoPreview} controls style={{ width: '100%', height: 240, objectFit: 'contain', background: '#000' }} />
                  <div style={{ position: 'absolute', top: 8, left: 8, padding: '2px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.6)', fontSize: 11, color: '#fff' }}>{duration}</div>
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
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Upload video to extend</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={e => handleVideoUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Extend Video">
            <PromptInput value={extensionPrompt} onChange={e => setExtensionPrompt(e.target.value)} placeholder="Describe what should happen in the extended section..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ minWidth: 110 }}>
                <StudioDropdown value={direction} onChange={setDirection} options={DIRECTION_OPTIONS} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setLoopMode(!loopMode)}
                  style={{ width: 32, height: 18, borderRadius: 100, position: 'relative', background: loopMode ? 'var(--accent-primary, #7C3AED)' : 'var(--bg-input)', border: 'none', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', top: 2, left: loopMode ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 150ms' }} />
                </button>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Loop</span>
              </div>
              <GenerateButton onClick={handleGenerate}>
                {loading ? 'Extending...' : 'GENERATE'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}

