'use client';

import { useState } from 'react';
import { GitBranch, Play, Save, FolderOpen, Plus, GripVertical } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const STEPS = [
  { id: 1, name: 'Text Input', type: 'Input', desc: 'Enter your prompt' },
  { id: 2, name: 'Flux Model', type: 'Generate Image', desc: 'Generate image' },
  { id: 3, name: 'Upscale', type: 'Transform', desc: 'Enhance quality' },
  { id: 4, name: 'Save', type: 'Output', desc: 'Export result' },
];
const OPTIONS = ['Text Input', 'Generate Image', 'Transform', 'Output'];

export default function BuilderPage() {
  const [steps, setSteps] = useState(STEPS);
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState('Text Input');
  const [prompt, setPrompt] = useState('');

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), name: 'New Step', type: 'Transform', desc: 'Configure step' }]);
  };

  const removeStep = (id) => {
    if (steps.length > 1) setSteps(steps.filter(s => s.id !== id));
  };

  const handleRun = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Workflow executed!'); }, 3000);
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="STEP TYPES">
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
            <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '40px' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
                color: 'transparent',
                background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                WORKFLOW BUILDER
              </h1>
              <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <button onClick={() => { setSteps([...STEPS]); toast.success('Reset'); }} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', background: 'var(--bg-input)',
                    color: 'var(--text-secondary)', fontSize: 13, borderRadius: 8,
                    border: 'none', cursor: 'pointer',
                  }}><Plus size={14} /> New</button>
                  <button onClick={() => toast.success('Loading workflow...')} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', background: 'var(--bg-input)',
                    color: 'var(--text-secondary)', fontSize: 13, borderRadius: 8,
                    border: 'none', cursor: 'pointer',
                  }}><FolderOpen size={14} /> Load</button>
                  <button onClick={() => toast.success('Workflow saved!')} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', background: 'var(--bg-input)',
                    color: 'var(--text-secondary)', fontSize: 13, borderRadius: 8,
                    border: 'none', cursor: 'pointer',
                  }}><Save size={14} /> Save</button>
                  <button onClick={handleRun} disabled={loading} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 24px', background: '#CCFF00', color: 'black',
                    fontWeight: 700, fontSize: 14, borderRadius: 12, border: 'none', cursor: 'pointer',
                    opacity: loading ? 0.5 : 1, marginLeft: 'auto',
                  }}>
                    {loading ? <div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'black', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <Play size={14} />}
                    Run Workflow
                  </button>
                </div>

                <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {steps.map((step, idx) => (
                      <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#0a0a0a', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 16 }}>
                        <div style={{ cursor: 'grab', color: 'var(--text-muted)' }}><GripVertical size={16} /></div>
                        <div style={{ width: 24, height: 24, background: '#7C3AED', color: 'white', fontSize: 12, fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{idx + 1}</div>
                        <div style={{ flex: 1 }}>
                          <input defaultValue={step.name} style={{ width: '100%', background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, border: 'none', outline: 'none' }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4 }}>{step.type}</span>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{step.desc}</span>
                          </div>
                        </div>
                        {steps.length > 1 && (
                          <button onClick={() => removeStep(step.id)} style={{ padding: 8, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>×</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={addStep} style={{
                    width: '100%', marginTop: 12, padding: '12px', border: '2px dashed var(--border-default)',
                    borderRadius: 12, color: 'var(--text-muted)', fontSize: 14, background: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                    <Plus size={14} /> Add Step
                  </button>
                </div>
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Controls">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your workflow..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={handleRun} disabled={loading}>
                {loading ? 'Running...' : 'Run Workflow'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
