'use client';

import { useState } from 'react';
import { Image, FileAudio, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const NAMING_OPTIONS = ['Sequential', 'Use audio filename', 'Custom prefix'];
const OUTPUT_QUALITY = ['720p', '1080p'];
const OUTPUT_FORMAT = ['MP4', 'MOV', 'WEBM'];

export default function BulkLipSyncPage() {
  const [characterFile, setCharacterFile] = useState(null);
  const [characterPreview, setCharacterPreview] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [namingConvention, setNamingConvention] = useState('Sequential');
  const [customPrefix, setCustomPrefix] = useState('');
  const [outputQuality, setOutputQuality] = useState('1080p');
  const [outputFormat, setOutputFormat] = useState('MP4');
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleCharacterUpload = (file) => {
    if (file) {
      setCharacterFile(file);
      setCharacterPreview(URL.createObjectURL(file));
    } else {
      setCharacterFile(null);
      setCharacterPreview(null);
    }
  };

  const handleAudioUpload = (files) => {
    setAudioFiles(Array.from(files));
  };

  const handleStart = async () => {
    if (!characterFile) {
      toast.error('Please upload a portrait image');
      return;
    }
    if (audioFiles.length === 0) {
      toast.error('Please upload audio files');
      return;
    }
    setLoading(true);
    setStarted(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockResults = audioFiles.map((file, i) => ({
      id: `job-${i}`,
      filename: file.name,
      status: i === 0 ? 'processing' : 'queued',
      progress: i === 0 ? 45 : 0,
    }));
    setResults(mockResults);
    setTimeout(() => {
      setResults(prev => prev.map((r, i) => i === 0 ? { ...r, status: 'completed', progress: 100 } : r));
    }, 2000);
    setLoading(false);
    toast.success(`Started processing ${audioFiles.length} files!`);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="BULK OPTIONS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Naming</div>
          {NAMING_OPTIONS.map(o => (
            <button key={o} onClick={() => setNamingConvention(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: namingConvention === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: namingConvention === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          {namingConvention === 'Custom prefix' && (
            <input value={customPrefix} onChange={e => setCustomPrefix(e.target.value)}
              placeholder="e.g., video_"
              style={{
                width: '100%', marginTop: 8, padding: '6px 10px',
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, color: 'var(--text-primary)', fontSize: 12,
              }}
            />
          )}
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
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Output Format</div>
          {OUTPUT_FORMAT.map(o => (
            <button key={o} onClick={() => setOutputFormat(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: outputFormat === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: outputFormat === o ? 'var(--accent-text)' : 'var(--text-secondary)',
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
            BULK LIP SYNC
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1 }}>
            {characterPreview ? (
              <div style={{ width: 140, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                <img src={characterPreview} alt="Character" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                <button onClick={() => handleCharacterUpload(null)} style={{
                  width: '100%', padding: '6px', background: 'var(--bg-input)', border: 'none',
                  color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer',
                }}>Remove</button>
              </div>
            ) : (
              <label style={{
                width: 140, height: 140, borderRadius: 12, border: '2px dashed var(--border-default)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 6, cursor: 'pointer', background: 'var(--bg-input)',
              }}>
                <Image size={24} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Portrait</span>
                <input type="file" accept="image/*" onChange={e => handleCharacterUpload(e.target.files?.[0])} style={{ display: 'none' }} />
              </label>
            )}
            <label style={{
              width: 200, height: 140, borderRadius: 12, border: '2px dashed var(--border-default)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 6, cursor: 'pointer', background: 'var(--bg-input)',
            }}>
              <FileAudio size={24} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {audioFiles.length > 0 ? `${audioFiles.length} files` : 'Upload audio files'}
              </span>
              <input type="file" accept="audio/*" multiple onChange={e => handleAudioUpload(e.target.files)} style={{ display: 'none' }} />
            </label>
          </div>
          {started && results.length > 0 && (
            <div style={{
              marginTop: 24, width: '60%', maxHeight: 200, overflowY: 'auto',
              background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)',
              padding: 12, zIndex: 1,
            }}>
              {results.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.filename}</span>
                  <span style={{ fontSize: 11, color: r.status === 'completed' ? '#4ade80' : r.status === 'processing' ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{r.status}</span>
                  <div style={{ width: 60, height: 4, background: 'var(--bg-input)', borderRadius: 2 }}>
                    <div style={{ width: `${r.progress}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder={`${audioFiles.length} audio files loaded for batch processing...`} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleStart} disabled={loading || started} style={{ opacity: loading || started ? 0.6 : 1 }}>
              {started ? 'Processing...' : `Start Bulk (${audioFiles.length})`}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
