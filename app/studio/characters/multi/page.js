'use client';

import { useState } from 'react';
import { Users, Plus, X, Upload } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import SectionLabel from '@/components/studio/SectionLabel';
import UploadZone from '@/components/studio/UploadZone';

const SAMPLE_CHARACTERS = [
  { id: 1, name: 'Sarah', avatar: 'https://picsum.photos/seed/s1/100' },
  { id: 2, name: 'The Explorer', avatar: 'https://picsum.photos/seed/s2/100' },
  { id: 3, name: 'Mia', avatar: 'https://picsum.photos/seed/s3/100' },
  { id: 4, name: 'Cyber Cop', avatar: 'https://picsum.photos/seed/s4/100' },
];
const POSITIONS = ['Left', 'Center', 'Right'];
const SIZES = ['Small', 'Medium', 'Large'];
const OPTIONS = [...POSITIONS, ...SIZES];

export default function MultiCharacterPage() {
  const [scenePrompt, setScenePrompt] = useState('');
  const [characters, setCharacters] = useState([
    { id: 1, charId: null, position: 'Left', size: 'Medium' },
    { id: 2, charId: null, position: 'Right', size: 'Medium' },
  ]);
  const [bgType, setBgType] = useState('prompt');
  const [bgPrompt, setBgPrompt] = useState('');
  const [bgImage, setBgImage] = useState(null);
  const [bgPreview, setBgImagePreview] = useState(null);
  const [interaction, setInteraction] = useState('');
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState('Left');

  const updateChar = (id, field, value) => setCharacters(characters.map(c => c.id === id ? { ...c, [field]: value } : c));
  const addChar = () => { if (characters.length < 4) setCharacters([...characters, { id: Date.now(), charId: null, position: 'Center', size: 'Medium' }]); };
  const removeChar = (id) => { if (characters.length > 1) setCharacters(characters.filter(c => c.id !== id)); };

  const handleBgUpload = (file) => { setBgImage(file); setBgImagePreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (characters.every(c => !c.charId)) { toast.error('Select at least one character'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Scene generated!'); }, 3500);
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="OPTIONS">
            {OPTIONS.map(p => (
              <button key={p} onClick={() => setOption(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: option === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: option === p ? 'var(--accent-text)' : 'var(--text-secondary)',
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
                MULTI-CHARACTER SCENE
              </h1>
              <div style={{ width: '100%', maxWidth: 700 }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                  <div style={{ marginBottom: 20 }}>
                    <SectionLabel>Scene Prompt</SectionLabel>
                    <textarea value={scenePrompt} onChange={e => setScenePrompt(e.target.value)} placeholder="e.g. Two friends having coffee at a trendy cafe, warm sunlight, cinematic lighting" style={{ width: '100%', height: 80, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16, color: 'var(--text-primary)', resize: 'none', outline: 'none' }} />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <SectionLabel>Characters (up to 4)</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {characters.map((char, idx) => (
                        <div key={char.id} style={{ background: '#0a0a0a', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, width: 24 }}>#{idx + 1}</span>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flex: 1 }}>
                            <div>
                              <label style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Character</label>
                              <select onChange={e => updateChar(char.id, 'charId', e.target.value || null)} value={char.charId || ''} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '6px 8px', fontSize: 12, color: 'var(--text-primary)', marginTop: 4, outline: 'none' }}>
                                <option value="">Select...</option>
                                {SAMPLE_CHARACTERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Position</label>
                              <select onChange={e => updateChar(char.id, 'position', e.target.value)} value={char.position} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '6px 8px', fontSize: 12, color: 'var(--text-primary)', marginTop: 4, outline: 'none' }}>
                                {POSITIONS.map(p => <option key={p}>{p}</option>)}
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Size</label>
                              <select onChange={e => updateChar(char.id, 'size', e.target.value)} value={char.size} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '6px 8px', fontSize: 12, color: 'var(--text-primary)', marginTop: 4, outline: 'none' }}>
                                {SIZES.map(s => <option key={s}>{s}</option>)}
                              </select>
                            </div>
                          </div>
                          {characters.length > 1 && <button onClick={() => removeChar(char.id)} style={{ padding: 4, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={14} /></button>}
                        </div>
                      ))}
                    </div>
                    {characters.length < 4 && (
                      <button onClick={addChar} style={{ width: '100%', marginTop: 8, padding: '12px', border: '2px dashed var(--border-default)', borderRadius: 12, color: 'var(--text-muted)', fontSize: 14, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <Plus size={14} /> Add Another Character
                      </button>
                    )}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <SectionLabel>Background</SectionLabel>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      {['prompt', 'upload', 'worlds'].map(t => (
                        <button key={t} onClick={() => setBgType(t)} style={{
                          padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                          background: bgType === t ? '#7C3AED' : 'var(--bg-input)',
                          color: bgType === t ? 'white' : 'var(--text-secondary)',
                          border: bgType === t ? 'none' : '1px solid var(--border-default)',
                          cursor: 'pointer',
                        }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                      ))}
                    </div>
                    {bgType === 'prompt' && <textarea value={bgPrompt} onChange={e => setBgPrompt(e.target.value)} placeholder="Describe the background scene..." style={{ width: '100%', height: 80, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16, color: 'var(--text-primary)', resize: 'none', outline: 'none' }} />}
                    {bgType === 'upload' && <UploadZone onFile={handleBgUpload} accept="image/*" label="Upload background image" preview={bgPreview} icon={Upload} />}
                    {bgType === 'worlds' && <select style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-secondary)', outline: 'none' }}><option>Select a saved world...</option><option>Sunset Beach</option><option>City Rooftop</option></select>}
                  </div>

                  <div>
                    <SectionLabel>Interaction Prompt</SectionLabel>
                    <textarea value={interaction} onChange={e => setInteraction(e.target.value)} placeholder="e.g. Characters are laughing, making eye contact, leaning toward each other" style={{ width: '100%', height: 80, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16, color: 'var(--text-primary)', resize: 'none', outline: 'none' }} />
                  </div>
                </div>
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Controls">
            <PromptInput value={scenePrompt} onChange={e => setScenePrompt(e.target.value)} placeholder="Scene prompt..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={generate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Scene'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
