'use client';

import { useState } from 'react';
import { Video, Mic, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const SYNC_MODES = ['Replace Audio + Sync Lips', 'Add New Voice', 'Translate & Sync'];
const FACE_REGIONS = ['Auto-detect', 'Manual selection'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean'];

export default function VideoLipSyncPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [ttsText, setTtsText] = useState('');
  const [inputMode, setInputMode] = useState('audio');
  const [syncMode, setSyncMode] = useState('Replace Audio + Sync Lips');
  const [language, setLanguage] = useState('English');
  const [faceRegion, setFaceRegion] = useState('Auto-detect');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      setVideoFile(null);
      setVideoPreview(null);
    }
  };

  const handleAudioUpload = (file) => {
    if (file) {
      setAudioFile(file);
    } else {
      setAudioFile(null);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video');
      return;
    }
    if (inputMode === 'audio' && !audioFile && !ttsText) {
      toast.error('Please upload audio or enter text');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Syncing lips!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: syncMode,
          type: 'video'
        }]);
        toast.success('Demo: Lips synced!');
      }
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="SYNC OPTIONS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Sync Mode</div>
          {SYNC_MODES.map(o => (
            <button key={o} onClick={() => setSyncMode(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: syncMode === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: syncMode === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Face Region</div>
          {FACE_REGIONS.map(o => (
            <button key={o} onClick={() => setFaceRegion(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: faceRegion === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: faceRegion === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          {syncMode === 'Translate & Sync' && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Language</div>
              {LANGUAGES.map(o => (
                <button key={o} onClick={() => setLanguage(o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 12px',
                    background: language === o ? 'var(--accent-bg)' : 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 8,
                    color: language === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                  }}
                >{o}</button>
              ))}
            </>
          )}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
            color: 'transparent',
            background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            VIDEO LIP SYNC
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1 }}>
            {videoPreview ? (
              <div style={{ width: 240, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                <video src={videoPreview} controls style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <button onClick={() => handleVideoUpload(null)} style={{
                  width: '100%', padding: '6px', background: 'var(--bg-input)', border: 'none',
                  color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer',
                }}>Remove</button>
              </div>
            ) : (
              <label style={{
                width: 240, height: 160, borderRadius: 12, border: '2px dashed var(--border-default)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, cursor: 'pointer', background: 'var(--bg-input)',
              }}>
                <Video size={24} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Upload video</span>
                <input type="file" accept="video/*" onChange={e => handleVideoUpload(e.target.files?.[0])} style={{ display: 'none' }} />
              </label>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setInputMode('audio')} style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: inputMode === 'audio' ? 'var(--accent-bg)' : 'var(--bg-input)',
                  border: '1px solid var(--border-default)', cursor: 'pointer',
                  color: inputMode === 'audio' ? 'var(--accent-text)' : 'var(--text-secondary)',
                }}>Audio File</button>
                <button onClick={() => setInputMode('tts')} style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: inputMode === 'tts' ? 'var(--accent-bg)' : 'var(--bg-input)',
                  border: '1px solid var(--border-default)', cursor: 'pointer',
                  color: inputMode === 'tts' ? 'var(--accent-text)' : 'var(--text-secondary)',
                }}>TTS Text</button>
              </div>
              {inputMode === 'audio' ? (
                <label style={{
                  width: 160, height: 120, borderRadius: 12, border: '2px dashed var(--border-default)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 6, cursor: 'pointer', background: 'var(--bg-input)',
                }}>
                  <Mic size={20} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Upload audio</span>
                  <input type="file" accept="audio/*" onChange={e => handleAudioUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              ) : (
                <textarea value={ttsText} onChange={e => setTtsText(e.target.value)}
                  placeholder="Enter text to convert..."
                  style={{
                    width: 160, height: 120, borderRadius: 12, border: '1px solid var(--border-default)',
                    background: 'var(--bg-input)', color: 'var(--text-primary)',
                    padding: 8, fontSize: 12, resize: 'none',
                  }}
                />
              )}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Upload video and audio to sync lips..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Syncing...' : 'Sync Lips'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
