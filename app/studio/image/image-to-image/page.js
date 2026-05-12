'use client';

import { useState } from 'react';
import { Image } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import * as muapi from '@/packages/studio/src/muapi';

const STYLES = [
  { label: 'Photorealistic' },
  { label: 'Cinematic' },
  { label: 'Anime' },
  { label: 'Digital Art' },
  { label: 'Oil Painting' },
  { label: 'Watercolor' },
  { label: 'Sketch' },
  { label: '3D Render' },
  { label: 'Fashion' },
  { label: 'Abstract' },
];

const MODELS = ['flux', 'dalle', 'midjourney', 'stable-diffusion'];

const RATIOS = [
  { label: '1:1', desc: 'Square' },
  { label: '16:9', desc: 'Landscape' },
  { label: '9:16', desc: 'Portrait' },
  { label: '4:3', desc: 'Standard' },
  { label: '3:4', desc: 'Portrait standard' },
  { label: '2:3', desc: 'Portrait narrow' },
  { label: '3:2', desc: 'Photography' },
];

export default function ImageToImagePage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [strength, setStrength] = useState(60);
  const [model, setModel] = useState('flux');
  const [style, setStyle] = useState('Cinematic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
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
    if (!sourceImage && !prompt.trim()) {
      toast.error('Please upload an image and enter a prompt');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey && sourceImage) {
        const response = await muapi.generateI2I(apiKey, {
          model,
          prompt: prompt + (style !== 'Photorealistic' ? `, ${style} style` : ''),
          image_url: sourceImage,
          strength: strength / 100,
          aspect_ratio: aspectRatio,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Image transformed successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Demo: Image transformed!');
      }
    } catch (error) {
      toast.error(error.message || 'Transformation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="STYLES">
            {STYLES.map(s => (
              <button key={s.label} onClick={() => setStyle(s.label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: style === s.label ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: style === s.label ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (style !== s.label) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (style !== s.label) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: style === s.label ? 500 : 400 }}>{s.label}</div>
                </div>
              </button>
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
              textAlign: 'center', maxWidth: '70%', lineHeight: 1.2,
              padding: '0 24px', zIndex: 1,
            }}>
              Image to Image
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, maxWidth: 300, width: '100%' }}>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload source image" />
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
          <DirectorBar title="Image to Image Controls">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe how to transform the image..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Strength:</span>
                <input type="range" min="0" max="100" value={strength}
                  onChange={e => setStrength(parseInt(e.target.value))}
                  style={{ width: 80, accentColor: '#CCFF00' }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{strength}%</span>
              </div>
              <StudioDropdown label="MODEL" value={model} onChange={setModel} options={MODELS} />
              <StudioDropdown label="RATIO" value={aspectRatio} onChange={setAspectRatio} options={RATIOS} />
              <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
