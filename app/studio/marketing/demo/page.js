'use client';

import { useState } from 'react';
import { Play, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const DEMO_STYLES = ['Unboxing', 'Feature Walkthrough', 'Before-After', 'How It Works', '360 Showcase', 'Lifestyle Use'];
const SCENE_SETTINGS = ['White Studio', 'Lifestyle Home', 'Office', 'Outdoor', 'Abstract'];
const VOICEOVER_OPTIONS = ['None', 'Auto-generated', 'Upload script'];
const DURATIONS = ['15s', '30s', '60s'];

export default function MarketingDemoPage() {
  const [product, setProduct] = useState(null);
  const [demoStyle, setDemoStyle] = useState('Feature Walkthrough');
  const [scene, setScene] = useState('White Studio');
  const [voiceover, setVoiceover] = useState('Auto-generated');
  const [duration, setDuration] = useState('30s');
  const [textOverlays, setTextOverlays] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!product) {
      toast.error('Please upload a product');
      return;
    }
    setLoading(true);
    toast.success('Generating demo video...');
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating demo via API!');
      } else {
        await new Promise(r => setTimeout(r, 3000));
        setResults([{ id: Date.now(), type: 'video', url: 'https://picsum.photos/seed/demo/1280/720', prompt: `Demo: ${demoStyle}` }]);
        toast.success('Demo: Demo video generated!');
      }
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="DEMO STYLES">
          {DEMO_STYLES.map(s => (
            <button key={s} onClick={() => setDemoStyle(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: demoStyle === s ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: demoStyle === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{s}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            PRODUCT DEMO
          </h1>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Demo Settings">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <UploadZone onFile={setProduct} accept="image/*" label="Upload product" icon={Upload} preview={product ? URL.createObjectURL(product) : null} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <StudioDropdown label="Scene" options={SCENE_SETTINGS} value={scene} onChange={setScene} />
            <StudioDropdown label="Voice" options={VOICEOVER_OPTIONS} value={voiceover} onChange={setVoiceover} />
            <StudioDropdown label="Duration" options={DURATIONS} value={duration} onChange={setDuration} />
            <ControlButton onClick={() => setTextOverlays(!textOverlays)}>Text: {textOverlays ? 'On' : 'Off'}</ControlButton>
            <GenerateButton onClick={handleGenerate} loading={loading}>GENERATE</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
