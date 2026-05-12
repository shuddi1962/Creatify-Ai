'use client';

import { useState } from 'react';
import { Video, Image, User } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const METHOD_TABS = ['Upload New Character', 'Describe Character', 'Use Saved Character'];
const DETECTION_OPTIONS = [{ label: 'Auto-detect', desc: 'AI finds characters automatically' }, { label: 'Manual selection', desc: 'Select characters yourself' }];

export default function ReplaceCharacterPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [method, setMethod] = useState('Upload New Character');
  const [characterFile, setCharacterFile] = useState(null);
  const [characterPreview, setCharacterPreview] = useState(null);
  const [characterDescription, setCharacterDescription] = useState('');
  const [detection, setDetection] = useState('Auto-detect');
  const [preserveClothing, setPreserveClothing] = useState(true);
  const [preserveExpression, setPreserveExpression] = useState(true);
  const [preservePose, setPreservePose] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); }
    else { setVideoFile(null); setVideoPreview(null); }
  };

  const handleCharacterUpload = (file) => {
    if (file) { setCharacterFile(file); setCharacterPreview(URL.createObjectURL(file)); }
    else { setCharacterFile(null); setCharacterPreview(null); }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a source video');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Character replacement started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt: 'Character replaced', type: 'video' }]);
        toast.success('Demo: Character replaced!');
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
          <LeftPanel title="CHARACTER METHOD">
            {METHOD_TABS.map(m => (
              <button key={m} onClick={() => setMethod(m)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: method === m ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: method === m ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (method !== m) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (method !== m) e.currentTarget.style.background = 'none'; }}
              >
                {m === 'Upload New Character' && <Image size={14} />}
                {m === 'Describe Character' && <User size={14} />}
                {m === 'Use Saved Character' && <Video size={14} />}
                {m}
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '12px 0' }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 4px 10px' }}>
              Detection
            </div>
            {DETECTION_OPTIONS.map(d => (
              <button key={d.label} onClick={() => setDetection(d.label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: detection === d.label ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: detection === d.label ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (detection !== d.label) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (detection !== d.label) e.currentTarget.style.background = 'none'; }}
              >
                <span>{d.label}</span>
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
                REPLACE CHARACTER
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                Swap out and replace characters inside any video clip
              </p>
              {videoPreview ? (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', width: '100%' }}>
                  <video src={videoPreview} controls style={{ width: '100%', height: 200, objectFit: 'contain', background: '#000' }} />
                  <button onClick={() => handleVideoUpload(null)}
                    style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ×
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 32, borderRadius: 12, border: '2px dashed var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-card)', width: '100%' }}>
                  <Video size={28} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Upload source video</span>
                  <input type="file" accept="video/*" onChange={e => handleVideoUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              )}
              {method === 'Upload New Character' && (
                characterPreview ? (
                  <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', width: 140 }}>
                    <img src={characterPreview} alt="Character" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                    <button onClick={() => handleCharacterUpload(null)}
                      style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ×
                    </button>
                  </div>
                ) : (
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16, borderRadius: 12, border: '2px dashed var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-card)', width: 140 }}>
                    <Image size={20} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>New character</span>
                    <input type="file" accept="image/*" onChange={e => handleCharacterUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                  </label>
                )
              )}
              {method === 'Describe Character' && (
                <textarea value={characterDescription} onChange={e => setCharacterDescription(e.target.value)}
                  placeholder="Describe the new character (age, gender, appearance, style...)"
                  style={{ width: '100%', padding: 12, borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: 13, resize: 'none', height: 80 }} />
              )}
              {method === 'Use Saved Character' && (
                <select style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: 13 }}>
                  <option>Select a saved character...</option>
                </select>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Replace Character">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setPreserveClothing(!preserveClothing)}
                  style={{ width: 32, height: 18, borderRadius: 100, position: 'relative', background: preserveClothing ? '#7C3AED' : 'var(--bg-input)', border: 'none', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', top: 2, left: preserveClothing ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 150ms' }} />
                </button>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Clothing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setPreserveExpression(!preserveExpression)}
                  style={{ width: 32, height: 18, borderRadius: 100, position: 'relative', background: preserveExpression ? '#7C3AED' : 'var(--bg-input)', border: 'none', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', top: 2, left: preserveExpression ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 150ms' }} />
                </button>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expression</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setPreservePose(!preservePose)}
                  style={{ width: 32, height: 18, borderRadius: 100, position: 'relative', background: preservePose ? '#7C3AED' : 'var(--bg-input)', border: 'none', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', top: 2, left: preservePose ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 150ms' }} />
                </button>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pose</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={handleGenerate}>
                {loading ? 'Replacing...' : 'GENERATE ✦ 12'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
