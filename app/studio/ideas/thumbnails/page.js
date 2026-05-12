'use client';

import { useState } from 'react';
import { Image, Download } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import UploadZone from '@/components/studio/UploadZone';
import GenerateButton from '@/components/studio/GenerateButton';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const PLATFORMS = ['YouTube', 'TikTok', 'Instagram', 'LinkedIn'];
const STYLES = ['Clickbait', 'Educational', 'Minimalist', 'Bold Text', 'Face Reaction', 'Split'];
const NUM_OPTIONS = ['3', '5', '8', '10'];

export default function ThumbnailsPage() {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [style, setStyle] = useState('Bold Text');
  const [numThumbs, setNumThumbs] = useState('5');
  const [faceImage, setFaceImage] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [brandKit, setBrandKit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFaceUpload = (file) => {
    if (file) {
      setFaceImage(file);
      setFacePreview(URL.createObjectURL(file));
    }
  };

  const generate = () => {
    if (!title.trim()) { toast.error('Enter a video title'); return; }
    setLoading(true);
    setTimeout(() => {
      const thumbs = Array.from({ length: parseInt(numThumbs) }, (_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/seed/thumb${Date.now() + i}/640/360`,
        label: `Variant ${i + 1}`,
      }));
      setResults(thumbs);
      setLoading(false);
      toast.success(`${numThumbs} thumbnails generated!`);
    }, 3000);
  };

  const handleDownload = (id) => toast.success('Download started!');
  const handleUse = (id) => toast.success('Thumbnail selected!');

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="STYLES">
          {STYLES.map(s => (
            <button key={s} onClick={() => setStyle(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: style === s ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: style === s ? 'var(--accent-text)' : 'var(--text-secondary)',
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
            THUMBNAIL GENERATOR
          </h1>
          {results.length > 0 && (
            <div style={{ zIndex: 1, marginTop: 16, width: '100%', maxWidth: 600, padding: '0 16px', maxHeight: '65%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Generated Thumbnails</h3>
                <button onClick={() => toast.success('A/B Compare coming soon')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>A/B Compare</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {results.map(thumb => (
                  <div key={thumb.id} style={{ background: 'var(--bg-card)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <img src={thumb.url} alt={thumb.label} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                    <div style={{ padding: 8, display: 'flex', gap: 8 }}>
                      <button onClick={() => handleUse(thumb.id)} style={{ flex: 1, padding: '8px 0', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Use This</button>
                      <button onClick={() => handleDownload(thumb.id)} style={{ padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)' }}><Download size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Thumbnail Settings">
          <PromptInput value={title} onChange={e => setTitle(e.target.value)} placeholder="Video title..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <ControlButton onClick={() => setPlatform(PLATFORMS[(PLATFORMS.indexOf(platform) + 1) % PLATFORMS.length])}>{platform}</ControlButton>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Face Photo
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFaceUpload(e.target.files[0])} style={{ display: 'none' }} />
            </label>
            <ControlButton onClick={() => setBrandKit(!brandKit)}>Brand: {brandKit ? 'On' : 'Off'}</ControlButton>
            <ControlButton onClick={() => setNumThumbs(NUM_OPTIONS[(NUM_OPTIONS.indexOf(numThumbs) + 1) % NUM_OPTIONS.length])}>{numThumbs}</ControlButton>
            <GenerateButton onClick={generate} loading={loading}>GENERATE</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
