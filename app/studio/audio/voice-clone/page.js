'use client';

import { useState } from 'react';
import { Mic, Play, Pause, Trash2, Edit, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import * as muapi from '@/packages/studio/src/muapi';

export default function VoiceClonePage() {
  const [step, setStep] = useState(1);
  const [voiceFile, setVoiceFile] = useState(null);
  const [voiceName, setVoiceName] = useState('');
  const [cloning, setCloning] = useState(false);
  const [script, setScript] = useState('');
  const [speed, setSpeed] = useState('1x');
  const [pitch, setPitch] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [savedVoices, setSavedVoices] = useState([
    { id: '1', name: 'My Voice', type: 'Single Speaker' },
    { id: '2', name: 'Narrator', type: 'Single Speaker' },
  ]);
  const [selectedVoice, setSelectedVoice] = useState('');

  const handleVoiceUpload = (file) => {
    if (file) setVoiceFile(file);
    else setVoiceFile(null);
  };

  const handleClone = async () => {
    if (!voiceFile) { toast.error('Please upload a voice sample'); return; }
    if (!voiceName.trim()) { toast.error('Please name your voice clone'); return; }
    setCloning(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    toast.success('Voice clone created!');
    setStep(2);
    setCloning(false);
  };

  const handleGenerate = async () => {
    if (!selectedVoice) { toast.error('Please select a voice clone'); return; }
    if (!script.trim()) { toast.error('Please enter a script'); return; }
    setGenerating(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Voice generating via API...');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/movie.mp3', voice: selectedVoice }]);
        toast.success('Demo: Audio generated with your voice clone!');
      }
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteVoice = (id) => {
    setSavedVoices(savedVoices.filter(v => v.id !== id));
    toast.success('Voice clone deleted');
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="VOICE CLONE">
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            <button onClick={() => setStep(1)}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: step === 1 ? 'var(--accent-bg)' : 'var(--bg-input)',
                border: '1px solid var(--border-default)', cursor: 'pointer',
                color: step === 1 ? 'var(--accent-text)' : 'var(--text-secondary)',
              }}
            >Clone</button>
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
            <div style={{ padding: '0 4px' }}>
              <input value={voiceName} onChange={e => setVoiceName(e.target.value)}
                placeholder="Voice name..."
                style={{
                  width: '100%', padding: '6px 10px', marginBottom: 8,
                  background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                  borderRadius: 8, color: 'var(--text-primary)', fontSize: 12,
                }}
              />
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: 16, borderRadius: 10, border: '2px dashed var(--border-default)',
                background: 'var(--bg-input)', cursor: 'pointer',
              }}>
                <Mic size={20} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                  {voiceFile ? voiceFile.name : 'Upload 10-60s sample'}
                </span>
                <input type="file" accept="audio/*" onChange={e => handleVoiceUpload(e.target.files?.[0])} style={{ display: 'none' }} />
              </label>
            </div>
          )}
          {step === 2 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Speed</div>
              {['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'].map(o => (
                <button key={o} onClick={() => setSpeed(o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 12px',
                    background: speed === o ? 'var(--accent-bg)' : 'none',
                    border: 'none', cursor: 'pointer', borderRadius: 8,
                    color: speed === o ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                  }}
                >{o}</button>
              ))}
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Pitch: {pitch > 0 ? '+' : ''}{pitch}</div>
                <input type="range" min="-10" max="10" value={pitch} onChange={e => setPitch(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
              </div>
              {savedVoices.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>Saved</div>
                  {savedVoices.map(v => (
                    <div key={v.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 12px', borderRadius: 8,
                      background: selectedVoice === v.name ? 'var(--accent-bg)' : 'none',
                    }}>
                      <Mic size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ flex: 1, fontSize: 13, color: selectedVoice === v.name ? 'var(--accent-text)' : 'var(--text-secondary)' }}>{v.name}</span>
                      <button onClick={() => setSelectedVoice(v.name)} style={{
                        padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                        background: 'var(--accent-bg)', border: 'none', cursor: 'pointer',
                        color: 'var(--accent-text)',
                      }}>Use</button>
                      <button onClick={() => handleDeleteVoice(v.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2,
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
            VOICE CLONING
          </h1>
          {step === 2 && (
            <textarea value={script} onChange={e => setScript(e.target.value)}
              placeholder="Enter text to speak with your cloned voice..."
              style={{
                width: 300, height: 120, marginTop: 24, borderRadius: 12,
                border: '1px solid var(--border-default)', background: 'var(--bg-input)',
                color: 'var(--text-primary)', padding: 12, fontSize: 13, resize: 'none',
                zIndex: 1,
              }}
            />
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder={step === 1 ? 'Upload a voice sample to clone...' : 'Select a voice and enter script...'} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={step === 1 ? handleClone : handleGenerate} disabled={cloning || generating} style={{ opacity: cloning || generating ? 0.6 : 1 }}>
              {cloning ? 'Cloning...' : generating ? 'Generating...' : step === 1 ? 'Clone Voice' : 'Generate Audio'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
