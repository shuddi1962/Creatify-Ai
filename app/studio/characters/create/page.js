'use client';

import { useState } from 'react';
import { UserPlus, Check } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';

const TYPES = ['Real Person', 'Fictional', 'Cartoon', 'Anime', '3D', 'Fantasy'];
const AGE_RANGES = ['18-25', '25-35', '35-45', '45-55', '55+', 'Any'];
const GENDERS = ['Male', 'Female', 'Non-binary', 'Any'];
const OPTIONS = [...TYPES, ...AGE_RANGES, ...GENDERS];

export default function CreateCharacterPage() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Real Person');
  const [ageRange, setAgeRange] = useState('25-35');
  const [gender, setGender] = useState('Any');
  const [traits, setTraits] = useState('');
  const [outfit, setOutfit] = useState('');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [leftVisible, setLeftVisible] = useState(true);

  const handleUpload = (file) => {
    if (previews.length >= 5) { toast.error('Max 5 images'); return; }
    const newPreviews = [...previews, URL.createObjectURL(file)];
    setPreviews(newPreviews);
    setFiles([...files, file]);
  };

  const removeImage = (idx) => {
    setPreviews(previews.filter((_, i) => i !== idx));
    setFiles(files.filter((_, i) => i !== idx));
  };

  const createCharacter = () => {
    if (previews.length < 2) { toast.error('Upload at least 2 face photos'); return; }
    if (!name.trim()) { toast.error('Enter a character name'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCreated(true);
      toast.success('Character created!');
    }, 2500);
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={leftVisible && (
          <LeftPanel title="OPTIONS" onHide={() => setLeftVisible(false)}>
            {OPTIONS.map(p => (
              <button key={p} onClick={() => {
                if (TYPES.includes(p)) setType(p);
                else if (AGE_RANGES.includes(p)) setAgeRange(p);
                else if (GENDERS.includes(p)) setGender(p);
              }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: type === p || ageRange === p || gender === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: type === p || ageRange === p || gender === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >{p}</button>
            ))}
          </LeftPanel>
        )}
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
                CREATE CHARACTER
              </h1>
              <div style={{ width: '100%', maxWidth: 700 }}>
                {!created ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                      <SectionLabel>Upload 2-5 Clear Face Photos</SectionLabel>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                        {previews.map((src, i) => (
                          <div key={i} style={{ position: 'relative', borderRadius: 12, border: '2px dashed var(--border-subtle)', padding: 4, background: '#0a0a0a' }}>
                            <img src={src} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 8 }} alt="" />
                            <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: -6, right: -6, width: 24, height: 24, background: 'red', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, border: 'none', cursor: 'pointer' }}>×</button>
                          </div>
                        ))}
                        {previews.length < 5 && <UploadZone onFile={handleUpload} accept="image/*" label="Add" icon={UserPlus} />}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Character Name</SectionLabel>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah, The Explorer, Cyber Cop" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16, color: 'var(--text-primary)', outline: 'none' }} />
                    </div>
                    <div>
                      <SectionLabel>Character Type</SectionLabel>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {TYPES.map(t => (
                          <button key={t} onClick={() => setType(t)} style={{
                            padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                            background: type === t ? '#7C3AED' : 'var(--bg-input)',
                            color: type === t ? 'white' : 'var(--text-secondary)',
                            border: type === t ? 'none' : '1px solid var(--border-default)',
                            cursor: 'pointer', transition: 'all 150ms',
                          }}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <SectionLabel>Age Range</SectionLabel>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {AGE_RANGES.map(a => (
                            <button key={a} onClick={() => setAgeRange(a)} style={{
                              padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                              background: ageRange === a ? '#7C3AED' : 'var(--bg-input)',
                              color: ageRange === a ? 'white' : 'var(--text-secondary)',
                              border: ageRange === a ? 'none' : '1px solid var(--border-default)',
                              cursor: 'pointer',
                            }}>{a}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <SectionLabel>Gender Expression</SectionLabel>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {GENDERS.map(g => (
                            <button key={g} onClick={() => setGender(g)} style={{
                              padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                              background: gender === g ? '#7C3AED' : 'var(--bg-input)',
                              color: gender === g ? 'white' : 'var(--text-secondary)',
                              border: gender === g ? 'none' : '1px solid var(--border-default)',
                              cursor: 'pointer',
                            }}>{g}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Key Traits</SectionLabel>
                      <textarea value={traits} onChange={e => setTraits(e.target.value)} placeholder="e.g. Confident, warm smile, blue eyes, curly hair..." style={{ width: '100%', height: 80, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16, color: 'var(--text-primary)', resize: 'none', outline: 'none' }} />
                    </div>
                    <div>
                      <SectionLabel>Default Outfit Description</SectionLabel>
                      <textarea value={outfit} onChange={e => setOutfit(e.target.value)} placeholder="e.g. Casual streetwear: white tee, denim jacket, sneakers" style={{ width: '100%', height: 80, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16, color: 'var(--text-primary)', resize: 'none', outline: 'none' }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24, textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, background: 'rgba(16,185,129,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Check size={32} color="#10B981" /></div>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Character Created!</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>{name} is ready to use in any generation</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
                      {previews.map((src, i) => <img key={i} src={src} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 8 }} alt="" />)}
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                      <button onClick={() => { setCreated(false); setName(''); setPreviews([]); setFiles([]); }} style={{ padding: '12px 24px', background: 'var(--bg-input)', color: 'var(--text-secondary)', fontWeight: 600, borderRadius: 12, border: 'none', cursor: 'pointer' }}>Create Another</button>
                      <button onClick={() => toast.success('Saved to library!')} style={{ padding: '12px 24px', background: '#CCFF00', color: 'black', fontWeight: 700, borderRadius: 12, border: 'none', cursor: 'pointer' }}>Save to Library</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title={created ? undefined : 'Create Character'}>
            {!created && (
              <>
                <PromptInput value={''} onChange={() => {}} placeholder="Character description..." />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <GenerateButton onClick={createCharacter} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Character'}
                  </GenerateButton>
                </div>
              </>
            )}
          </DirectorBar>
        }
      />
    </>
  );
}
