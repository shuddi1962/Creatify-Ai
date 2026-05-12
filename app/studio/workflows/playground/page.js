'use client';

import { useState } from 'react';
import { FlaskConical, Play, ChevronDown } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const MY_WORKFLOWS = [
  { id: 1, name: 'Image to Cinematic Video', inputs: [{ name: 'prompt', type: 'text' }, { name: 'model', type: 'select' }] },
  { id: 2, name: 'Product Showcase Pipeline', inputs: [{ name: 'product_url', type: 'text' }, { name: 'style', type: 'select' }, { name: 'count', type: 'number' }] },
];
const OPTIONS = MY_WORKFLOWS.map(w => w.name);

export default function PlaygroundPage() {
  const [workflowId, setWorkflowId] = useState(MY_WORKFLOWS[0].id);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [option, setOption] = useState(MY_WORKFLOWS[0].name);
  const [prompt, setPrompt] = useState('');

  const workflow = MY_WORKFLOWS.find(w => w.id === workflowId);

  const handleSelectWorkflow = (name) => {
    setOption(name);
    const wf = MY_WORKFLOWS.find(w => w.name === name);
    if (wf) setWorkflowId(wf.id);
  };

  const runWorkflow = () => {
    setLoading(true);
    setTimeout(() => {
      setResults({ status: 'success', output: 'Workflow completed! Output saved to Media Library.' });
      setLoading(false);
      toast.success('Workflow completed!');
    }, 3000);
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="WORKFLOWS">
            {OPTIONS.map(p => (
              <button key={p} onClick={() => handleSelectWorkflow(p)}
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
                WORKFLOW PLAYGROUND
              </h1>
              <div style={{ width: '100%', maxWidth: 700 }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24, marginBottom: 24 }}>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>Workflow Inputs</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {workflow?.inputs.map(input => (
                      <div key={input.name}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>{input.name}</label>
                        {input.type === 'text' && (
                          <input value={values[input.name] || ''} onChange={e => setValues({ ...values, [input.name]: e.target.value })} placeholder={`Enter ${input.name}...`} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }} />
                        )}
                        {input.type === 'select' && (
                          <select value={values[input.name] || ''} onChange={e => setValues({ ...values, [input.name]: e.target.value })} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }}>
                            <option value="">Select...</option>
                            <option>Option 1</option><option>Option 2</option>
                          </select>
                        )}
                        {input.type === 'number' && (
                          <input type="number" value={values[input.name] || ''} onChange={e => setValues({ ...values, [input.name]: e.target.value })} placeholder="Enter number..." style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {results && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>Results</h3>
                    <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 16 }}>
                      <p style={{ color: '#10B981', fontSize: 14, fontFamily: 'monospace' }}>{results.output}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Controls">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe what to generate..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={runWorkflow} disabled={loading}>
                {loading ? 'Running...' : 'Run Workflow'}
              </GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
