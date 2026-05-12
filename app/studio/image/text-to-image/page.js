'use client';

import { useState } from 'react';
import { Image } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import StylePresets from '@/components/studio/StylePresets';
import ResultsGrid from '@/components/studio/ResultsGrid';
import { IMAGE_MODELS } from '@/lib/modelsConfig';
import { generateImage as proxyGenerate } from '@/lib/generationUtils';

const STYLES = [
  'Photorealistic', 'Cinematic', 'Anime', 'Digital Art',
  'Oil Painting', 'Watercolor', 'Sketch', '3D Render', 'Fashion', 'Abstract'
];

const MODELS = IMAGE_MODELS.map(m => ({
  label: m.name,
  desc: `${m.cost === 'free' ? 'Free' : 'Paid'} — via ${m.provider}${m.cost === 'free' ? '  ✓' : ''}`,
  id: m.id,
  endpoint: m.endpoint,
  provider: m.provider,
}));

const RATIOS = [
  { label: '1:1', desc: 'Square — Instagram, TikTok' },
  { label: '16:9', desc: 'Landscape — YouTube, desktop' },
  { label: '9:16', desc: 'Portrait — Reels, Shorts' },
  { label: '4:3', desc: 'Standard — presentations' },
  { label: '3:4', desc: 'Portrait standard' },
  { label: '2:3', desc: 'Portrait narrow' },
  { label: '3:2', desc: 'Photography standard' },
];

const QUALITIES = [
  { label: 'Standard', desc: 'Fast — good for previews' },
  { label: 'HD', desc: 'High quality — recommended' },
  { label: '4K', desc: 'Ultra quality — uses 3x credits' },
];

const IMAGE_COUNTS = ['1 image', '2 images', '4 images', '8 images'];

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showNegative, setShowNegative] = useState(false);
  const [model, setModel] = useState(MODELS[0].label);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('Standard');
  const [numImages, setNumImages] = useState('1');
  const [style, setStyle] = useState('Photorealistic');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const getModel = (label) => MODELS.find(m => m.label === label) || MODELS[0];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    setLoading(true);
    try {
      const m = getModel(model);
      const results = await proxyGenerate({
        model: m.endpoint || m.id,
        prompt: prompt + (style !== 'Photorealistic' ? `, ${style} style` : ''),
        aspect_ratio: aspectRatio,
        quality: quality.toLowerCase(),
        numImages: parseInt(numImages),
        provider: m.provider,
      });
      setResults(results);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error(error.message || 'Generation failed');
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
              <button key={s} onClick={() => setStyle(s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: style === s ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: style === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (style !== s) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (style !== s) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: style === s ? 500 : 400 }}>{s}</div>
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
              Text to Image
            </h1>
            <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', gap: 6 }}>
              <ControlButton onClick={() => setShowNegative(!showNegative)}>
                {showNegative ? '− Negative' : '+ Negative'}
              </ControlButton>
            </div>
            {results.length > 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, padding: 40 }}>
                <div style={{ width: '100%', maxWidth: 800 }}>
                  <ResultsGrid results={results} columns={Math.min(results.length, 2)} />
                </div>
              </div>
            )}
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Text to Image Controls">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your image in detail..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <StudioDropdown label="MODEL" value={model} onChange={setModel} options={MODELS} />
              <StudioDropdown label="RATIO" value={aspectRatio} onChange={setAspectRatio} options={RATIOS} />
              <StudioDropdown label="QUALITY" value={quality} onChange={setQuality} options={QUALITIES} />
              <StudioDropdown label="COUNT" value={`${numImages} image${numImages > 1 ? 's' : ''}`} onChange={v => setNumImages(v.replace(' image', '').replace('s', ''))} options={IMAGE_COUNTS} />
              <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
