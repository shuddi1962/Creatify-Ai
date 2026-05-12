'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import ResultsGrid from '@/components/studio/ResultsGrid';

const STYLE_PRESETS = [
  'Business Professional', 'LinkedIn', 'Creative', 'Executive',
  'Casual Smart', 'Medical', 'Legal', 'Tech', 'Academic'
];
const BACKGROUNDS = ['White', 'Grey', 'Dark', 'Gradient', 'Office', 'Outdoor', 'Bokeh'];
const ATTIRES = ['Suit', 'Business Casual', 'Smart Casual', 'Industry Specific'];
const EXPRESSIONS = ['Friendly', 'Confident', 'Approachable', 'Serious'];
const QUANTITIES = ['10', '20', '40'];

export default function HeadshotPage() {
  const [images, setImages] = useState([]);
  const [stylePreset, setStylePreset] = useState('Business Professional');
  const [background, setBackground] = useState('Grey');
  const [attire, setAttire] = useState('Business Casual');
  const [expression, setExpression] = useState('Confident');
  const [outputQty, setOutputQty] = useState('20');
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

  const handleGenerate = async () => {
    if (images.length < 1) {
      toast.error('Please upload at least one selfie photo');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const qty = parseInt(outputQty);
      setResults(Array(qty).fill(null).map((_, i) => ({
        id: `result-${Date.now()}-${i}`,
        url: `https://picsum.photos/seed/${Date.now() + i}/600/800`,
        prompt: `${stylePreset} - ${attire} - ${expression}`,
        type: 'image'
      })));
      toast.success(`${qty} headshots generated!`);
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
          <LeftPanel title="STYLE PRESETS">
            {STYLE_PRESETS.map(s => (
              <button key={s} onClick={() => setStylePreset(s)}
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
                <StudioDropdown label="BACKGROUND" value={background} onChange={setBackground} options={BACKGROUNDS} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="ATTIRE" value={attire} onChange={setAttire} options={ATTIRES} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="EXPRESSION" value={expression} onChange={setExpression} options={EXPRESSIONS} />
              </div>
              <StudioDropdown label="QUANTITY" value={outputQty} onChange={setOutputQty} options={QUANTITIES} />
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
              AI Headshot
            </h1>
            <div style={{ position: 'absolute', top: 80, zIndex: 2 }}>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                width: 140, height: 100,
                borderRadius: 12, border: '2px dashed var(--border-default)',
                background: 'var(--bg-card)', cursor: 'pointer',
              }}>
                <User size={20} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Upload selfies</span>
                <input type="file" accept="image/*"
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                  style={{ display: 'none' }} />
              </label>
            </div>
            {images.length > 0 && (
              <div style={{ position: 'absolute', bottom: 80, zIndex: 2, display: 'flex', gap: 6 }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: 48, height: 48, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                    <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeImage(i)}
                      style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, background: 'var(--danger)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: '#fff', fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {results.length > 0 && (
              <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2, overflow: 'auto' }}>
                <div style={{ maxWidth: 700, width: '100%', padding: '0 24px' }}>
                  <ResultsGrid results={results.slice(0, 8)} columns={4} />
                </div>
              </div>
            )}
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Headshot Controls">
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
