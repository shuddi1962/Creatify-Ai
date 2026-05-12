'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import * as muapi from '@/packages/studio/src/muapi';

const PRESERVE_OPTIONS = ['Content Structure', 'Color Palette', 'Both', 'Neither'];
const STYLE_PRESETS = [
  'Van Gogh', 'Monet', 'Picasso', 'Anime', 'Comic Book',
  'Oil Paint', 'Watercolor', 'Neon', 'Cyberpunk', 'Film Noir'
];
const MODELS = ['flux', 'stable-diffusion'];

export default function StyleTransferPage() {
  const [contentImage, setContentImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);
  const [styleStrength, setStyleStrength] = useState(50);
  const [preserve, setPreserve] = useState('Both');
  const [stylePreset, setStylePreset] = useState(null);
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleContentFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setContentImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setContentImage(null);
    }
  };

  const handleStyleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setStyleImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setStyleImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!contentImage) {
      toast.error('Please upload a content image');
      return;
    }
    if (!styleImage && !stylePreset) {
      toast.error('Please upload a style reference or select a preset');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      const fullPrompt = stylePreset ? `${stylePreset} style` : 'Style transfer';
      if (apiKey) {
        const response = await muapi.generateI2I(apiKey, {
          model,
          prompt: fullPrompt,
          image_url: contentImage,
          strength: styleStrength / 100,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Style transferred successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Demo: Style transferred!');
      }
    } catch (error) {
      toast.error(error.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="STYLE PRESETS">
            {STYLE_PRESETS.map(s => (
              <button key={s} onClick={() => setStylePreset(stylePreset === s ? null : s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: stylePreset === s ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: stylePreset === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (stylePreset !== s) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (stylePreset !== s) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: stylePreset === s ? 500 : 400 }}>{s}</div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="PRESERVE" value={preserve} onChange={setPreserve} options={PRESERVE_OPTIONS} />
              </div>
              <StudioDropdown label="MODEL" value={model} onChange={setModel} options={MODELS} />
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
              Style Transfer
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', gap: 12 }}>
              <div style={{ width: 160 }}>
                <UploadZone onFile={handleContentFile} preview={contentImage} accept="image/*" label="Content" />
              </div>
              <div style={{ width: 160 }}>
                <UploadZone onFile={handleStyleFile} preview={styleImage} accept="image/*" label="Style ref" />
              </div>
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
          <DirectorBar title="Style Transfer Controls">
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Strength:</span>
                <input type="range" min="10" max="100" value={styleStrength}
                  onChange={e => setStyleStrength(parseInt(e.target.value))}
                  style={{ width: 60, accentColor: '#CCFF00' }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{styleStrength}%</span>
              </div>
              <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
