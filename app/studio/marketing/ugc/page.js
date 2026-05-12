'use client';

import { useState } from 'react';
import { ShoppingBag, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Facebook', 'LinkedIn'];
const HOOK_STYLES = ['Problem/Solution', 'Before/After', 'Testimonial', 'Tutorial', 'Unboxing', 'Transformation', 'Lifestyle'];
const TONES = ['Authentic', 'Energetic', 'Educational', 'Emotional', 'Humorous', 'Urgent'];
const DURATIONS = ['15s', '30s', '60s'];
const CREATOR_STYLES = ['Female Creator', 'Male Creator', 'Voice-only', 'Screen Record + Voice'];
const VARIANTS = [1, 3, 5, 10];

export default function MarketingUGCPage() {
  const [productDesc, setProductDesc] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [hookStyle, setHookStyle] = useState('Problem/Solution');
  const [tone, setTone] = useState('Authentic');
  const [duration, setDuration] = useState('30s');
  const [creatorStyle, setCreatorStyle] = useState('Female Creator');
  const [variants, setVariants] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!productDesc.trim()) {
      toast.error('Please describe your product');
      return;
    }
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        const imagesList = productImage ? [productImage] : []
        const response = await muapi.generateMarketingStudioAd(apiKey, {
          prompt: `[${platform}] ${productDesc}. Hook: ${hookStyle}. Tone: ${tone}. Creator: ${creatorStyle}. Audience: ${audience || 'general'}`,
          aspect_ratio: '9:16',
          duration: parseInt(duration),
          images_list: imagesList,
        });
        setResults([{
          id: `result-${Date.now()}`,
          type: 'video', url: response.url,
          prompt: productDesc.slice(0, 50),
        }]);
        toast.success('UGC ad generated successfully!');
      } else {
        await new Promise(r => setTimeout(r, 3000));
        const newResults = Array.from({ length: variants }, (_, i) => ({
          id: Date.now() + i,
          type: 'video',
          url: `https://picsum.photos/seed/ugc${i}/720/1280`,
          prompt: `UGC Ad: ${productDesc.slice(0, 50)}...`,
        }));
        setResults(newResults);
        toast.success('Demo: UGC ads generated!');
      }
    } catch (e) {
      toast.error(e.message || 'Generation failed');
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
            UGC AD GENERATOR
          </h1>
          {results.length > 0 && (
            <div style={{ position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
              <ResultsGrid results={results} columns={2} />
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="UGC Settings">
          <PromptInput value={productDesc} onChange={e => setProductDesc(e.target.value)} placeholder="Describe your product or service..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <StudioDropdown label="Hook" options={HOOK_STYLES} value={hookStyle} onChange={setHookStyle} />
            <StudioDropdown label="Tone" options={TONES} value={tone} onChange={setTone} />
            <StudioDropdown label="Dur" options={DURATIONS} value={duration} onChange={setDuration} />
            <StudioDropdown label="Style" options={CREATOR_STYLES} value={creatorStyle} onChange={setCreatorStyle} />
            <StudioDropdown label="#" options={VARIANTS.map(String)} value={String(variants)} onChange={v => setVariants(parseInt(v))} />
            <GenerateButton onClick={handleGenerate} loading={loading}>GENERATE</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
