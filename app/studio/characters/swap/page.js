'use client';

import { useState } from 'react';
import { UserCog, Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';

const SAMPLE_CHARACTERS = [
  { id: 1, name: 'Sarah', avatar: 'https://picsum.photos/seed/s1/100' },
  { id: 2, name: 'The Explorer', avatar: 'https://picsum.photos/seed/s2/100' },
  { id: 3, name: 'Mia', avatar: 'https://picsum.photos/seed/s3/100' },
];
const DETECTION_MODES = ['Auto', 'Manual'];
const TABS = ['My Characters', 'Upload New', 'Describe'];
const OPTIONS = [...DETECTION_MODES, ...TABS];

export default function SwapPage() {
  const [tab, setTab] = useState('My Characters');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [replacementImage, setReplacementImage] = useState(null);
  const [replacementPreview, setReplacementPreview] = useState(null);
  const [selectedChar, setSelectedChar] = useState(null);
  const [detection, setDetection] = useState('Auto');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVideoUpload = (file) => {
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleReplacementUpload = (file) => {
    setReplacementImage(file);
    setReplacementPreview(URL.createObjectURL(file));
  };

  const handleSwap = () => {
    if (!videoFile) { toast.error('Upload a video first'); return; }
    if (tab === 'My Characters' && !selectedChar) { toast.error('Select a replacement character'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Character swapped!'); }, 3500);
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="OPTIONS">
            {OPTIONS.map(p => (
              <button key={p} onClick={() => {
                if (DETECTION_MODES.includes(p)) setDetection(p);
                else setTab(p);
              }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: detection === p || tab === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: detection === p || tab === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >{p}</button>
            ))}
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
                color: 'transparent',
                background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                CHARACTER SWAP
              </h1>
              <div style={{ width: '100%', maxWidth: 700 }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                  <div style={{ marginBottom: 20 }}>
                    <SectionLabel>Upload Video with Character to Replace</SectionLabel>
                    <UploadZone onFile={handleVideoUpload} accept="video/*" label="Upload video" preview={videoPreview} icon={Upload} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <SectionLabel>Replacement</SectionLabel>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                      {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                          padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                          background: tab === t ? '#7C3AED' : 'var(--bg-input)',
                          color: tab === t ? 'white' : 'var(--text-secondary)',
                          border: tab === t ? 'none' : '1px solid var(--border-default)',
                          cursor: 'pointer',
                        }}>{t}</button>
                      ))}
                    </div>
                    {tab === 'My Characters' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {SAMPLE_CHARACTERS.map(c => (
                          <div key={c.id} onClick={() => setSelectedChar(c.id)} style={{
                            padding: 12, borderRadius: 12, border: `1px solid ${selectedChar === c.id ? '#CCFF00' : 'var(--border-default)'}`,
                            background: selectedChar === c.id ? 'rgba(204,255,0,0.1)' : '#0a0a0a', cursor: 'pointer', transition: 'all 150ms',
                          }}>
                            <img src={c.avatar} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} alt="" />
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {tab === 'Upload New' && (
                      <UploadZone onFile={handleReplacementUpload} accept="image/*" label="Upload replacement face" preview={replacementPreview} icon={Upload} />
                    )}
                    {tab === 'Describe' && (
                      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the character you want to use..." style={{ width: '100%', height: 96, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16, color: 'var(--text-primary)', resize: 'none', outline: 'none' }} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Controls">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the swap..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={handleSwap} disabled={loading}>
                {loading ? 'Swapping...' : 'Swap Character'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
