'use client';

import { useState } from 'react';
import { Headphones, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const ASMR_TYPES = ['Whispering', 'Tapping', 'Crinkling', 'Scratching', 'Water', 'Rain', 'Keyboard Typing', 'Hair Brushing', 'Cooking', 'Nature', 'Mouth Sounds', 'Page Turning'];
const INTENSITY_OPTIONS = ['Very Gentle', 'Gentle', 'Medium'];
const AMBIENCE_OPTIONS = ['Silence', 'White Noise', 'Rain', 'Forest', 'Cafe'];
const DURATION_OPTIONS = ['1min', '5min', '10min', '30min', '1hr'];

export default function AsmrPage() {
  const [asmrType, setAsmrType] = useState('Whispering');
  const [intensity, setIntensity] = useState('Gentle');
  const [binaural, setBinaural] = useState(true);
  const [ambience, setAmbience] = useState('Silence');
  const [duration, setDuration] = useState('10min');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating ASMR!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 4000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/movie.mp3', prompt: `${asmrType} - ${intensity}`, type: 'audio' }]);
        toast.success('Demo: ASMR generated!');
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
        <LeftPanel title="ASMR SETTINGS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Type</div>
          {ASMR_TYPES.slice(0, 8).map(t => (
            <button key={t} onClick={() => setAsmrType(t)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: asmrType === t ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: asmrType === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{t}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Intensity</div>
          {INTENSITY_OPTIONS.map(o => (
            <button key={o} onClick={() => setIntensity(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: intensity === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: intensity === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
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
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Ambience</div>
          {AMBIENCE_OPTIONS.map(o => (
            <button key={o} onClick={() => setAmbience(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: ambience === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: ambience === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <button onClick={() => setBinaural(!binaural)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px', marginTop: 8,
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Binaural {binaural ? '✓' : '○'}</button>
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
            ASMR GENERATOR
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 24, zIndex: 1, maxWidth: 400, justifyContent: 'center' }}>
            {ASMR_TYPES.map(type => (
              <button key={type} onClick={() => setAsmrType(type)}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: asmrType === type ? 'var(--accent-bg)' : 'var(--bg-input)',
                  border: '1px solid var(--border-default)', cursor: 'pointer',
                  color: asmrType === type ? 'var(--accent-text)' : 'var(--text-secondary)',
                }}
              >{type}</button>
            ))}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Select ASMR type and generate..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Generating...' : 'Generate ASMR'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
