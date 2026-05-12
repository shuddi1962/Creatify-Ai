'use client';

import { useState } from 'react';
import { Image } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import ResultsGrid from '@/components/studio/ResultsGrid';
import * as muapi from '@/packages/studio/src/muapi';

const BG_TYPES = ['Transparent', 'Solid Color', 'Custom Background'];
const REFINEMENTS = ['Auto', 'Hair Detail', 'Product', 'Portrait'];
const FORMATS = ['PNG', 'JPEG'];

export default function RemoveBgPage() {
  const [images, setImages] = useState([]);
  const [bgType, setBgType] = useState('Transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [customBg, setCustomBg] = useState(null);
  const [refinement, setRefinement] = useState('Auto');
  const [outputFormat, setOutputFormat] = useState('PNG');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, { file, preview: e.target.result }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleBgType = (type) => {
    setBgType(type);
    if (type === 'Transparent') setCustomBg(null);
  };

  const handleCustomBg = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCustomBg(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        const results = await Promise.all(images.map(async (img, i) => {
          const response = await muapi.generateI2I(apiKey, {
            model: 'flux',
            prompt: `Remove background, make it ${bgType.toLowerCase()}`,
            image_url: img.preview,
            strength: 0.8,
          });
          return { id: `result-${Date.now()}-${i}`, url: response.url, prompt: 'Background removed', type: 'image' };
        }));
        setResults(results);
        toast.success('Background removed successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults(images.map((img, i) => ({
          id: `result-${Date.now()}-${i}`,
          url: `https://picsum.photos/seed/${Date.now() + i}/800/800?grayscale`,
          prompt: 'Background removed',
          type: 'image'
        })));
        toast.success('Demo: Background removed successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Background removal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="BACKGROUND">
            {BG_TYPES.map(t => (
              <button key={t} onClick={() => handleBgType(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: bgType === t ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: bgType === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (bgType !== t) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (bgType !== t) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: bgType === t ? 500 : 400 }}>{t}</div>
                </div>
              </button>
            ))}
            {bgType === 'Solid Color' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
                <input type="color" value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  style={{ width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer' }} />
                <input type="text" value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  style={{ width: 80, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '4px 8px', color: 'var(--text-primary)', fontSize: 12 }} />
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="REFINEMENT" value={refinement} onChange={setRefinement} options={REFINEMENTS} />
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
              Remove Background
            </h1>
            <div style={{ position: 'absolute', top: 80, zIndex: 2 }}>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: 160, height: 120,
                borderRadius: 12, border: '2px dashed var(--border-default)',
                background: 'var(--bg-card)', cursor: 'pointer',
              }}>
                <Image size={24} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add images</span>
                <input type="file" accept="image/*" multiple
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                  style={{ display: 'none' }} />
              </label>
            </div>
            {images.length > 0 && (
              <div style={{ position: 'absolute', bottom: 80, zIndex: 2, display: 'flex', gap: 8 }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: 64, height: 64, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                    <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeImage(i)}
                      style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, background: 'var(--danger)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {results.length > 0 && (
              <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
                <div style={{ maxWidth: 500, width: '100%', padding: '0 24px' }}>
                  <ResultsGrid results={results} columns={3} />
                </div>
              </div>
            )}
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Remove BG Controls">
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
