'use client';

import { useState } from 'react';
import { Smile } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';

const MEME_TYPES = ['Classic top-bottom text', 'Modern overlay', 'Reaction', 'Deep Fried', 'Wholesome', 'Dank'];
const FONTS = ['Impact', 'Arial Black', 'Comic Sans', 'Helvetica Bold', 'Custom'];
const TEXT_COLORS = ['White', 'Black', 'Yellow', 'Custom'];

export default function MemePage() {
  const [memeType, setMemeType] = useState('Classic top-bottom text');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [font, setFont] = useState('Impact');
  const [textColor, setTextColor] = useState('White');
  const [customColor, setCustomColor] = useState('#ffffff');
  const [textOutline, setTextOutline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setUploadedImage(null);
    }
  };

  const handleGenerate = async () => {
    const isClassic = memeType === 'Classic top-bottom text';
    if (!uploadedImage && !prompt.trim() && (!topText.trim() && !bottomText.trim())) {
      toast.error('Please upload an image or enter text/prompt');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResults([{
        id: `result-${Date.now()}`,
        url: `https://picsum.photos/seed/${Date.now()}/800/800`,
        prompt: isClassic ? `${topText} / ${bottomText}` : prompt,
        type: 'image'
      }]);
      toast.success('Meme generated!');
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const isClassic = memeType === 'Classic top-bottom text';

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="MEME TYPE">
            {MEME_TYPES.map(t => (
              <button key={t} onClick={() => setMemeType(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: memeType === t ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: memeType === t ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (memeType !== t) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (memeType !== t) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: memeType === t ? 500 : 400 }}>{t}</div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="FONT" value={font} onChange={setFont} options={FONTS} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <StudioDropdown label="COLOR" value={textColor} onChange={setTextColor} options={TEXT_COLORS} />
              </div>
              {textColor === 'Custom' && (
                <input type="color" value={customColor}
                  onChange={e => setCustomColor(e.target.value)}
                  style={{ width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer', marginLeft: 12, marginBottom: 8 }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Outline</span>
                <button onClick={() => setTextOutline(!textOutline)}
                  style={{ width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', background: textOutline ? 'var(--accent-primary)' : 'var(--bg-input)', position: 'relative', transition: 'background 200ms' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: textOutline ? 18 : 2, transition: 'left 200ms' }} />
                </button>
              </div>
            </div>
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', maxWidth: '70%', lineHeight: 1.2,
              padding: '0 24px', zIndex: 1,
            }}>
              Meme Generator
            </h1>
            <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2, maxWidth: 280, width: '100%' }}>
              <UploadZone onFile={handleFile} preview={uploadedImage} accept="image/*" label="Upload image (opt)" />
            </div>
            {results.length > 0 && (
              <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
                <div style={{ maxWidth: 500, width: '100%', padding: '0 24px' }}>
                  <ResultsGrid results={results} columns={2} />
                </div>
              </div>
            )}
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Meme Controls">
            {isClassic ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                <input type="text" value={topText}
                  onChange={e => setTopText(e.target.value)}
                  placeholder="TOP TEXT"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, padding: '0' }} />
                <input type="text" value={bottomText}
                  onChange={e => setBottomText(e.target.value)}
                  placeholder="BOTTOM TEXT"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, padding: '0' }} />
                <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
              </div>
            ) : (
              <>
                <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your meme concept..." />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <GenerateButton onClick={handleGenerate}>GENERATE</GenerateButton>
                </div>
              </>
            )}
          </DirectorBar>
        }
      />
    </>
  );
}
