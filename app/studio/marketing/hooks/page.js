'use client';

import { useState } from 'react';
import { Zap, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'LinkedIn', 'Twitter'];
const HOOK_TYPES = ['Question', 'Bold Statement', 'Provocative', 'Story Hook', 'Statistic', 'Contrast', 'Curiosity Gap', 'Fear', 'Hope', 'Celebrity', 'ASMR', 'Tutorial'];
const TONES = ['Serious', 'Humorous', 'Curious', 'Inspirational', 'Urgent', 'Calm', 'Energetic'];
const COUNTS = [5, 10, 20, 30];

const SAMPLE_HOOKS = [
  { id: 1, text: 'You won\'t believe what happened when I tried this one weird trick...', rating: 4.5, likes: 12 },
  { id: 2, text: 'Here\'s why everything you know about [topic] is completely wrong.', rating: 4.2, likes: 8 },
  { id: 3, text: 'The average person does this every day — and it\'s destroying their productivity.', rating: 4.8, likes: 15 },
  { id: 4, text: 'Stop scrolling. This changed everything for me.', rating: 3.9, likes: 6 },
  { id: 5, text: 'I tested this for 30 days and the results were insane.', rating: 4.6, likes: 11 },
  { id: 6, text: 'Nobody talks about this, but it\'s the key to success.', rating: 4.1, likes: 7 },
  { id: 7, text: 'What if I told you [provocative statement]?', rating: 4.3, likes: 9 },
  { id: 8, text: 'The #1 reason people fail at [topic] (and how to fix it).', rating: 4.7, likes: 14 },
];

export default function MarketingHooksPage() {
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [hookTypes, setHookTypes] = useState(['Question', 'Bold Statement', 'Curiosity Gap']);
  const [tone, setTone] = useState('Energetic');
  const [count, setCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const toggleHookType = (type) => {
    setHookTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleGenerate = async () => {
    if (!niche.trim()) {
      toast.error('Please enter a niche or product');
      return;
    }
    setLoading(true);
    toast.success('Generating viral hooks...');
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating hooks via API!');
      } else {
        await new Promise(r => setTimeout(r, 2000));
        const generatedHooks = SAMPLE_HOOKS.slice(0, Math.min(count, SAMPLE_HOOKS.length)).map((h, i) => ({
          ...h,
          id: Date.now() + i,
          text: h.text.replace('[topic]', niche),
        }));
        setHooks(generatedHooks);
        toast.success(`Demo: ${generatedHooks.length} hooks generated!`);
      }
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (hook) => {
    navigator.clipboard.writeText(hook.text);
    setCopiedId(hook.id);
    toast.success('Copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRate = (id, up) => {
    setHooks(prev => prev.map(h => h.id === id ? { ...h, likes: up ? h.likes + 1 : Math.max(0, h.likes - 1) } : h));
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="HOOK TYPES">
          {HOOK_TYPES.map(t => (
            <button key={t} onClick={() => toggleHookType(t)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: hookTypes.includes(t) ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: hookTypes.includes(t) ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{t}</button>
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
            HOOK GENERATOR
          </h1>
          {hooks.length > 0 && (
            <div style={{ zIndex: 1, marginTop: 24, maxWidth: 600, width: '100%', padding: 16, maxHeight: '60%', overflowY: 'auto' }}>
              {hooks.map((hook, i) => (
                <div key={hook.id} style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, marginBottom: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ width: 24, height: 24, background: 'var(--bg-input)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>{i + 1}</span>
                    <p style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)' }}>{hook.text}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, marginLeft: 36 }}>
                    <button onClick={() => handleCopy(hook)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 10, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      {copiedId === hook.id ? <Check size={12} color="#4ade80" /> : <Copy size={12} />} Copy
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                      <button onClick={() => handleRate(hook.id, true)} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ThumbsUp size={12} /></button>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{hook.likes}</span>
                      <button onClick={() => handleRate(hook.id, false)} style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><ThumbsDown size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Hook Settings">
          <PromptInput value={niche} onChange={e => setNiche(e.target.value)} placeholder="Enter niche or product..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <StudioDropdown label="Platform" options={PLATFORMS} value={platform} onChange={setPlatform} />
            <StudioDropdown label="Tone" options={TONES} value={tone} onChange={setTone} />
            <StudioDropdown label="Count" options={COUNTS.map(String)} value={String(count)} onChange={v => setCount(parseInt(v))} />
            <GenerateButton onClick={handleGenerate} loading={loading}>GENERATE</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
