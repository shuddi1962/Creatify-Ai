'use client';

import { useState } from 'react';
import { Terminal, Copy, Download, Check } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const COMMANDS = [
  { cmd: 'creatify init', desc: 'Initialize new project' },
  { cmd: 'creatify generate image "prompt"', desc: 'Generate image from prompt' },
  { cmd: 'creatify generate video --model seedance', desc: 'Generate video' },
  { cmd: 'creatify bulk --file data.csv', desc: 'Run bulk generation from CSV' },
  { cmd: 'creatify agent run my-agent', desc: 'Run an AI agent' },
];
const OPTIONS = ['Installation', 'Commands', 'Terminal', 'Setup'];

export default function CLIPage() {
  const [copied, setCopied] = useState(null);
  const [apiKey, setApiKey] = useState('sk-creatify-xxxx-xxxx-xxxx');
  const [option, setOption] = useState('Installation');
  const [prompt, setPrompt] = useState('');

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="SECTIONS">
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
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                CLI TOOL
              </h1>
              <div style={{ width: '100%', maxWidth: 700 }}>
                {option === 'Installation' && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>Installation</h3>
                    <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <code style={{ color: '#7C3AED', fontSize: 14, fontFamily: 'monospace' }}>npm install -g @creatify/cli</code>
                      <button onClick={() => handleCopy('npm install -g @creatify/cli', 'install')} style={{ padding: 8, background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}>{copied === 'install' ? <Check size={14} /> : <Copy size={14} />}</button>
                    </div>
                  </div>
                )}

                {option === 'Commands' && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>Quick Start Commands</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {COMMANDS.map((c, i) => (
                        <div key={i} style={{ background: '#0a0a0a', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <code style={{ color: '#10B981', fontSize: 14, fontFamily: 'monospace' }}>{c.cmd}</code>
                            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{c.desc}</p>
                          </div>
                          <button onClick={() => handleCopy(c.cmd, i)} style={{ padding: 8, background: 'none', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>{copied === i ? <Check size={14} /> : <Copy size={14} />}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {option === 'Terminal' && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>Interactive Terminal</h3>
                    <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 16, fontFamily: 'monospace', fontSize: 14 }}>
                      <p style={{ color: 'var(--text-muted)' }}>$ creatify init</p>
                      <p style={{ color: '#10B981' }}>Project initialized: /my-creatify-project</p>
                      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>$ creatify generate image "a sunset over mountains"</p>
                      <p style={{ color: '#7C3AED' }}>Generating image... 100%</p>
                      <p style={{ color: '#10B981' }}>Saved to: ./output/image_001.png</p>
                      <p style={{ color: 'var(--text-muted)', marginTop: 8, cursor: 'pointer' }}>$ <span style={{ animation: 'pulse 1s infinite' }}>_</span></p>
                    </div>
                  </div>
                )}

                {option === 'Setup' && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>API Key Setup</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input value={apiKey} onChange={e => setApiKey(e.target.value)} style={{ flex: 1, background: '#0a0a0a', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 14, outline: 'none' }} />
                      <button onClick={() => { navigator.clipboard.writeText(apiKey); toast.success('API key copied!'); }} style={{ padding: '12px 16px', background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><Copy size={14} /> Copy</button>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>Configure with: <code style={{ color: '#7C3AED' }}>creatify config set api-key YOUR_KEY</code></p>
                    <button onClick={() => toast.success('Downloading CLI...')} style={{
                      width: '100%', marginTop: 16, padding: '12px 24px',
                      background: '#CCFF00', color: 'black', fontWeight: 700,
                      borderRadius: 12, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}><Download size={16} /> Download CLI</button>
                  </div>
                )}
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="CLI">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Type a command to try..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={() => toast.success('Downloading CLI...')}>Download CLI</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
