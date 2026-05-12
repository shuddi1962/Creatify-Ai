'use client';

import { useState } from 'react';
import { User, Plus, Trash2, Play, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const PERSONALITY_OPTIONS = ['Professional', 'Friendly', 'Energetic', 'Calm', 'Authoritative'];
const BACKGROUND_OPTIONS = ['Transparent', 'White', 'Office', 'Custom'];

export default function AvatarPage() {
  const [step, setStep] = useState(1);
  const [avatarImages, setAvatarImages] = useState([]);
  const [avatarName, setAvatarName] = useState('');
  const [personality, setPersonality] = useState('Professional');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [scriptText, setScriptText] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [voice, setVoice] = useState('voice-1');
  const [background, setBackground] = useState('Transparent');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [savedAvatars, setSavedAvatars] = useState([
    { id: '1', name: 'Sarah', images: 3, personality: 'Professional' },
    { id: '2', name: 'Mike', images: 4, personality: 'Friendly' },
  ]);

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(f => URL.createObjectURL(f));
    setAvatarImages([...avatarImages, ...newImages]);
  };

  const handleCreateAvatar = async () => {
    if (avatarImages.length < 3) {
      toast.error('Please upload at least 3 portrait photos');
      return;
    }
    if (!avatarName.trim()) {
      toast.error('Please name your avatar');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSavedAvatars([...savedAvatars, { id: Date.now().toString(), name: avatarName, images: avatarImages.length, personality }]);
    toast.success('Avatar created!');
    setStep(2);
    setSelectedAvatar(avatarName);
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!selectedAvatar) {
      toast.error('Please select an avatar');
      return;
    }
    if (!scriptText && !audioFile) {
      toast.error('Please enter text or upload audio');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setResults([{
        id: `demo-${Date.now()}`,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        prompt: scriptText || 'Avatar video',
        type: 'video'
      }]);
      toast.success('Avatar video generated!');
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = (id) => {
    setSavedAvatars(savedAvatars.filter(a => a.id !== id));
    toast.success('Avatar deleted');
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="AVATAR">
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            <button onClick={() => setStep(1)}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: step === 1 ? 'var(--accent-bg)' : 'var(--bg-input)',
                border: '1px solid var(--border-default)', cursor: 'pointer',
                color: step === 1 ? 'var(--accent-text)' : 'var(--text-secondary)',
              }}
            >Create</button>
            <button onClick={() => setStep(2)}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: step === 2 ? 'var(--accent-bg)' : 'var(--bg-input)',
                border: '1px solid var(--border-default)', cursor: 'pointer',
                color: step === 2 ? 'var(--accent-text)' : 'var(--text-secondary)',
              }}
            >Use</button>
          </div>
          {step === 1 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Personality</div>
              {PERSONALITY_OPTIONS.map(o => (
                <button key={o} onClick={() => setPersonality(o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 12px',
                    background: personality === o ? 'var(--accent-bg)' : 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 8,
                    color: personality === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                  }}
                >{o}</button>
              ))}
              <div style={{ marginTop: 8 }}>
                <input value={avatarName} onChange={e => setAvatarName(e.target.value)}
                  placeholder="Avatar name..."
                  style={{
                    width: '100%', padding: '6px 10px',
                    background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                    borderRadius: 8, color: 'var(--text-primary)', fontSize: 12,
                  }}
                />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Background</div>
              {BACKGROUND_OPTIONS.map(o => (
                <button key={o} onClick={() => setBackground(o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 12px',
                    background: background === o ? 'var(--accent-bg)' : 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 8,
                    color: background === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                  }}
                >{o}</button>
              ))}
              {savedAvatars.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>My Avatars</div>
                  {savedAvatars.map(avatar => (
                    <div key={avatar.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 12px', borderRadius: 8,
                      background: selectedAvatar === avatar.name ? 'var(--accent-bg)' : 'none',
                    }}>
                      <User size={16} style={{ color: 'var(--text-muted)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: selectedAvatar === avatar.name ? 'var(--accent-text)' : 'var(--text-secondary)' }}>{avatar.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{avatar.personality}</div>
                      </div>
                      <button onClick={() => { setStep(2); setSelectedAvatar(avatar.name); }} style={{
                        padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                        background: 'var(--accent-bg)', border: 'none', cursor: 'pointer',
                        color: 'var(--accent-text)',
                      }}>Use</button>
                      <button onClick={() => handleDeleteAvatar(avatar.id)} style={{
                        padding: '3px', borderRadius: 4, background: 'none', border: 'none',
                        cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11,
                      }}><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
            color: 'transparent',
            background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            TALKING AVATAR
          </h1>
          {step === 1 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24, zIndex: 1, maxWidth: 400, justifyContent: 'center' }}>
              {avatarImages.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                  <button onClick={() => setAvatarImages(avatarImages.filter((_, idx) => idx !== i))} style={{
                    position: 'absolute', top: -4, right: -4, width: 20, height: 20,
                    borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>×</button>
                </div>
              ))}
              <label style={{
                width: 80, height: 80, borderRadius: 10, border: '2px dashed var(--border-default)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', background: 'var(--bg-input)', gap: 4,
              }}>
                <Plus size={16} style={{ color: 'var(--text-muted)' }} />
                <input type="file" accept="image/*" multiple onChange={e => handleImageUpload(e.target.files)} style={{ display: 'none' }} />
              </label>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: 'flex', gap: 12, marginTop: 24, zIndex: 1 }}>
              <div style={{
                width: 200, padding: 16, borderRadius: 12,
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Voice</div>
                <select value={voice} onChange={e => setVoice(e.target.value)} style={{
                  width: '100%', padding: '6px 8px', borderRadius: 6,
                  background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)', fontSize: 12,
                }}>
                  <option value="voice-1">Voice 1 - Male</option>
                  <option value="voice-2">Voice 2 - Female</option>
                  <option value="voice-3">Voice 3 - Neutral</option>
                </select>
              </div>
              {audioFile ? (
                <div style={{
                  width: 200, padding: 16, borderRadius: 12,
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Audio loaded</span>
                  <button onClick={() => setAudioFile(null)} style={{
                    padding: '4px 8px', borderRadius: 6, background: 'var(--bg-input)',
                    border: '1px solid var(--border-default)', color: 'var(--text-secondary)',
                    fontSize: 11, cursor: 'pointer',
                  }}>Switch to Text</button>
                </div>
              ) : (
                <textarea value={scriptText} onChange={e => setScriptText(e.target.value)}
                  placeholder="Type your script..."
                  style={{
                    width: 200, height: 100, borderRadius: 12, border: '1px solid var(--border-default)',
                    background: 'var(--bg-input)', color: 'var(--text-primary)', padding: 8,
                    fontSize: 12, resize: 'none',
                  }}
                />
              )}
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder={step === 1 ? 'Upload 3-5 photos to create an avatar...' : 'Select avatar and enter script...'} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={step === 1 ? handleCreateAvatar : handleGenerate} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? (step === 1 ? 'Creating...' : 'Generating...') : (step === 1 ? 'Create Avatar' : 'Generate Video')}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
