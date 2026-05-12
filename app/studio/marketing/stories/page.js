'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const STRUCTURES = {
  '3-Part': [
    { part: 1, name: 'Hook', range: '0-3s', default: 'Grab attention with a bold statement or visual' },
    { part: 2, name: 'Problem', range: '3-8s', default: 'Present the pain point your product solves' },
    { part: 3, name: 'Solution', range: '8-15s', default: 'Show your product as the solution' },
  ],
  '5-Part': [
    { part: 1, name: 'Hook', range: '0-2s', default: 'Attention-grabbing opening' },
    { part: 2, name: 'Relate', range: '2-5s', default: 'Connect with the audience' },
    { part: 3, name: 'Problem', range: '5-10s', default: 'Highlight the problem' },
    { part: 4, name: 'Solution', range: '10-20s', default: 'Present your product' },
    { part: 5, name: 'CTA', range: '20-25s', default: 'Call to action' },
  ],
  '7-Part': [
    { part: 1, name: 'Hook', range: '0-2s', default: 'Bold opening' },
    { part: 2, name: 'Relate', range: '2-5s', default: 'Build connection' },
    { part: 3, name: 'Problem', range: '5-10s', default: 'Define the issue' },
    { part: 4, name: 'Insight', range: '10-15s', default: 'Share key insight' },
    { part: 5, name: 'Solution', range: '15-25s', default: 'Show solution' },
    { part: 6, name: 'Proof', range: '25-30s', default: 'Social proof' },
    { part: 7, name: 'CTA', range: '30-35s', default: 'Final call to action' },
  ],
};
const MUSIC_OPTIONS = ['None', 'Auto-match', 'Upload'];
const CTA_TIMINGS = ['0s', '1s', '2s', '3s'];

export default function MarketingStoriesPage() {
  const [structure, setStructure] = useState('3-Part');
  const [parts, setParts] = useState(STRUCTURES['3-Part']);
  const [brandKit, setBrandKit] = useState(false);
  const [ctaText, setCtaText] = useState('Shop Now');
  const [ctaTiming, setCtaTiming] = useState('2s');
  const [music, setMusic] = useState('Auto-match');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleStructureChange = (s) => {
    setStructure(s);
    setParts(STRUCTURES[s]);
  };

  const updatePart = (i, field, value) => {
    setParts(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const handleGenerate = async () => {
    setLoading(true);
    toast.success('Building story ad...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      setResults([{ id: Date.now(), type: 'video', url: 'https://picsum.photos/seed/story/720/1280', prompt: 'Story Ad' }]);
      toast.success('Story ad built!');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="STRUCTURES">
          {Object.keys(STRUCTURES).map(s => (
            <button key={s} onClick={() => handleStructureChange(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: structure === s ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: structure === s ? 'var(--accent-text)' : 'var(--text-secondary)',
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
            STORY AD BUILDER
          </h1>
          <div style={{ zIndex: 1, marginTop: 24, maxWidth: 500, width: '100%', padding: 16, maxHeight: '60%', overflowY: 'auto' }}>
            {parts.map((part, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, marginBottom: 8, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ padding: '2px 8px', background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: 10, fontWeight: 700, borderRadius: 4 }}>Part {part.part}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{part.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({part.range})</span>
                </div>
                <textarea value={part.default} onChange={e => updatePart(i, 'default', e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--text-primary)', resize: 'none', height: 60 }}
                />
              </div>
            ))}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Story Settings">
          <PromptInput value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="CTA Text (e.g. Shop Now)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <StudioDropdown label="CTA Timing" options={CTA_TIMINGS} value={ctaTiming} onChange={setCtaTiming} />
            <StudioDropdown label="Music" options={MUSIC_OPTIONS} value={music} onChange={setMusic} />
            <ControlButton onClick={() => setBrandKit(!brandKit)}>Brand Kit: {brandKit ? 'On' : 'Off'}</ControlButton>
            <GenerateButton onClick={handleGenerate} loading={loading}>BUILD STORY</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
