'use client';

import { useState } from 'react';
import { Zap, Copy, Check } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter'];
const HOOK_TYPES = ['Question Hook', 'Bold Statement', 'Problem-Agitate', 'Shocking Stat', 'Story Hook', 'Teaser Hook', 'Contrast Hook', 'Number Hook'];
const TONES = ['Casual', 'Bold', 'Provocative', 'Curious', 'Inspirational', 'Humorous'];
const NUM_OPTIONS = ['5', '10', '15', '20'];

export default function HooksPage() {
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [selectedHooks, setSelectedHooks] = useState(['Question Hook']);
  const [tone, setTone] = useState('Casual');
  const [count, setCount] = useState('20');
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const generateHooks = () => {
    setLoading(true);
    setTimeout(() => {
      const sampleHooks = [
        { id: 1, text: 'What if everything you learned about productivity was wrong?', type: 'Question Hook', rating: 4.8 },
        { id: 2, text: 'This one change made me $10K more per month', type: 'Bold Statement', rating: 4.6 },
        { id: 3, text: 'Most people quit here — don\'t be most people', type: 'Problem-Agitate', rating: 4.7 },
        { id: 4, text: '97% of creators don\'t do this and it costs them everything', type: 'Shocking Stat', rating: 4.5 },
        { id: 5, text: 'I tried every method for 90 days — here\'s what actually worked', type: 'Story Hook', rating: 4.9 },
        { id: 6, text: 'You won\'t believe what happened when I tried this one thing', type: 'Teaser Hook', rating: 4.4 },
        { id: 7, text: 'The difference between rich and broke is one decision', type: 'Contrast Hook', rating: 4.6 },
        { id: 8, text: '5 words that changed how I think about money', type: 'Number Hook', rating: 4.7 },
        { id: 9, text: 'Stop scrolling. This changed my life in 30 days.', type: 'Teaser Hook', rating: 4.5 },
        { id: 10, text: 'Why everyone is talking about this one habit', type: 'Question Hook', rating: 4.3 },
      ];
      setHooks(sampleHooks.slice(0, parseInt(count)));
      setLoading(false);
      toast.success(`${count} hooks generated!`);
    }, 2500);
  };

  const toggleHook = (type) => {
    setSelectedHooks(prev => prev.includes(type) ? prev.filter(h => h !== type) : [...prev, type]);
  };

  const copyHook = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const useInScript = (text) => toast.success('Hook added to script generator');

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="HOOK TYPES">
          {HOOK_TYPES.map(t => (
            <button key={t} onClick={() => toggleHook(t)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: selectedHooks.includes(t) ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: selectedHooks.includes(t) ? 'var(--accent-text)' : 'var(--text-secondary)',
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
            <div style={{ zIndex: 1, marginTop: 16, width: '100%', maxWidth: 600, padding: '0 16px', maxHeight: '65%', overflowY: 'auto' }}>
              {hooks.map(hook => (
                <div key={hook.id} style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, marginBottom: 8, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>"{hook.text}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--accent-bg)', color: 'var(--accent-text)', borderRadius: 4 }}>{hook.type}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Rating: {hook.rating}/5</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button onClick={() => copyHook(hook.id, hook.text)} style={{ padding: 8, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)' }}>
                      {copiedId === hook.id ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                    </button>
                    <button onClick={() => useInScript(hook.text)} style={{ padding: '8px 12px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Use</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Hook Settings">
          <PromptInput value={niche} onChange={e => setNiche(e.target.value)} placeholder="Niche or topic..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <PromptInput value={audience} onChange={e => setAudience(e.target.value)} placeholder="Target audience..." />
            <ControlButton onClick={() => setPlatform(PLATFORMS[(PLATFORMS.indexOf(platform) + 1) % PLATFORMS.length])}>{platform}</ControlButton>
            <ControlButton onClick={() => setTone(TONES[(TONES.indexOf(tone) + 1) % TONES.length])}>{tone}</ControlButton>
            <ControlButton onClick={() => setCount(NUM_OPTIONS[(NUM_OPTIONS.indexOf(count) + 1) % NUM_OPTIONS.length])}>{count}</ControlButton>
            <GenerateButton onClick={generateHooks} loading={loading}>GENERATE</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
