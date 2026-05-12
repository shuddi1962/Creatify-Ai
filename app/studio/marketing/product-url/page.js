'use client';

import { useState } from 'react';
import { Link, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'LinkedIn'];
const FORMATS = ['Short Video', 'Image Ad', 'Carousel', 'Story'];
const STYLES = ['Casual', 'Professional', 'High-Energy', 'Emotional', 'Educational', 'Humorous'];

export default function MarketingProductUrlPage() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState(null);
  const [platform, setPlatform] = useState('TikTok');
  const [format, setFormat] = useState('Short Video');
  const [style, setStyle] = useState('Casual');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleScan = async () => {
    if (!url.trim()) {
      toast.error('Please enter a product URL');
      return;
    }
    setScanning(true);
    toast.loading('Scanning product page...', { id: 'scan' });
    try {
      await new Promise(r => setTimeout(r, 2000));
      setProduct({
        name: 'Product from URL',
        price: '$49.99',
        description: 'This product is designed to help you achieve your goals with premium quality and innovative features. Perfect for everyday use.',
        features: ['Premium quality', 'Easy to use', 'Fast shipping', 'Satisfaction guaranteed'],
        image: 'https://picsum.photos/seed/product/400/400',
      });
      toast.success('Product info extracted!', { id: 'scan' });
    } catch (e) {
      toast.error('Failed to scan URL', { id: 'scan' });
    } finally {
      setScanning(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    toast.success('Generating product ads...');
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating product ads via API!');
      } else {
        await new Promise(r => setTimeout(r, 3000));
        setResults([{ id: Date.now(), type: 'video', url: 'https://picsum.photos/seed/productad/720/1280', prompt: `Product: ${product?.name}` }]);
        toast.success('Demo: Product ads generated!');
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
        <LeftPanel title="PLATFORMS">
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: platform === p ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: platform === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{p}</button>
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
            PRODUCT URL TO AD
          </h1>
          {product && (
            <div style={{ zIndex: 1, marginTop: 24, display: 'flex', gap: 16, background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border-subtle)', maxWidth: 500 }}>
              <img src={product.image} alt="" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{product.name}</h3>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#CCFF00', marginTop: 4 }}>{product.price}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{product.description}</p>
              </div>
            </div>
          )}
          {results.length > 0 && (
            <div style={{ position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
              <ResultsGrid results={results} columns={2} />
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Product URL">
          <PromptInput value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <ControlButton onClick={handleScan} disabled={scanning}>
              {scanning ? <Loader2 size={12} className="animate-spin" /> : null}
              {scanning ? 'Scanning' : 'Scan Product'}
            </ControlButton>
            {product && <StudioDropdown label="Format" options={FORMATS} value={format} onChange={setFormat} />}
            {product && <StudioDropdown label="Style" options={STYLES} value={style} onChange={setStyle} />}
            {product && <GenerateButton onClick={handleGenerate} loading={loading}>GENERATE</GenerateButton>}
          </div>
        </DirectorBar>
      }
    />
  );
}
