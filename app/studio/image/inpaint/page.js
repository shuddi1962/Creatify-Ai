'use client';

import { useState } from 'react';
import { Brush, Eraser, RotateCcw, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import * as muapi from '@/packages/studio/src/muapi';

const INPAINT_MODES = ['Replace', 'Keep Surrounding', 'Expand'];
const MODELS = ['flux', 'dalle', 'stable-diffusion'];

export default function InpaintPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [brushSize, setBrushSize] = useState(20);
  const [eraserMode, setEraserMode] = useState(false);
  const [inpaintMode, setInpaintMode] = useState('Replace');
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
          prompt: prompt,
          image_url: sourceImage,
          strength: 0.8,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Inpainting applied successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
          prompt: prompt,
          type: 'image'
        }]);
        toast.success('Demo: Inpainting applied!');
      }
    } catch (error) {
      toast.error(error.message || 'Inpainting failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="INPAINT MODES">
            {INPAINT_MODES.map(m => (
              <button key={m} onClick={() => setInpaintMode(m)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: inpaintMode === m ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: inpaintMode === m ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (inpaintMode !== m) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (inpaintMode !== m) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: inpaintMode === m ? 500 : 400 }}>{m}</div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
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
              Inpaint & Edit
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, maxWidth: 300, width: '100%' }}>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload image to edit" />
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
          <DirectorBar title="Inpaint Controls">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe what to put in the masked area..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <ControlButton icon={eraserMode ? Eraser : Brush} onClick={() => setEraserMode(!eraserMode)}>
                {eraserMode ? 'Eraser' : 'Brush'}
              </ControlButton>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Size:</span>
                <input type="range" min="4" max="80" value={brushSize}
                  onChange={e => setBrushSize(parseInt(e.target.value))}
                  style={{ width: 60, accentColor: '#CCFF00' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{brushSize}px</span>
              </div>
              <ControlButton><RotateCcw size={12} /></ControlButton>
              <ControlButton><Trash2 size={12} /></ControlButton>
              <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
