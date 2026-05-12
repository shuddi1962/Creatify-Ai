'use client';

import { useState } from 'react';
import { Box } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';

const OUTPUT_TYPES = ['3D Render', 'Rotating Video', 'GLB File', 'OBJ File'];
const VIEWING_ANGLES = ['360 Spin', 'Front 3-4', 'Isometric', 'Custom'];
const MATERIALS = ['Realistic', 'Stylized', 'Clay', 'Metallic', 'Glass'];
const BACKGROUNDS = ['Transparent', 'Studio', 'Environment Map'];

export default function ImageTo3DPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [outputType, setOutputType] = useState('3D Render');
  const [viewAngle, setViewAngle] = useState('360 Spin');
  const [material, setMaterial] = useState('Realistic');
  const [background, setBackground] = useState('Transparent');
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
      toast.error('Please upload an image to convert');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      const isVideo = outputType === 'Rotating Video';
      setResults([{
        id: `result-${Date.now()}`,
        url: isVideo ? `https://picsum.photos/seed/${Date.now()}/800/600` : `https://picsum.photos/seed/${Date.now()}/1024/1024`,
        prompt: `${outputType} - ${viewAngle} - ${material}`,
        type: isVideo ? 'video' : 'image'
      }]);
      toast.success('3D generated successfully!');
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
          <LeftPanel title="OUTPUT TYPE">
            {OUTPUT_TYPES.map(t => (
              <button key={t} onClick={() => setOutputType(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: outputType === t ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: outputType === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (outputType !== t) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (outputType !== t) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: outputType === t ? 500 : 400 }}>{t}</div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="ANGLE" value={viewAngle} onChange={setViewAngle} options={VIEWING_ANGLES} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="MATERIAL" value={material} onChange={setMaterial} options={MATERIALS} />
              </div>
              <StudioDropdown label="BACKGROUND" value={background} onChange={setBackground} options={BACKGROUNDS} />
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
              Image to 3D
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, maxWidth: 300, width: '100%' }}>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload image to convert" />
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
          <DirectorBar title="3D Controls">
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
