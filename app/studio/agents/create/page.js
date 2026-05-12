'use client';

import { useState } from 'react';
import { Bot, ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const STEPS = ['Name & Purpose', 'Trigger', 'Actions', 'Output', 'Review'];
const TRIGGERS = ['Manual', 'Webhook', 'Schedule', 'Event'];
const ACTIONS = ['Generate Image', 'Generate Video', 'Generate Script', 'Create Caption', 'Analyze Content', 'Schedule Post', 'Send Email', 'Update DB'];
const OUTPUTS = ['Media Library', 'Email', 'Webhook', 'Slack', 'Discord'];
const EMOJIS = ['🤖', '🎨', '📹', '✨', '🚀', '⚡', '🎯', '💡'];
const OPTIONS = STEPS;

export default function CreateAgentPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [emoji, setEmoji] = useState('🤖');
  const [triggers, setTriggers] = useState(['Manual']);
  const [actions, setActions] = useState([]);
  const [outputs, setOutputs] = useState(['Media Library']);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const toggleTrigger = (t) => setTriggers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleAction = (a) => setActions(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const toggleOutput = (o) => setOutputs(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);

  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const createAgent = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Agent created!'); }, 2500);
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="STEPS">
            {OPTIONS.map((p, i) => (
              <button key={p} onClick={() => setStep(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: step >= i ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: step >= i ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  background: step >= i ? '#CCFF00' : 'var(--bg-input)',
                  color: step >= i ? 'black' : 'var(--text-muted)',
                }}>{i + 1}</span>
                {p}
              </button>
            ))}
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
                color: 'transparent',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                CREATE AGENT
              </h1>
              <div style={{ width: '100%', maxWidth: 700 }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                  {step === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 18 }}>Step 1: Name & Purpose</h3>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Agent Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Daily Content Generator" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Description</label>
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What does this agent do?" style={{ width: '100%', height: 80, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', resize: 'none', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Icon</label>
                        <div style={{ display: 'flex', gap: 12 }}>
                          {EMOJIS.map(e => (
                            <button key={e} onClick={() => setEmoji(e)} style={{
                              width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 20, background: emoji === e ? '#7C3AED' : 'var(--bg-input)',
                              border: emoji === e ? '2px solid #7C3AED' : 'none', cursor: 'pointer',
                            }}>{e}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 18 }}>Step 2: Trigger</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>How should this agent be triggered?</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {TRIGGERS.map(t => (
                          <button key={t} onClick={() => toggleTrigger(t)} style={{
                            padding: 16, borderRadius: 12, border: `1px solid ${triggers.includes(t) ? '#CCFF00' : 'var(--border-default)'}`,
                            background: triggers.includes(t) ? 'rgba(204,255,0,0.1)' : '#0a0a0a', cursor: 'pointer', textAlign: 'left', transition: 'all 150ms',
                          }}>
                            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{t}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
                              {t === 'Manual' ? 'Run on demand' : t === 'Webhook' ? 'HTTP trigger' : t === 'Schedule' ? 'Cron-based' : 'Event-based'}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 18 }}>Step 3: Actions</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>What should this agent do?</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {ACTIONS.map(a => (
                          <button key={a} onClick={() => toggleAction(a)} style={{
                            padding: 12, borderRadius: 12, border: `1px solid ${actions.includes(a) ? '#CCFF00' : 'var(--border-default)'}`,
                            background: actions.includes(a) ? 'rgba(204,255,0,0.1)' : '#0a0a0a', cursor: 'pointer', textAlign: 'left',
                          }}>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{a}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 18 }}>Step 4: Output Destination</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Where should results be sent?</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {OUTPUTS.map(o => (
                          <button key={o} onClick={() => toggleOutput(o)} style={{
                            padding: 12, borderRadius: 12, border: `1px solid ${outputs.includes(o) ? '#CCFF00' : 'var(--border-default)'}`,
                            background: outputs.includes(o) ? 'rgba(204,255,0,0.1)' : '#0a0a0a', cursor: 'pointer', textAlign: 'left',
                          }}>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{o}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 18 }}>Step 5: Review & Create</h3>
                      <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <span style={{ fontSize: 24 }}>{emoji}</span>
                          <div><p style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{name || 'Agent Name'}</p><p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{desc || 'No description'}</p></div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {triggers.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4 }}>Trigger: {t}</span>)}
                          {actions.map(a => <span key={a} style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4 }}>Action: {a}</span>)}
                          {outputs.map(o => <span key={o} style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(16,185,129,0.2)', color: '#10B981', borderRadius: 4 }}>Output: {o}</span>)}
                        </div>
                      </div>
                      <button onClick={createAgent} disabled={loading} style={{
                        width: '100%', padding: '12px 24px', background: '#CCFF00', color: 'black',
                        fontWeight: 700, borderRadius: 12, border: 'none', cursor: 'pointer',
                        opacity: loading ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}>
                        {loading ? <div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'black', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <Zap size={16} />}
                        Create Agent
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title={`Step ${step + 1} of 5`}>
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your agent..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <button onClick={back} disabled={step === 0} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', background: 'var(--bg-input)', color: 'var(--text-secondary)',
                fontWeight: 600, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer',
                opacity: step === 0 ? 0.3 : 1,
              }}><ChevronLeft size={16} /> Back</button>
              {step < 4 ? (
                <button onClick={next} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '10px 20px', background: '#7C3AED', color: 'white',
                  fontWeight: 600, fontSize: 14, borderRadius: 10, border: 'none', cursor: 'pointer',
                }}>Next <ChevronRight size={16} /></button>
              ) : (
                <GenerateButton onClick={createAgent} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Agent'}
                </GenerateButton>
              )}
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
