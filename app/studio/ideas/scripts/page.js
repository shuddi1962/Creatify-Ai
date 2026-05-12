'use client';

import { useState } from 'react';
import { FileText, RefreshCw, Copy, Check } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn'];
const DURATIONS = ['15s', '30s', '60s', '3min', '5min', '10min'];
const STYLES = ['Talking Head', 'Voiceover', 'Interview', 'Tutorial', 'Story', 'Listicle'];
const TONES = ['Casual', 'Professional', 'Humorous', 'Educational', 'Inspirational', 'Dramatic'];
const HOOK_TYPES = ['Question', 'Bold Statement', 'Relatable Problem', 'Shocking Stat', 'Story Hook', 'Teaser'];

export default function ScriptsPage() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [duration, setDuration] = useState('30s');
  const [style, setStyle] = useState('Talking Head');
  const [tone, setTone] = useState('Casual');
  const [hookType, setHookType] = useState('Question');
  const [cta, setCta] = useState('');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateScript = () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return; }
    setLoading(true);
    setTimeout(() => {
      setScript({
        hook: `Hey! Ever wondered ${topic}? Let me break it down for you.`,
        intro: `Welcome back! Today we're diving into ${topic}. If you're new here, hit that subscribe button.`,
        main: [
          `First, let's talk about why ${topic} matters in today's world.`,
          `Here are 3 key things you need to know about ${topic}.`,
          `The second point is where most people get confused, but here's the truth.`,
        ],
        cta: cta || 'Follow for more content like this!',
        outro: `That's a wrap! If you found this helpful, like and share. See you in the next one!`,
      });
      setLoading(false);
      toast.success('Script generated!');
    }, 2500);
  };

  const handleCopy = () => {
    if (!script) return;
    const text = `HOOK\n${script.hook}\n\nINTRO\n${script.intro}\n\nMAIN CONTENT\n${script.main.join('\n')}\n\nCTA\n${script.cta}\n\nOUTRO\n${script.outro}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Script copied!');
  };

  const handleSendToStoryboard = () => toast.success('Sent to storyboard!');

  const SCRIPT_SECTIONS = [
    { key: 'hook', label: 'HOOK', color: '#CCFF00' },
    { key: 'intro', label: 'INTRO', color: '#6366f1' },
    { key: 'main', label: 'MAIN CONTENT', color: '#6366f1' },
    { key: 'cta', label: 'CTA', color: '#F59E0B' },
    { key: 'outro', label: 'OUTRO', color: '#10B981' },
  ];

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
            SCRIPT GENERATOR
          </h1>
          {script && (
            <div style={{ zIndex: 1, marginTop: 16, width: '100%', maxWidth: 580, padding: 24, background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', maxHeight: '60%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Generated Script</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={() => { setLoading(true); setTimeout(() => { generateScript(); }, 100); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <RefreshCw size={14} /> Regenerate
                  </button>
                </div>
              </div>
              <div style={{}}>
                {SCRIPT_SECTIONS.map(sec => (
                  <div key={sec.key} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: sec.color }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{sec.label}</span>
                    </div>
                    {sec.key === 'main' ? (
                      <div style={{ paddingLeft: 16, borderLeft: '2px solid var(--bg-input)' }}>
                        {script.main.map((m, i) => (
                          <p key={i} style={{ fontSize: 13, color: '#ccc', marginBottom: 4, lineHeight: 1.6 }}>{i + 1}. {m}</p>
                        ))}
                      </div>
                    ) : (
                      <textarea value={script[sec.key]} onChange={e => setScript({ ...script, [sec.key]: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 12, fontSize: 13, color: '#ccc', resize: 'none' }}
                        rows={sec.key === 'hook' || sec.key === 'cta' ? 2 : 3}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={handleSendToStoryboard} style={{ width: '100%', padding: '12px 24px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>Send to Storyboard</button>
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Script Settings">
          <PromptInput value={topic} onChange={e => setTopic(e.target.value)} placeholder="Video topic..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <StudioDropdown label="Dur" options={DURATIONS} value={duration} onChange={setDuration} />
            <StudioDropdown label="Style" options={STYLES} value={style} onChange={setStyle} />
            <StudioDropdown label="Tone" options={TONES} value={tone} onChange={setTone} />
            <PromptInput value={cta} onChange={e => setCta(e.target.value)} placeholder="CTA (optional)..." />
            <GenerateButton onClick={generateScript} loading={loading}>GENERATE</GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
