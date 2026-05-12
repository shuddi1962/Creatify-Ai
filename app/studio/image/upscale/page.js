'use client';

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';

const SCALES = ['2x', '4x', '8x'];
const ENHANCEMENTS = ['Standard', 'Face Enhancement', 'Detail Boost', 'Noise Reduction'];
const FORMATS = ['PNG', 'JPEG', 'WEBP'];

export default function UpscalePage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [scale, setScale] = useState('4x');
  const [enhancementMode, setEnhancementMode] = useState('Standard');
  const [outputFormat, setOutputFormat] = useState('PNG');
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
      toast.error('Please upload an image to upscale');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      const newWidth = scale === '2x' ? 2048 : scale === '4x' ? 4096 : 8192;
      setResults([{
        id: `result-${Date.now()}`,
        url: `https://picsum.photos/seed/${Date.now()}/${newWidth}/${newWidth}`,
        prompt: `${scale} upscale - ${enhancementMode}`,
        type: 'image'
      }]);
      toast.success('Image upscaled successfully!');
    } catch (error) {
      toast.error(error.message || 'Upscale failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="SCALE">
            {SCALES.map(s => (
              <button key={s} onClick={() => setScale(s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: scale === s ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: scale === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (scale !== s) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (scale !== s) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{s}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {s === '2x' ? '2048px' : s === '4x' ? '4096px' : '8192px'}
                  </div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="ENHANCEMENT" value={enhancementMode} onChange={setEnhancementMode} options={ENHANCEMENTS} />
              </div>
              <StudioDropdown label="FORMAT" value={outputFormat} onChange={setOutputFormat} options={FORMATS} />
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
              Upscale Image
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, maxWidth: 300, width: '100%' }}>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload image to upscale" />
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
          <DirectorBar title="Upscale Controls">
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
