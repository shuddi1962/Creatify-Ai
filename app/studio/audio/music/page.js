'use client';

import { useState } from 'react';
import { Music } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const GENRES = ['Hip-Hop', 'Pop', 'Electronic', 'Jazz', 'Classical', 'R&B', 'Rock', 'Lo-Fi', 'Cinematic', 'Reggaeton', 'Afrobeats', 'Country'];
const MOODS = ['Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Intense', 'Mysterious', 'Playful'];
const INSTRUMENTS = ['Piano', 'Guitar', 'Drums', 'Bass', 'Synth', 'Strings', 'Brass', 'Vocals'];
const DURATION_OPTIONS = ['15s', '30s', '1min', '2min', '5min'];
const VOCALS_OPTIONS = ['Instrumental', 'With Vocals'];

export default function MusicPage() {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Hip-Hop');
  const [mood, setMood] = useState('Energetic');
  const [bpm, setBpm] = useState(120);
  const [selectedInstruments, setSelectedInstruments] = useState(['Drums', 'Bass']);
  const [duration, setDuration] = useState('1min');
  const [vocals, setVocals] = useState('Instrumental');
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const toggleInstrument = (inst) => {
    if (selectedInstruments.includes(inst)) {
      setSelectedInstruments(selectedInstruments.filter(i => i !== inst));
    } else {
      setSelectedInstruments([...selectedInstruments, inst]);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt describing the music');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating music!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 4000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/movie.mp3', prompt, type: 'audio' }]);
        toast.success('Demo: Music generated!');
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
        <LeftPanel title="MUSIC SETTINGS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Genre</div>
          {GENRES.slice(0, 8).map(g => (
            <button key={g} onClick={() => setGenre(g)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: genre === g ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: genre === g ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{g}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Mood</div>
          {MOODS.map(m => (
            <button key={m} onClick={() => setMood(m)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: mood === m ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: mood === m ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{m}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Duration</div>
          {DURATION_OPTIONS.map(o => (
            <button key={o} onClick={() => setDuration(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: duration === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: duration === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ padding: '10px 12px', marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>BPM: {bpm}</div>
            <input type="range" min="60" max="200" value={bpm} onChange={e => setBpm(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Vocals</div>
          {VOCALS_OPTIONS.map(o => (
            <button key={o} onClick={() => setVocals(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: vocals === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: vocals === o ? 'var(--accent-text)' : 'var(--text-secondary)',
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
            TEXT TO MUSIC
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1 }}>
            <div style={{ width: 260 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Prompt</div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="Describe the music you want..."
                style={{
                  width: '100%', height: 100, borderRadius: 12, border: '1px solid var(--border-default)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)', padding: 12,
                  fontSize: 13, resize: 'none',
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Instruments</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 200 }}>
                {INSTRUMENTS.map(inst => (
                  <button key={inst} onClick={() => toggleInstrument(inst)}
                    style={{
                      padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: selectedInstruments.includes(inst) ? 'var(--accent-bg)' : 'var(--bg-input)',
                      border: '1px solid var(--border-default)', cursor: 'pointer',
                      color: selectedInstruments.includes(inst) ? 'var(--accent-text)' : 'var(--text-secondary)',
                    }}
                  >{inst}</button>
                ))}
              </div>
            </div>
          </div>
          {vocals === 'With Vocals' && (
            <textarea value={lyrics} onChange={e => setLyrics(e.target.value)}
              placeholder="Write your lyrics here..."
              style={{
                width: 300, height: 80, marginTop: 16, borderRadius: 12,
                border: '1px solid var(--border-default)', background: 'var(--bg-input)',
                color: 'var(--text-primary)', padding: 10, fontSize: 12, resize: 'none',
                zIndex: 1,
              }}
            />
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Describe the music you want to generate..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Generating...' : 'Generate Music'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
