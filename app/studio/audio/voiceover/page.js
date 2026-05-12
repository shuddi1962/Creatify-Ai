'use client';

import { useState } from 'react';
import { Mic, Play, Pause, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const VOICES = [
  { id: 'adam', name: 'Adam', language: 'English', gender: 'Male' },
  { id: 'sarah', name: 'Sarah', language: 'English', gender: 'Female' },
  { id: 'mike', name: 'Mike', language: 'English', gender: 'Male' },
  { id: 'emily', name: 'Emily', language: 'English', gender: 'Female' },
  { id: 'carlos', name: 'Carlos', language: 'Spanish', gender: 'Male' },
  { id: 'camille', name: 'Camille', language: 'French', gender: 'Female' },
  { id: 'hans', name: 'Hans', language: 'German', gender: 'Male' },
  { id: 'yuki', name: 'Yuki', language: 'Japanese', gender: 'Female' },
  { id: 'min-jun', name: 'Min-Jun', language: 'Korean', gender: 'Male' },
  { id: 'wei', name: 'Wei', language: 'Chinese', gender: 'Female' },
];
const SPEED_OPTIONS = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'];
const EMPHASIS_OPTIONS = ['Neutral', 'Dramatic', 'Conversational', 'Newscast', 'Whisper', 'Energetic', 'Calm', 'Formal'];
const OUTPUT_FORMAT = ['MP3', 'WAV', 'FLAC'];

export default function VoiceoverPage() {
  const [script, setScript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('sarah');
  const [speed, setSpeed] = useState('1x');
  const [pitch, setPitch] = useState(0);
  const [emphasis, setEmphasis] = useState('Neutral');
  const [outputFormat, setOutputFormat] = useState('MP3');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        const response = await muapi.generateImage(apiKey, {
          model: 'elevenlabs-tts',
          prompt: script,
          voice: selectedVoice,
          speed: parseFloat(speed),
          pitch,
          format: outputFormat.toLowerCase(),
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          duration: '0:45',
        }]);
        toast.success('Voiceover generated successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/movie.mp3',
          duration: '0:45',
        }]);
        toast.success('Demo: Voiceover generated!');
      }
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const currentVoice = VOICES.find(v => v.id === selectedVoice);

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="VOICE SETTINGS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Speed</div>
          {SPEED_OPTIONS.map(o => (
            <button key={o} onClick={() => setSpeed(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: speed === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: speed === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Emphasis</div>
          {EMPHASIS_OPTIONS.map(o => (
            <button key={o} onClick={() => setEmphasis(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: emphasis === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: emphasis === o ? 'var(--accent-text)' : 'var(--text-secondary)',
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
          <div style={{ padding: '10px 12px', marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Pitch: {pitch > 0 ? '+' : ''}{pitch}</div>
            <input type="range" min="-10" max="10" value={pitch} onChange={e => setPitch(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
          </div>
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
            TEXT TO VOICEOVER
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1, alignItems: 'flex-start' }}>
            <div style={{ width: 260 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Script</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{script.length} chars</span>
              </div>
              <textarea value={script} onChange={e => setScript(e.target.value)}
                placeholder="Type or paste your script..."
                style={{
                  width: '100%', height: 160, borderRadius: 12, border: '1px solid var(--border-default)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)', padding: 12,
                  fontSize: 13, resize: 'none',
                }}
              />
            </div>
            <div style={{ width: 180 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Voice</div>
              <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)}
                style={{
                  width: '100%', padding: '6px 8px', borderRadius: 8,
                  background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)', fontSize: 12,
                }}>
                {VOICES.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.language}, {v.gender})</option>
                ))}
              </select>
              {currentVoice && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                  {currentVoice.language} · {currentVoice.gender}
                </div>
              )}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Enter your script above and generate voiceover..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Generating...' : 'Generate Voiceover'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
