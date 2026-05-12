'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import * as muapi from '@/packages/studio/src/muapi';

const DIRECTIONS = [
  { id: 'up', icon: ArrowUp, label: 'Up' },
  { id: 'down', icon: ArrowDown, label: 'Down' },
  { id: 'left', icon: ArrowLeft, label: 'Left' },
  { id: 'right', icon: ArrowRight, label: 'Right' },
  { id: 'up-left', icon: ArrowUpLeft, label: 'Up-Left' },
  { id: 'up-right', icon: ArrowUpRight, label: 'Up-Right' },
  { id: 'down-left', icon: ArrowDownLeft, label: 'Down-Left' },
  { id: 'down-right', icon: ArrowDownRight, label: 'Down-Right' },
];

const EXPAND_AMOUNTS = ['256px', '512px', '1024px'];
const MODELS = ['flux', 'dalle', 'stable-diffusion'];

export default function OutpaintPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [direction, setDirection] = useState('right');
  const [expandAmount, setExpandAmount] = useState('512px');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux');
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
      toast.error('Please upload an image to expand');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        const response = await muapi.generateI2I(apiKey, {
          model,
          prompt: prompt || 'Expand the scene seamlessly',
          image_url: sourceImage,
          strength: 0.7,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Image expanded successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1200/800`,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Demo: Image expanded!');
      }
    } catch (error) {
      toast.error(error.message || 'Expansion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="DIRECTIONS">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {DIRECTIONS.map(dir => (
                <button key={dir.id} onClick={() => setDirection(dir.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '10px 8px',
                    background: direction === dir.id ? 'var(--accent-bg)' : 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 8,
                    color: direction === dir.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 13, transition: 'all 100ms',
                  }}
                  onMouseEnter={e => { if (direction !== dir.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (direction !== dir.id) e.currentTarget.style.background = 'none'; }}
                >
                  <dir.icon size={18} />
                </button>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="EXPAND" value={expandAmount} onChange={setExpandAmount} options={EXPAND_AMOUNTS} />
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
              Outpaint
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, maxWidth: 300, width: '100%' }}>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload image to expand" />
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
          <DirectorBar title="Outpaint Controls">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe what should appear in the expanded area..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
