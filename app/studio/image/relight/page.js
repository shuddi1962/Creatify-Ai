'use client';

import { useState } from 'react';
import { Sun } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import * as muapi from '@/packages/studio/src/muapi';

const LIGHT_TYPES = ['Point', 'Directional', 'Ambient', 'Rim', 'Fill'];
const LIGHT_COLORS = [
  { id: 'Warm', color: '#FFD700' },
  { id: 'Cool', color: '#87CEEB' },
  { id: 'Golden', color: '#DAA520' },
  { id: 'Blue Hour', color: '#4169E1' },
  { id: 'Neon Pink', color: '#FF1493' },
  { id: 'Neon Blue', color: '#00FFFF' },
  { id: 'White', color: '#FFFFFF' },
];
const DIRECTIONS = [
  { id: 'top', label: '\u2191' },
  { id: 'top-right', label: '\u2197' },
  { id: 'right', label: '\u2192' },
  { id: 'bottom-right', label: '\u2198' },
  { id: 'bottom', label: '\u2193' },
  { id: 'bottom-left', label: '\u2199' },
  { id: 'left', label: '\u2190' },
  { id: 'top-left', label: '\u2196' },
];

export default function RelightPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [lightPosition, setLightPosition] = useState('right');
  const [lightType, setLightType] = useState('Directional');
  const [lightColor, setLightColor] = useState('Warm');
  const [intensity, setIntensity] = useState(70);
  const [shadowIntensity, setShadowIntensity] = useState(30);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSourceImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSourceImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) {
      toast.error('Please upload an image to relight');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        const response = await muapi.generateI2I(apiKey, {
          model: 'flux',
          prompt: `Relight image with ${lightType} light from ${lightPosition}, ${lightColor} color, ${intensity}% intensity`,
          image_url: sourceImage,
          strength: 0.6,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: `${lightType} light - ${lightPosition} - ${lightColor} - ${intensity}% intensity`,
          type: 'image'
        }]);
        toast.success('Lighting applied successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2500));
        setResults([{
          id: `result-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
          prompt: `${lightType} light - ${lightPosition} - ${lightColor} - ${intensity}% intensity`,
          type: 'image'
        }]);
        toast.success('Demo: Lighting applied successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Relighting failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="LIGHT TYPE">
            {LIGHT_TYPES.map(t => (
              <button key={t} onClick={() => setLightType(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: lightType === t ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: lightType === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (lightType !== t) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (lightType !== t) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: lightType === t ? 500 : 400 }}>{t}</div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '4px 12px 8px' }}>
                Light Color
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 12px 8px' }}>
                {LIGHT_COLORS.map(c => (
                  <button key={c.id} onClick={() => setLightColor(c.id)}
                    style={{
                      width: 28, height: 28, borderRadius: 6, border: lightColor === c.id ? '2px solid var(--text-primary)' : '2px solid transparent',
                      backgroundColor: c.color, cursor: 'pointer',
                    }} title={c.id} />
                ))}
              </div>
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
              textAlign: 'center', maxWidth: '70%', lineHeight: 1.2,
              padding: '0 24px', zIndex: 1,
            }}>
              Relight
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, maxWidth: 280, width: '100%' }}>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload image to relight" />
            </div>
            {results.length > 0 && (
              <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
                <div style={{ maxWidth: 500, width: '100%', padding: '0 24px' }}>
                  <ResultsGrid results={results} columns={2} />
                </div>
              </div>
            )}
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Light Controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {DIRECTIONS.map(dir => (
                <ControlButton key={dir.id} onClick={() => setLightPosition(dir.id)}
                  style={{
                    background: lightPosition === dir.id ? 'var(--accent-bg)' : 'var(--bg-input)',
                    color: lightPosition === dir.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 16,
                  }}>
                  {dir.label}
                </ControlButton>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Intensity:</span>
                <input type="range" min="0" max="100" value={intensity}
                  onChange={e => setIntensity(parseInt(e.target.value))}
                  style={{ width: 60, accentColor: '#CCFF00' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{intensity}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Shadow:</span>
                <input type="range" min="0" max="100" value={shadowIntensity}
                  onChange={e => setShadowIntensity(parseInt(e.target.value))}
                  style={{ width: 60, accentColor: '#CCFF00' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{shadowIntensity}%</span>
              </div>
              <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
