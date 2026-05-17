'use client';

import { useState } from 'react';
import { Music, Video, Sliders } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const ENERGY_OPTIONS = ['Constant', 'Build Up', 'Drop', 'Rise and Fall'];
const GENRES = ['Pop', 'Electronic', 'Cinematic', 'Acoustic', 'Rock', 'Jazz', 'Ambient'];
const MOODS = ['Energetic', 'Calm', 'Happy', 'Sad', 'Tense'];

export default function BackgroundMusicPage() {
  const [mode, setMode] = useState('standalone');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [autoScore, setAutoScore] = useState(true);
  const [genre, setGenre] = useState('Cinematic');
  const [mood, setMood] = useState('Calm');
  const [selectedInstruments, setSelectedInstruments] = useState(['Piano', 'Strings']);
  const [energy, setEnergy] = useState('Constant');
  const [volume, setVolume] = useState(70);
  const [fadeIn, setFadeIn] = useState(true);
  const [fadeOut, setFadeOut] = useState(true);
  const [loop, setLoop] = useState(false);
  const [duration, setDuration] = useState('Match video');
  const [customDuration, setCustomDuration] = useState(60);
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

  const toggleInstrument = (inst) => {
    if (selectedInstruments.includes(inst)) {
      setSelectedInstruments(selectedInstruments.filter(i => i !== inst));
    } else {
      setSelectedInstruments([...selectedInstruments, inst]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating background music!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/movie.mp3', prompt: `${genre} - ${mood}`, type: 'audio' }]);
        toast.success('Demo: Background music generated!');
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
        <LeftPanel title="BGM SETTINGS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Genre</div>
          {GENRES.map(g => (
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
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Energy</div>
          {ENERGY_OPTIONS.map(o => (
            <button key={o} onClick={() => setEnergy(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: energy === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: energy === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <button onClick={() => setAutoScore(!autoScore)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px', marginTop: 8,
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Auto-score {autoScore ? 'ON' : 'OFF'}</button>
          <button onClick={() => setFadeIn(!fadeIn)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Fade In {fadeIn ? 'ON' : 'OFF'}</button>
          <button onClick={() => setFadeOut(!fadeOut)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Fade Out {fadeOut ? 'ON' : 'OFF'}</button>
          <button onClick={() => setLoop(!loop)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Loop {loop ? 'ON' : 'OFF'}</button>
          <div style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Volume: {volume}%</div>
            <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(parseInt(e.target.value))}
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
            BACKGROUND MUSIC
          </h1>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, zIndex: 1 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              <button onClick={() => setMode('video')}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: mode === 'video' ? 'var(--accent-bg)' : 'var(--bg-input)',
                  border: '1px solid var(--border-default)', cursor: 'pointer',
                  color: mode === 'video' ? 'var(--accent-text)' : 'var(--text-secondary)',
                }}
              ><Video size={12} style={{ marginRight: 4 }} />With Video</button>
              <button onClick={() => setMode('standalone')}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: mode === 'standalone' ? 'var(--accent-bg)' : 'var(--bg-input)',
                  border: '1px solid var(--border-default)', cursor: 'pointer',
                  color: mode === 'standalone' ? 'var(--accent-text)' : 'var(--text-secondary)',
                }}
              ><Music size={12} style={{ marginRight: 4 }} />Standalone</button>
            </div>
            {mode === 'video' && (
              videoPreview ? (
                <div style={{ width: 200, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                  <video src={videoPreview} controls style={{ width: '100%', height: 120, objectFit: 'contain' }} />
                  <button onClick={() => handleVideoUpload(null)}
                    style={{
                      width: '100%', padding: '4px', background: 'var(--bg-input)', border: 'none',
                      color: 'var(--text-secondary)', fontSize: 10, cursor: 'pointer',
                    }}
                  >Remove</button>
                </div>
              ) : (
                <label style={{
                  width: 200, height: 120, borderRadius: 12, border: '2px dashed var(--border-default)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', background: 'var(--bg-input)',
                }}>
                  <Video size={20} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Upload video</span>
                  <input type="file" accept="video/*" onChange={e => handleVideoUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                </label>
              )
            )}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Instruments</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 200 }}>
                {['Piano', 'Guitar', 'Drums', 'Strings', 'Bass', 'Synth'].map(inst => (
                  <button key={inst} onClick={() => toggleInstrument(inst)}
                    style={{
                      padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: selectedInstruments.includes(inst) ? 'var(--accent-bg)' : 'var(--bg-input)',
                      border: '1px solid var(--border-default)', cursor: 'pointer',
                      color: selectedInstruments.includes(inst) ? 'var(--accent-text)' : 'var(--text-secondary)',
                    }}
                  >{inst}</button>
                ))}
              </div>
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Select genre, mood, and generate background music..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Generating...' : 'Generate BGM'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
