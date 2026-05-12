'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import * as muapi from '@/packages/studio/src/muapi';

const PLACEMENT_STYLES = ['Natural', 'Floating', 'Shadow', 'Reflection'];
const BG_STYLES = ['Studio', 'Lifestyle', 'Nature', 'Urban', 'Abstract', 'Custom'];
const MODELS = ['flux', 'dalle', 'midjourney'];

export default function ProductPlacementPage() {
  const [productImage, setProductImage] = useState(null);
  const [sceneImage, setSceneImage] = useState(null);
  const [scenePrompt, setScenePrompt] = useState('');
  const [placementStyle, setPlacementStyle] = useState('Natural');
  const [productScale, setProductScale] = useState(50);
  const [bgStyle, setBgStyle] = useState('Lifestyle');
  const [customBg, setCustomBg] = useState(null);
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleProductFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProductImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setProductImage(null);
    }
  };

  const handleSceneFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSceneImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSceneImage(null);
    }
  };

  const handleCustomBg = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCustomBg(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!productImage) {
      toast.error('Please upload a product image');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      const fullPrompt = `${scenePrompt || 'Product in scene'}, ${placementStyle} placement, ${bgStyle} background, ${productScale}% scale`;
      if (apiKey) {
        const response = await muapi.generateI2I(apiKey, {
          model,
          prompt: fullPrompt,
          image_url: productImage,
          strength: 0.6,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Product placed successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1024/768`,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Demo: Product placed!');
      }
    } catch (error) {
      toast.error(error.message || 'Placement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="PLACEMENT STYLE">
            {PLACEMENT_STYLES.map(s => (
              <button key={s} onClick={() => setPlacementStyle(s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: placementStyle === s ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: placementStyle === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (placementStyle !== s) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (placementStyle !== s) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: placementStyle === s ? 500 : 400 }}>{s}</div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="BG STYLE" value={bgStyle} onChange={setBgStyle} options={BG_STYLES} />
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
              Product Placement
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', gap: 12 }}>
              <div style={{ width: 160 }}>
                <UploadZone onFile={handleProductFile} preview={productImage} accept="image/*" label="Product" />
              </div>
              <div style={{ width: 160 }}>
                <UploadZone onFile={handleSceneFile} preview={sceneImage} accept="image/*" label="Scene (opt)" />
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
          <DirectorBar title="Product Placement Controls">
            <PromptInput value={scenePrompt} onChange={e => setScenePrompt(e.target.value)} placeholder="Describe the scene or leave empty for AI..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Scale:</span>
                <input type="range" min="10" max="100" value={productScale}
                  onChange={e => setProductScale(parseInt(e.target.value))}
                  style={{ width: 60, accentColor: '#CCFF00' }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{productScale}%</span>
              </div>
              <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
