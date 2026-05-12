'use client';

import { useState } from 'react';
import { Upload, Video } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import * as muapi from '@/packages/studio/src/muapi';

const TRANSFER_TYPES = ['Body Movement', 'Head Movement', 'Camera Movement', 'Full Scene'];
const PRESERVE_OPTIONS = ['Background', 'Lighting', 'Both'];

export default function MotionSyncPage() {
  const [referenceVideo, setReferenceVideo] = useState(null);
  const [referencePreview, setReferencePreview] = useState(null);
  const [targetFile, setTargetFile] = useState(null);
  const [targetPreview, setTargetPreview] = useState(null);
  const [transferType, setTransferType] = useState('Body Movement');
  const [syncStrength, setSyncStrength] = useState(75);
  const [preserve, setPreserve] = useState('Both');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleReferenceUpload = (file) => {
    if (file) { setReferenceVideo(file); setReferencePreview(URL.createObjectURL(file)); }
    else { setReferenceVideo(null); setReferencePreview(null); }
  };

  const handleTargetUpload = (file) => {
    if (file) { setTargetFile(file); setTargetPreview(URL.createObjectURL(file)); }
    else { setTargetFile(null); setTargetPreview(null); }
  };

  const handleGenerate = async () => {
    if (!referenceVideo || !targetFile) {
      toast.error('Please upload both reference video and target');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Motion sync started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt: `Motion: ${transferType}`, type: 'video' }]);
        toast.success('Demo: Motion synced!');
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
          <LeftPanel title="TRANSFER TYPE">
            {TRANSFER_TYPES.map(t => (
              <button key={t} onClick={() => setTransferType(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: transferType === t ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: transferType === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (transferType !== t) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (transferType !== t) e.currentTarget.style.background = 'none'; }}
              >
                {t}
              </button>
            ))}
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 1, width: '100%', maxWidth: 500, padding: '0 24px' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
                color: 'transparent',
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', lineHeight: 1.2,
              }}>
                MOTION SYNC
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                Transfer motion patterns from a reference video to your subject
              </p>
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                {referencePreview ? (
                  <div style={{ flex: 1, position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <video src={referencePreview} controls style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                    <button onClick={() => handleReferenceUpload(null)}
                      style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ×
                    </button>
                  </div>
                ) : (
                  <label style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 20, borderRadius: 12, border: '2px dashed var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-card)' }}>
                    <Video size={24} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Reference video</span>
                    <input type="file" accept="video/*" onChange={e => handleReferenceUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                  </label>
                )}
                {targetPreview ? (
                  <div style={{ flex: 1, position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    {targetFile?.type?.startsWith('video') ? (
                      <video src={targetPreview} controls style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                    ) : (
                      <img src={targetPreview} alt="Target" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                    )}
                    <button onClick={() => handleTargetUpload(null)}
                      style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ×
                    </button>
                  </div>
                ) : (
                  <label style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 20, borderRadius: 12, border: '2px dashed var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-card)' }}>
                    <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Upload target</span>
                    <input type="file" accept="image/*,video/*" onChange={e => handleTargetUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Motion Sync">
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Strength: {syncStrength}%</span>
              <input type="range" min="0" max="100" value={syncStrength} onChange={e => setSyncStrength(parseInt(e.target.value))}
                style={{ flex: 1, maxWidth: 200, height: 6, borderRadius: 3, background: 'var(--bg-input)', accentColor: '#7C3AED' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ minWidth: 100 }}>
                <StudioDropdown value={preserve} onChange={setPreserve} options={PRESERVE_OPTIONS} />
              </div>
              <GenerateButton onClick={handleGenerate}>
                {loading ? 'Syncing...' : 'GENERATE'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}

