'use client';

import { useState } from 'react';
import { Layers, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const COMPOSITION_RULES = ['Rule of Thirds', 'Golden Ratio', 'Symmetry', 'Leading Lines', 'Frame in Frame', 'Diagonal'];
const COLOR_HARMONY = ['Complementary', 'Analogous', 'Triadic', 'Monochromatic'];
const WEATHER_OPTIONS = ['Clear', 'Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Foggy', 'Windy', 'Mixed'];
const TIME_OPTIONS = ['Dawn', 'Golden Hour', 'Midday', 'Afternoon', 'Dusk', 'Night', 'Blue Hour'];

export default function CinemaScenePage() {
  const [subject, setSubject] = useState('');
  const [background, setBackground] = useState('');
  const [foreground, setForeground] = useState('');
  const [props, setProps] = useState('');
  const [lighting, setLighting] = useState('');
  const [weather, setWeather] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('Golden Hour');
  const [composition, setComposition] = useState('Rule of Thirds');
  const [colorHarmony, setColorHarmony] = useState('Complementary');
  const [depthLayers, setDepthLayers] = useState({ foreground: true, midground: true, background: true });
  const [refImage, setRefImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    setLoading(true);
    toast.success('Composing scene...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      setResults([{ id: Date.now(), type: 'video', url: 'https://picsum.photos/seed/scene/1280/720', prompt: subject }]);
      toast.success('Scene composed!');
    } catch (e) {
      toast.error('Failed to compose scene');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="SCENE OPTIONS">
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Composition</div>
          {COMPOSITION_RULES.map(o => (
            <button key={o} onClick={() => setComposition(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: composition === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: composition === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Color Harmony</div>
          {COLOR_HARMONY.map(o => (
            <button key={o} onClick={() => setColorHarmony(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: colorHarmony === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: colorHarmony === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Weather</div>
          {WEATHER_OPTIONS.map(o => (
            <button key={o} onClick={() => setWeather(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: weather === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: weather === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px', marginTop: 8 }}>Time of Day</div>
          {TIME_OPTIONS.map(o => (
            <button key={o} onClick={() => setTimeOfDay(o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: timeOfDay === o ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: timeOfDay === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{o}</button>
          ))}
          <div style={{ padding: '10px 12px', marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Depth Layers</div>
            {['foreground', 'midground', 'background'].map(layer => (
              <button key={layer} onClick={() => setDepthLayers(prev => ({ ...prev, [layer]: !prev[layer] }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '6px 8px',
                  background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6,
                  color: 'var(--text-secondary)', fontSize: 12, textAlign: 'left',
                }}
              >{depthLayers[layer] ? '✓' : '○'} {layer}</button>
            ))}
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
            SCENE COMPOSITION
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, zIndex: 1 }}>
            <div style={{ width: 220 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Subject</div>
              <textarea value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="Main subject description..."
                style={{
                  width: '100%', height: 60, borderRadius: 8, border: '1px solid var(--border-default)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)', padding: 8,
                  fontSize: 12, resize: 'none',
                }}
              />
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', margin: '8px 0 4px' }}>Background</div>
              <textarea value={background} onChange={e => setBackground(e.target.value)}
                placeholder="Background environment..."
                style={{
                  width: '100%', height: 60, borderRadius: 8, border: '1px solid var(--border-default)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)', padding: 8,
                  fontSize: 12, resize: 'none',
                }}
              />
            </div>
            <div style={{ width: 220 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Lighting</div>
              <textarea value={lighting} onChange={e => setLighting(e.target.value)}
                placeholder="How the scene is lit..."
                style={{
                  width: '100%', height: 60, borderRadius: 8, border: '1px solid var(--border-default)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)', padding: 8,
                  fontSize: 12, resize: 'none',
                }}
              />
              {refImage && (
                <div style={{ marginTop: 8, position: 'relative', width: 100 }}>
                  <img src={URL.createObjectURL(refImage)} alt="" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 8 }} />
                  <button onClick={() => setRefImage(null)} style={{
                    position: 'absolute', top: -4, right: -4, width: 18, height: 18,
                    borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)', fontSize: 10, cursor: 'pointer',
                  }}>×</button>
                </div>
              )}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Describe the subject, background, and scene elements..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Composing...' : 'Compose Scene'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
