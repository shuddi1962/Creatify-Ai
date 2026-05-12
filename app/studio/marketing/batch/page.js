'use client';

import { useState } from 'react';
import { Package, Download, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const VARIANTS = [5, 10, 20];
const DIMENSIONS = ['Hook', 'Tone', 'Visual Style', 'Creator Type', 'Duration', 'Platform'];
const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'LinkedIn'];

export default function MarketingBatchPage() {
  const [inputType, setInputType] = useState('description');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [count, setCount] = useState(10);
  const [dimensions, setDimensions] = useState(['Hook', 'Tone', 'Visual Style']);
  const [platforms, setPlatforms] = useState(['TikTok', 'Instagram']);
  const [model, setModel] = useState('seedance-2');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const toggleDimension = (d) => setDimensions(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const togglePlatform = (p) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const handleScan = async () => {
    if (!url.trim()) { toast.error('Enter a URL'); return; }
    toast.loading('Scanning...', { id: 'scan' });
    await new Promise(r => setTimeout(r, 1500));
    setDescription('Scanned product: premium wireless headphones with active noise cancellation');
    toast.success('Product scanned!', { id: 'scan' });
  };

  const handleGenerate = async () => {
    if (!description.trim()) { toast.error('Enter a product description'); return; }
    setLoading(true);
    toast.success(`Generating ${count} ad variants...`);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating batch ads via API!');
      } else {
        await new Promise(r => setTimeout(r, 3000));
        const variants = Array.from({ length: count }, (_, i) => ({
          id: Date.now() + i,
          type: 'video',
          url: `https://picsum.photos/seed/batch${i}/720/1280`,
          prompt: `Variant ${i + 1}: ${dimensions[i % dimensions.length]} variation`,
          model,
        }));
        setResults(variants);
        toast.success('Demo: Batch generation complete!');
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
        <LeftPanel title="DIMENSIONS">
          {DIMENSIONS.map(d => (
            <button key={d} onClick={() => toggleDimension(d)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: dimensions.includes(d) ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: dimensions.includes(d) ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{d}</button>
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
            BATCH AD GENERATOR
          </h1>
          {results.length > 0 && (
            <div style={{ zIndex: 1, marginTop: 24, maxWidth: 600, width: '100%', padding: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {results.map((r, i) => (
                <div key={r.id} style={{ background: 'var(--bg-card)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ aspectRatio: '9/16', background: 'var(--bg-input)', position: 'relative' }}>
                    <img src={r.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: 4, left: 4, padding: '2px 6px', background: 'rgba(0,0,0,0.6)', borderRadius: 4, fontSize: 9, color: '#fff' }}>{i + 1}</span>
                  </div>
                  <div style={{ padding: 6, display: 'flex', gap: 4 }}>
                    <button style={{ flex: 1, padding: '4px 0', background: 'var(--bg-input)', border: 'none', borderRadius: 6, fontSize: 10, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Play size={10} />Preview</button>
                    <button style={{ flex: 1, padding: '4px 0', background: 'var(--bg-input)', border: 'none', borderRadius: 6, fontSize: 10, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Download size={10} />DL</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Batch Settings">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
            <ControlButton onClick={() => setInputType('description')}>{inputType === 'description' ? 'Description' : 'URL'}</ControlButton>
            {inputType === 'description' ? (
              <PromptInput value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product..." />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
                <PromptInput value={url} onChange={e => setUrl(e.target.value)} placeholder="Product URL..." />
                <ControlButton onClick={handleScan}>Scan</ControlButton>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <StudioDropdown label="Variants" options={VARIANTS.map(String)} value={String(count)} onChange={v => setCount(parseInt(v))} />
            <ModelSelector value={model} onChange={setModel} type="video" />
            <GenerateButton onClick={handleGenerate} loading={loading}>GENERATE</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
