'use client';

import { useState } from 'react';
import { FileText, Play, Download, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const OUTPUT_FORMATS = ['SRT', 'VTT', 'ASS', 'TXT', 'JSON'];
const MAX_CHARS = ['32', '42', '56'];
const TIMESTAMP_OPTIONS = ['Word-level', 'Sentence-level', 'Paragraph-level'];

export default function SubtitlesPage() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [outputFormat, setOutputFormat] = useState('SRT');
  const [maxChars, setMaxChars] = useState('42');
  const [speakerId, setSpeakerId] = useState(false);
  const [timestamps, setTimestamps] = useState('Sentence-level');
  const [burnSubtitles, setBurnSubtitles] = useState(false);
  const [fontSize, setFontSize] = useState('24');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [position, setPosition] = useState('Bottom');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [editableText, setEditableText] = useState('');

  const handleFileUpload = (f) => {
    if (f) {
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
    } else {
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      toast.error('Please upload an audio or video file');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Transcribing via API...');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const mockSubtitles = `1\n00:00:01,000 --> 00:00:04,500\nThis is the first line of your subtitles.\n\n2\n00:00:05,000 --> 00:00:08,200\nHere's another line of text.\n\n3\n00:00:09,000 --> 00:00:12,500\nAnd this is the third subtitle line.`;
        setEditableText(mockSubtitles);
        setResults([{ id: `demo-${Date.now()}`, format: outputFormat, text: mockSubtitles, url: '#' }]);
        toast.success('Demo: Subtitles generated!');
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
        <LeftPanel title="SUBTITLE OPTIONS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Output Format</div>
          {OUTPUT_FORMATS.map(o => (
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
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Max Chars</div>
          {MAX_CHARS.map(o => (
            <button key={o} onClick={() => setMaxChars(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: maxChars === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: maxChars === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Timestamps</div>
          {TIMESTAMP_OPTIONS.map(o => (
            <button key={o} onClick={() => setTimestamps(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: timestamps === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: timestamps === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <button onClick={() => setSpeakerId(!speakerId)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px', marginTop: 8,
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Speaker ID {speakerId ? 'ON' : 'OFF'}</button>
          <button onClick={() => setBurnSubtitles(!burnSubtitles)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Burn into video {burnSubtitles ? 'ON' : 'OFF'}</button>
          {burnSubtitles && (
            <div style={{ padding: '8px 12px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Font Size</div>
              <select value={fontSize} onChange={e => setFontSize(e.target.value)}
                style={{
                  width: '100%', padding: '4px 8px', borderRadius: 6, marginBottom: 8,
                  background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)', fontSize: 12,
                }}>
                {['18', '24', '32', '48'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)}
                style={{ width: '100%', height: 30, borderRadius: 6, background: 'var(--bg-input)', border: '1px solid var(--border-default)', marginBottom: 8 }} />
              <select value={position} onChange={e => setPosition(e.target.value)}
                style={{
                  width: '100%', padding: '4px 8px', borderRadius: 6,
                  background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)', fontSize: 12,
                }}>
                {['Top', 'Bottom', 'Center'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
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
            AUDIO TO SUBTITLES
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1 }}>
            {filePreview ? (
              <div style={{ width: 240, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                <video src={filePreview} controls style={{ width: '100%', height: 140, objectFit: 'contain' }} />
                <button onClick={() => handleFileUpload(null)}
                  style={{
                    width: '100%', padding: '6px', background: 'var(--bg-input)', border: 'none',
                    color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer',
                  }}
                >Remove</button>
              </div>
            ) : (
              <label style={{
                width: 240, height: 140, borderRadius: 12, border: '2px dashed var(--border-default)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, cursor: 'pointer', background: 'var(--bg-input)',
              }}>
                <FileText size={28} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Upload audio/video</span>
                <input type="file" accept="audio/*,video/*" onChange={e => handleFileUpload(e.target.files?.[0])} style={{ display: 'none' }} />
              </label>
            )}
            {editableText && (
              <div style={{ width: 280 }}>
                <textarea value={editableText} onChange={e => setEditableText(e.target.value)}
                  style={{
                    width: '100%', height: 160, borderRadius: 12, border: '1px solid var(--border-default)',
                    background: 'var(--bg-input)', color: 'var(--text-primary)',
                    padding: 10, fontSize: 12, fontFamily: 'monospace', resize: 'none',
                  }}
                />
              </div>
            )}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Upload audio or video to transcribe..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Transcribing...' : 'Generate Subtitles'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
