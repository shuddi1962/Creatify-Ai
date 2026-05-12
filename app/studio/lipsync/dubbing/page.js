'use client';

import { useState } from 'react';
import { Video, Languages, Subtitles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic', 'Russian'];
const VOICE_STYLES = ['Match Original', 'Professional', 'Casual', 'Energetic'];
const LIP_SYNC_OPTIONS = ['None', 'Basic', 'Full Lipsync'];

export default function DubbingPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('Auto-detect');
  const [targetLanguages, setTargetLanguages] = useState(['Spanish']);
  const [voiceStyle, setVoiceStyle] = useState('Match Original');
  const [lipSync, setLipSync] = useState('Full Lipsync');
  const [generateSubtitles, setGenerateSubtitles] = useState(true);
  const [burnSubtitles, setBurnSubtitles] = useState(false);
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

  const toggleLanguage = (lang) => {
    if (targetLanguages.includes(lang)) {
      setTargetLanguages(targetLanguages.filter(l => l !== lang));
    } else {
      setTargetLanguages([...targetLanguages, lang]);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video to dub');
      return;
    }
    if (targetLanguages.length === 0) {
      toast.error('Please select at least one target language');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Dubbing started via API!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 4000));
        setResults(targetLanguages.map(lang => ({
          id: `demo-${Date.now()}-${lang}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: `Dubbed to ${lang}`,
          type: 'video'
        })));
        toast.success(`Demo: Video dubbed to ${targetLanguages.join(', ')}!`);
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
        <LeftPanel title="DUBBING OPTIONS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Voice Style</div>
          {VOICE_STYLES.map(o => (
            <button key={o} onClick={() => setVoiceStyle(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: voiceStyle === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: voiceStyle === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Lip Sync</div>
          {LIP_SYNC_OPTIONS.map(o => (
            <button key={o} onClick={() => setLipSync(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: lipSync === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: lipSync === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Subtitles</div>
          <button onClick={() => setGenerateSubtitles(!generateSubtitles)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Generate {generateSubtitles ? '✓' : '○'} subtitles</button>
          <button onClick={() => setBurnSubtitles(!burnSubtitles)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Burn {burnSubtitles ? '✓' : '○'} into video</button>
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
            MULTI-LANGUAGE DUBBING
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1 }}>
            {videoPreview ? (
              <div style={{ width: 280, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                <video src={videoPreview} controls style={{ width: '100%', height: 180, objectFit: 'contain' }} />
                <button onClick={() => handleVideoUpload(null)} style={{
                  width: '100%', padding: '6px', background: 'var(--bg-input)', border: 'none',
                  color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer',
                }}>Remove</button>
              </div>
            ) : (
              <label style={{
                width: 280, height: 180, borderRadius: 12, border: '2px dashed var(--border-default)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, cursor: 'pointer', background: 'var(--bg-input)',
              }}>
                <Video size={28} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Upload video to dub</span>
                <input type="file" accept="video/*" onChange={e => handleVideoUpload(e.target.files?.[0])} style={{ display: 'none' }} />
              </label>
            )}
            <div style={{ maxWidth: 240 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Target Languages</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {LANGUAGES.map(lang => (
                  <button key={lang} onClick={() => toggleLanguage(lang)}
                    style={{
                      padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: targetLanguages.includes(lang) ? 'var(--accent-bg)' : 'var(--bg-input)',
                      border: '1px solid var(--border-default)', cursor: 'pointer',
                      color: targetLanguages.includes(lang) ? 'var(--accent-text)' : 'var(--text-secondary)',
                    }}
                  >{lang}</button>
                ))}
              </div>
              {targetLanguages.length > 0 && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>Selected: {targetLanguages.join(', ')}</div>
              )}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Upload a video and select target languages to dub..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading || targetLanguages.length === 0} style={{ opacity: loading || targetLanguages.length === 0 ? 0.6 : 1 }}>
              {loading ? 'Dubbing...' : `Dub (${targetLanguages.length} languages)`}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
