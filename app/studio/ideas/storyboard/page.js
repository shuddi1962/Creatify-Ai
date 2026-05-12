'use client';

import { useState } from 'react';
import { Layout, ChevronRight, ChevronLeft, Play, Save } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

export default function StoryboardPage() {
  const [step, setStep] = useState(1);
  const [script, setScript] = useState('');
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateStoryboard = () => {
    if (!script.trim()) { toast.error('Enter or paste a script'); return; }
    setLoading(true);
    setTimeout(() => {
      setScenes([
        { id: 1, scene: 'Opening shot - establishing the setting', duration: '3s', camera: 'Wide angle', action: 'Subject walks into frame', visuals: 'Morning light through window' },
        { id: 2, scene: 'Hook moment - direct to camera', duration: '5s', camera: 'Medium close-up', action: 'Eye contact, confident tone', visuals: 'Neutral background, clean lighting' },
        { id: 3, scene: 'Main content - demonstration', duration: '20s', camera: 'POV / over shoulder', action: 'Hands showing the process', visuals: 'Product/material in focus' },
        { id: 4, scene: 'Key insight callout', duration: '4s', camera: 'Close-up', action: 'Pointing at visual element', visuals: 'Text overlay on screen' },
        { id: 5, scene: 'CTA and outro', duration: '8s', camera: 'Medium shot', action: 'Clear call to action, friendly tone', visuals: 'Subscribe button visible' },
      ]);
      setLoading(false);
      toast.success('Storyboard generated!');
    }, 3000);
  };

  const updateScene = (id, field, value) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSendToBulk = () => toast.success('Sent to bulk video generator!');

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="PIPELINE STEPS">
          {[1, 2, 3].map(s => (
            <button key={s} onClick={() => setStep(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: step === s ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: step === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >Step {s}: {s === 1 ? 'Script' : s === 2 ? 'Storyboard' : 'Generate'}</button>
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
            STORYBOARD
          </h1>
          <div style={{ zIndex: 1, marginTop: 12, width: '100%', maxWidth: 600, padding: '0 16px', maxHeight: '65%', overflowY: 'auto' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 20, border: '1px solid var(--border-subtle)' }}>
              {step === 1 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Step 1: Enter Your Script</h3>
                  <textarea value={script} onChange={e => setScript(e.target.value)} placeholder="Paste your script here..." style={{ width: '100%', height: 240, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 16, fontSize: 13, color: 'var(--text-primary)', resize: 'none' }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button onClick={() => { setStep(2); handleGenerateStoryboard(); }} disabled={!script.trim()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: !script.trim() ? 'var(--bg-input)' : '#CCFF00', color: !script.trim() ? 'var(--text-muted)' : '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: !script.trim() ? 'not-allowed' : 'pointer' }}>
                      Generate Storyboard <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Step 2: Edit Your Storyboard</h3>
                  {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                      <div style={{ width: 32, height: 32, border: '2px solid #333', borderTopColor: '#CCFF00', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    </div>
                  ) : scenes.length > 0 ? (
                    <div>
                      {scenes.map((scene, idx) => (
                        <div key={scene.id} style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 12, marginBottom: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{ width: 24, height: 24, background: '#7C3AED', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{idx + 1}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Scene {idx + 1}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div>
                              <label style={{ fontSize: 9, color: '#444', textTransform: 'uppercase' }}>Scene</label>
                              <input value={scene.scene} onChange={e => updateScene(scene.id, 'scene', e.target.value)} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: 'var(--text-primary)', marginTop: 2 }} />
                            </div>
                            <div>
                              <label style={{ fontSize: 9, color: '#444', textTransform: 'uppercase' }}>Duration</label>
                              <input value={scene.duration} onChange={e => updateScene(scene.id, 'duration', e.target.value)} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: 'var(--text-primary)', marginTop: 2 }} />
                            </div>
                            <div>
                              <label style={{ fontSize: 9, color: '#444', textTransform: 'uppercase' }}>Camera</label>
                              <input value={scene.camera} onChange={e => updateScene(scene.id, 'camera', e.target.value)} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: 'var(--text-primary)', marginTop: 2 }} />
                            </div>
                            <div>
                              <label style={{ fontSize: 9, color: '#444', textTransform: 'uppercase' }}>Action</label>
                              <input value={scene.action} onChange={e => updateScene(scene.id, 'action', e.target.value)} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: 'var(--text-primary)', marginTop: 2 }} />
                            </div>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <label style={{ fontSize: 9, color: '#444', textTransform: 'uppercase' }}>Visuals</label>
                            <input value={scene.visuals} onChange={e => updateScene(scene.id, 'visuals', e.target.value)} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '6px 8px', fontSize: 11, color: 'var(--text-primary)', marginTop: 2 }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                        <ControlButton onClick={() => setStep(1)}><ChevronLeft size={14} /> Back</ControlButton>
                        <button onClick={() => setStep(3)} style={{ padding: '10px 24px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Proceed to Generate</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
              {step === 3 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Step 3: Generate All Videos</h3>
                  <div style={{ background: 'var(--bg-input)', borderRadius: 12, padding: 32, textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Play size={40} color="#CCFF00" style={{ marginBottom: 16 }} />
                    <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{scenes.length} scenes ready to generate</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>All scenes will be generated in parallel</p>
                    <button onClick={handleSendToBulk} style={{ padding: '12px 32px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Send to Bulk Video Generator</button>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <ControlButton onClick={() => setStep(2)}><ChevronLeft size={14} /> Edit Storyboard</ControlButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Storyboard Pipeline">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{scenes.length} scenes</span>
          </div>
        </DirectorBar>
      }
    />
  );
}
