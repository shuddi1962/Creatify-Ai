'use client';

import { useState } from 'react';
import { Image, Mic, Circle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const FACE_DETECTION = ['Auto', 'Manual crop'];
const HEAD_MOVEMENT = ['Static', 'Natural Head Bob', 'Expressive'];
const EYE_BLINK = ['Natural', 'None', 'Intense'];
const OUTPUT_QUALITY = ['720p', '1080p'];

export default function PortraitPage() {
  const [portraitFile, setPortraitFile] = useState(null);
  const [portraitPreview, setPortraitPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [faceDetection, setFaceDetection] = useState('Auto');
  const [headMovement, setHeadMovement] = useState('Natural Head Bob');
  const [eyeBlink, setEyeBlink] = useState('Natural');
  const [outputQuality, setOutputQuality] = useState('1080p');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handlePortraitUpload = (file) => {
    if (file) {
      setPortraitFile(file);
      setPortraitPreview(URL.createObjectURL(file));
    } else {
      setPortraitFile(null);
      setPortraitPreview(null);
    }
  };

  const handleAudioUpload = (file) => {
    if (file) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
    } else {
      setAudioFile(null);
      setAudioPreview(null);
    }
  };

  const handleGenerate = async () => {
    if (!portraitFile || !audioFile) {
      toast.error('Please upload both portrait and audio');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Animating portrait!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: 'Talking portrait',
          type: 'video'
        }]);
        toast.success('Demo: Portrait animated!');
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
        <LeftPanel title="LIP SYNC OPTIONS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Face Detection</div>
          {FACE_DETECTION.map(o => (
            <button key={o} onClick={() => setFaceDetection(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: faceDetection === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: faceDetection === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Head Movement</div>
          {HEAD_MOVEMENT.map(o => (
            <button key={o} onClick={() => setHeadMovement(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: headMovement === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: headMovement === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Eye Blink</div>
          {EYE_BLINK.map(o => (
            <button key={o} onClick={() => setEyeBlink(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: eyeBlink === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: eyeBlink === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Output Quality</div>
          {OUTPUT_QUALITY.map(o => (
            <button key={o} onClick={() => setOutputQuality(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: outputQuality === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: outputQuality === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
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
            LIP SYNC PORTRAIT
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1 }}>
            {portraitPreview ? (
              <div style={{ width: 160, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                <img src={portraitPreview} alt="Portrait" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <button onClick={() => handlePortraitUpload(null)} style={{
                  width: '100%', padding: '6px', background: 'var(--bg-input)', border: 'none',
                  color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer',
                }}>Remove</button>
              </div>
            ) : (
              <label style={{
                width: 160, height: 160, borderRadius: 12, border: '2px dashed var(--border-default)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, cursor: 'pointer', background: 'var(--bg-input)',
              }}>
                <Image size={24} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Portrait</span>
                <input type="file" accept="image/*" onChange={e => handlePortraitUpload(e.target.files?.[0])} style={{ display: 'none' }} />
              </label>
            )}
            {audioFile ? (
              <div style={{
                width: 160, borderRadius: 12, border: '1px solid var(--border-default)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 16, background: 'var(--bg-input)',
              }}>
                <Mic size={24} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>{audioFile.name}</span>
                <button onClick={() => handleAudioUpload(null)} style={{
                  marginTop: 8, padding: '4px 12px', background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)', borderRadius: 6,
                  color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer',
                }}>Remove</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <label style={{
                  width: 120, height: 160, borderRadius: 12, border: '2px dashed var(--border-default)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, cursor: 'pointer', background: 'var(--bg-input)',
                }}>
                  <Mic size={24} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Audio</span>
                  <input type="file" accept="audio/*" onChange={e => handleAudioUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
                <button onClick={() => setIsRecording(!isRecording)} style={{
                  width: 120, height: 160, borderRadius: 12, border: `2px dashed ${isRecording ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, cursor: 'pointer', background: isRecording ? 'rgba(124,58,237,0.1)' : 'var(--bg-input)',
                }}>
                  <Circle size={24} style={{ color: isRecording ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 12, color: isRecording ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{isRecording ? 'Recording...' : 'Record'}</span>
                </button>
              </div>
            )}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Upload portrait and audio to begin..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Animating...' : 'Animate Portrait'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
