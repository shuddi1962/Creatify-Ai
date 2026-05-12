'use client';

import { useState } from 'react';
import { FileText, Copy, Upload } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter'];
const TONES = ['Casual', 'Professional', 'Humorous', 'Inspirational', 'Bold'];
const LENGTHS = ['Short', 'Medium', 'Long'];
const HASHTAG_COUNTS = ['5', '10', '15', '20', '25'];

export default function CaptionsPage() {
  const [description, setDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['TikTok']);
  const [tone, setTone] = useState('Casual');
  const [length, setLength] = useState('Medium');
  const [hashtagCount, setHashtagCount] = useState('10');
  const [emoji, setEmoji] = useState(true);
  const [cta, setCta] = useState(true);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const togglePlatform = (p) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const generate = () => {
    if (!description.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setCaptions([
        { text: '🚀 Just dropped something you need to see. Tap the link and don\'t sleep on this! #trending #fyp #viral #foryou', platform: 'TikTok' },
        { text: '✨ Big things coming. This is just the beginning — stay tuned for more. #newrelease #behindthescenes #sneakpeek', platform: 'TikTok' },
        { text: '💡 Problem solved. Here\'s what nobody tells you about getting results faster. Save this for later! #tips #productivity #growth', platform: 'TikTok' },
      ]);
      setLoading(false);
    }, 2500);
  };

  const copyCaption = (idx, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="SETTINGS">
          <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Platforms</div>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => togglePlatform(p)}
                  style={{
                    display: 'block', width: '100%', padding: '6px 12px', marginBottom: 2,
                    background: selectedPlatforms.includes(p) ? 'var(--accent-bg)' : 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 6,
                    color: selectedPlatforms.includes(p) ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 12, textAlign: 'left',
                  }}
                >{p}</button>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Tone</div>
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)}
                  style={{
                    display: 'block', width: '100%', padding: '6px 12px', marginBottom: 2,
                    background: tone === t ? 'var(--accent-bg)' : 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 6,
                    color: tone === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 12, textAlign: 'left',
                  }}
                >{t}</button>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Length</div>
              {LENGTHS.map(l => (
                <button key={l} onClick={() => setLength(l)}
                  style={{
                    display: 'block', width: '100%', padding: '6px 12px', marginBottom: 2,
                    background: length === l ? 'var(--accent-bg)' : 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 6,
                    color: length === l ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 12, textAlign: 'left',
                  }}
                >{l}</button>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Hashtags</div>
              {HASHTAG_COUNTS.map(n => (
                <button key={n} onClick={() => setHashtagCount(n)}
                  style={{
                    display: 'block', width: '100%', padding: '6px 12px', marginBottom: 2,
                    background: hashtagCount === n ? 'var(--accent-bg)' : 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 6,
                    color: hashtagCount === n ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 12, textAlign: 'left',
                  }}
                >{n} tags</button>
              ))}
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={emoji} onChange={e => setEmoji(e.target.checked)} style={{ accentColor: '#CCFF00' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Emojis</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={cta} onChange={e => setCta(e.target.checked)} style={{ accentColor: '#CCFF00' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>CTA</span>
              </label>
            </div>
          </div>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, padding: 24, width: '100%', maxHeight: '100%', overflowY: 'auto' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 24,
            }}>
              AI CAPTION GENERATOR
            </h1>
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Describe Your Content</div>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what your post is about..."
                  style={{ width: '100%', height: 80, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: 12, color: 'var(--text-primary)', fontSize: 13, resize: 'none', outline: 'none' }}
                />
                <div style={{ marginTop: 12 }}>
                  <GenerateButton onClick={generate} disabled={!description.trim() || loading}>
                    {loading ? 'Generating...' : 'Generate Captions'}
                  </GenerateButton>
                </div>
              </div>
              {captions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{captions.length} Caption Variants</p>
                  {captions.map((cap, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 16 }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{cap.text}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--accent-bg)', color: 'var(--accent-text)', borderRadius: 4 }}>{cap.platform}</span>
                        <button onClick={() => copyCaption(i, cap.text)}
                          style={{ padding: '6px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          {copiedIdx === i ? 'Copied!' : <><Copy size={12} /> Copy</>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Generate">
          <PromptInput value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your content..." />
          <GenerateButton onClick={generate} disabled={!description.trim() || loading}>Generate</GenerateButton>
        </DirectorBar>
      }
    />
  );
}
