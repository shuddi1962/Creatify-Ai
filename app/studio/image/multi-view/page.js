'use client';

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';

const SUBJECT_TYPES = ['Person', 'Product', 'Object', 'Architecture', 'Character'];
const BG_STYLES = ['Transparent', 'White Studio', 'Gradient', 'Custom prompt'];
const MODELS = ['flux', 'stable-diffusion'];

export default function MultiViewPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [subjectType, setSubjectType] = useState('Product');
  const [selectedAngles, setSelectedAngles] = useState(['Front', 'Left', 'Right']);
  const [bgStyle, setBgStyle] = useState('White Studio');
  const [customPrompt, setCustomPrompt] = useState('');
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const ANGLES = [
    'Front', 'Front-Left', 'Left', 'Back-Left', 'Back', 'Back-Right', 'Right', 'Front-Right', 'Top'
  ];

  const handleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSourceImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSourceImage(null);
    }
  };

  const toggleAngle = (angle) => {
    setSelectedAngles(prev =>
      prev.includes(angle) ? prev.filter(a => a !== angle) : [...prev, angle]
    );
  };

  const handleGenerate = async () => {
    if (!sourceImage) {
      toast.error('Please upload a subject image');
      return;
    }
    if (selectedAngles.length === 0) {
      toast.error('Please select at least one angle');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setResults(selectedAngles.map((angle, i) => ({
        id: `result-${Date.now()}-${i}`,
        url: `https://picsum.photos/seed/${Date.now() + i}/800/800`,
        prompt: `${angle} view - ${subjectType}`,
        type: 'image'
      })));
      toast.success(`${selectedAngles.length} angles generated!`);
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
          <LeftPanel title="SUBJECT TYPE">
            {SUBJECT_TYPES.map(t => (
              <button key={t} onClick={() => setSubjectType(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: subjectType === t ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: subjectType === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (subjectType !== t) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (subjectType !== t) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: subjectType === t ? 500 : 400 }}>{t}</div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="BG STYLE" value={bgStyle} onChange={setBgStyle} options={BG_STYLES} />
              </div>
              {bgStyle === 'Custom prompt' && (
                <input type="text" value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  placeholder="Describe background..."
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '6px 10px', color: 'var(--text-primary)', fontSize: 12, marginBottom: 8 }} />
              )}
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
              Multi-View
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, maxWidth: 300, width: '100%' }}>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload subject image" />
            </div>
            {results.length > 0 && (
              <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
                <div style={{ maxWidth: 600, width: '100%', padding: '0 24px' }}>
                  <ResultsGrid results={results} columns={3} />
                </div>
              </div>
            )}
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Angles (select at least 1)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {ANGLES.map(angle => (
                <ControlButton key={angle} onClick={() => toggleAngle(angle)}
                  style={{
                    background: selectedAngles.includes(angle) ? 'var(--accent-bg)' : 'var(--bg-input)',
                    color: selectedAngles.includes(angle) ? 'var(--accent-text)' : 'var(--text-secondary)',
                    border: selectedAngles.includes(angle) ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                  }}>
                  {selectedAngles.includes(angle) && '✓ '}{angle}
                </ControlButton>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
