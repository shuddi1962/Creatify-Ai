'use client';

import { useState } from 'react';
import { Smartphone, Download, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', ratio: '9:16' },
  { id: 'instagram-feed', name: 'Instagram Feed', ratio: '1:1' },
  { id: 'instagram-reel', name: 'Instagram Reel', ratio: '9:16' },
  { id: 'youtube', name: 'YouTube', ratio: '16:9' },
  { id: 'youtube-short', name: 'YouTube Short', ratio: '9:16' },
  { id: 'twitter', name: 'Twitter/X', ratio: '16:9' },
  { id: 'linkedin', name: 'LinkedIn', ratio: '1.91:1' },
  { id: 'facebook', name: 'Facebook', ratio: '1:1' },
  { id: 'pinterest', name: 'Pinterest', ratio: '2:3' },
  { id: 'snapchat', name: 'Snapchat', ratio: '9:16' },
];
const CROP_MODES = ['Smart Crop', 'Center', 'Custom'];
const BG_FILLS = ['Blur', 'Black', 'White', 'Brand Color', 'Mirror'];

export default function MarketingFormatterPage() {
  const [file, setFile] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['tiktok', 'instagram-reel', 'youtube']);
  const [cropMode, setCropMode] = useState('Smart Crop');
  const [bgFill, setBgFill] = useState('Blur');
  const [captions, setCaptions] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('tiktok');

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!file) {
      toast.error('Please upload a video or image');
      return;
    }
    setLoading(true);
    toast.success('Generating all formats...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      const newResults = selectedPlatforms.map(p => ({
        id: p,
        platform: p,
        url: `https://picsum.photos/seed/${p}/720/1280`,
        type: 'image',
      }));
      setResults(newResults);
      if (newResults.length > 0) setActiveTab(newResults[0].platform);
      toast.success('All formats generated!');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = () => toast.success('Downloading ZIP...');

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="PLATFORMS">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => togglePlatform(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: selectedPlatforms.includes(p.id) ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: selectedPlatforms.includes(p.id) ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{p.name} <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>({p.ratio})</span></button>
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
            PLATFORM FORMATTER
          </h1>
          {results.length > 0 && (
            <div style={{ zIndex: 1, marginTop: 24, maxWidth: 500, width: '100%', padding: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto' }}>
                {results.map(r => (
                  <button key={r.platform} onClick={() => setActiveTab(r.platform)}
                    style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                      background: activeTab === r.platform ? 'var(--accent-bg)' : 'var(--bg-input)',
                      border: '1px solid var(--border-default)', cursor: 'pointer',
                      color: activeTab === r.platform ? 'var(--accent-text)' : 'var(--text-secondary)',
                      textTransform: 'capitalize',
                    }}
                  >{r.platform.replace('-', ' ')}</button>
                ))}
              </div>
              <div style={{ borderRadius: 12, overflow: 'hidden', background: 'var(--bg-card)' }}>
                <img src={results.find(r => r.platform === activeTab)?.url} alt="" style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedPlatforms.length} formats ready</span>
                <button onClick={handleDownloadAll} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#CCFF00', color: '#000', fontSize: 12, fontWeight: 700, border: 'none', borderRadius: 10, cursor: 'pointer' }}>
                  <Download size={14} /> Download All
                </button>
              </div>
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Format Settings">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <UploadZone onFile={setFile} accept="video/*,image/*" label="Upload" icon={ImageIcon} preview={file ? URL.createObjectURL(file) : null} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <StudioDropdown label="Crop" options={CROP_MODES} value={cropMode} onChange={setCropMode} />
            <StudioDropdown label="BG" options={BG_FILLS} value={bgFill} onChange={setBgFill} />
            <ControlButton onClick={() => setCaptions(!captions)}>{captions ? 'Captions: On' : 'Captions: Off'}</ControlButton>
            <ControlButton onClick={() => setWatermark(!watermark)}>{watermark ? 'WM: On' : 'WM: Off'}</ControlButton>
            <GenerateButton onClick={handleGenerate} loading={loading}>GENERATE</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
