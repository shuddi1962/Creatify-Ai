'use client';

import { useState } from 'react';
import { Volume2, Library, Grid } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const CATEGORIES = ['Nature', 'Urban', 'Mechanical', 'Human', 'Impact', 'Ambient', 'Foley', 'Sci-Fi'];
const PRESET_EXAMPLES = ['Glass breaking', 'Thunder', 'Crowd cheering', 'Footsteps', 'Car engine', 'Door creaking', 'Rain', 'Wind', 'Explosion', 'Bird chirping'];
const DURATION_OPTIONS = ['1s', '2s', '5s', '10s', '30s'];
const VARIATION_OPTIONS = ['1', '2', '4'];

export default function SfxPage() {
  const [prompt, setPrompt] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [duration, setDuration] = useState('5s');
  const [variations, setVariations] = useState('1');
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt or select from library');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating sound effect!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults(Array(parseInt(variations)).fill(null).map((_, i) => ({
          id: `demo-${Date.now()}-${i}`,
          url: 'https://www.w3schools.com/html/movie.mp3',
          prompt, type: 'audio'
        })));
        toast.success('Demo: Sound effect generated!');
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
        <LeftPanel title="SFX SETTINGS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Duration</div>
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
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Variations</div>
          {VARIATION_OPTIONS.map(o => (
            <button key={o} onClick={() => setVariations(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: variations === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: variations === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <button onClick={() => setFadeIn(!fadeIn)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px', marginTop: 8,
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Fade In {fadeIn ? '✓' : '○'}</button>
          <button onClick={() => setFadeOut(!fadeOut)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
              color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left',
            }}
          >Fade Out {fadeOut ? '✓' : '○'}</button>
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
            SOUND EFFECTS
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 320 }}>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="Describe the sound effect you want..."
                style={{
                  width: '100%', height: 80, borderRadius: 12, border: '1px solid var(--border-default)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)', padding: 12,
                  fontSize: 13, resize: 'none',
                }}
              />
            </div>
            <button onClick={() => setShowLibrary(!showLibrary)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
              }}
            ><Library size={14} /> Browse Library</button>
            {showLibrary && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 400, justifyContent: 'center' }}>
                {PRESET_EXAMPLES.map(ex => (
                  <button key={ex} onClick={() => { setPrompt(ex); setShowLibrary(false); }}
                    style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 11,
                      background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)', cursor: 'pointer',
                    }}
                  >{ex}</button>
                ))}
              </div>
            )}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Describe the sound effect or pick from library..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Generating...' : 'Generate Sound Effect'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
