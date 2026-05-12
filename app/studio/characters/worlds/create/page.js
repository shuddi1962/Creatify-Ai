'use client';

import { useState } from 'react';
import { Globe, Save } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';

const TIMES = ['Morning', 'Golden Hour', 'Midday', 'Afternoon', 'Dusk', 'Night'];
const WEATHERS = ['Clear', 'Cloudy', 'Rainy', 'Foggy', 'Stormy', 'Snow'];
const SETTINGS = ['Urban', 'Natural', 'Interior', 'Fantasy', 'Sci-Fi', 'Historical'];
const MOODS = ['Cinematic', 'Natural', 'Dramatic', 'Soft', 'High Contrast', 'Moody'];
const OPTIONS = [...TIMES, ...WEATHERS, ...SETTINGS, ...MOODS];

export default function CreateWorldPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [refImage, setRefImage] = useState(null);
  const [refPreview, setRefPreview] = useState(null);
  const [time, setTime] = useState('Golden Hour');
  const [weather, setWeather] = useState('Clear');
  const [setting, setSetting] = useState('Urban');
  const [mood, setMood] = useState('Cinematic');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [option, setOption] = useState('Morning');

  const handleRefUpload = (file) => { setRefImage(file); setRefPreview(URL.createObjectURL(file)); };

  const generatePreview = () => {
    if (!name.trim()) { toast.error('Enter a world name'); return; }
    setLoading(true);
    setTimeout(() => { setPreview('https://picsum.photos/seed/world/800/450'); setLoading(false); toast.success('Preview generated!'); }, 2500);
  };

  const saveWorld = () => { toast.success('World saved!'); };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="OPTIONS">
            {TIMES.map(p => (
              <button key={p} onClick={() => { setTime(p); setOption(p); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: time === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: time === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >{p}</button>
            ))}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
            {WEATHERS.map(p => (
              <button key={p} onClick={() => { setWeather(p); setOption(p); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: weather === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: weather === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >{p}</button>
            ))}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
            {SETTINGS.map(p => (
              <button key={p} onClick={() => { setSetting(p); setOption(p); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: setting === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: setting === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >{p}</button>
            ))}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
            {MOODS.map(p => (
              <button key={p} onClick={() => { setMood(p); setOption(p); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: mood === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: mood === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >{p}</button>
            ))}
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
                color: 'transparent',
                background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                CREATE A WORLD
              </h1>
              <div style={{ width: '100%', maxWidth: 700 }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                      <SectionLabel>World Name</SectionLabel>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sunset Beach, Cyberpunk Alley" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16, color: 'var(--text-primary)', outline: 'none' }} />
                    </div>
                    <div>
                      <SectionLabel>Reference Image (Optional)</SectionLabel>
                      <UploadZone onFile={handleRefUpload} accept="image/*" label="Upload reference" preview={refPreview} icon={Globe} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <SectionLabel>Description</SectionLabel>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this world in detail..." style={{ width: '100%', height: 80, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16, color: 'var(--text-primary)', resize: 'none', outline: 'none' }} />
                  </div>
                </div>

                {preview && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden', marginTop: 16 }}>
                    <img src={preview} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} alt="" />
                    <div style={{ padding: 16, display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={saveWorld} style={{ padding: '12px 24px', background: '#CCFF00', color: 'black', fontWeight: 700, borderRadius: 12, border: 'none', cursor: 'pointer' }}>Save to Library</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Controls">
            <PromptInput value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this world..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <button onClick={generatePreview} disabled={loading || !name.trim()} style={{
                padding: '10px 20px', background: 'var(--bg-input)', color: 'var(--text-secondary)',
                fontWeight: 600, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap', opacity: loading || !name.trim() ? 0.5 : 1,
              }}>
                {loading ? 'Generating...' : 'Generate Preview'}
              </button>
              <button onClick={saveWorld} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', background: '#CCFF00', color: 'black',
                fontWeight: 700, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                <Save size={16} /> Save World
              </button>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
