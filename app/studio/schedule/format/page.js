'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const FORMATS = ['Portrait (9:16)', 'Landscape (16:9)', 'Square (1:1)', 'Story (9:16)', 'Banner (4:1)'];
const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter'];

export default function FormatPage() {
  const [selectedFormat, setSelectedFormat] = useState('Portrait (9:16)');
  const [selectedPlatform, setSelectedPlatform] = useState('TikTok');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult('https://picsum.photos/seed/format/400/300');
      setLoading(false);
    }, 2500);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="FORMATS">
          {FORMATS.map(f => (
            <button key={f} onClick={() => setSelectedFormat(f)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: selectedFormat === f ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: selectedFormat === f ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{f}</button>
          ))}
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '8px 0' }} />
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '8px 12px' }}>Platform</div>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setSelectedPlatform(p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: selectedPlatform === p ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: selectedPlatform === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{p}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, textAlign: 'center', padding: 24 }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 24,
            }}>
              PLATFORM FORMATTER
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>
              Format your content for {selectedPlatform} using {selectedFormat}
            </p>
            <div style={{
              width: 240, height: 240, margin: '0 auto',
              background: 'var(--bg-card)', borderRadius: 16,
              border: '1px solid var(--border-subtle)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {result ? (
                <img src={result} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FileText size={40} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>
            {loading && <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 12 }}>Formatting...</div>}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your content..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={generate} disabled={!prompt.trim() || loading}>Format Content</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
