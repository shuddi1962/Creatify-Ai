'use client';

import { useState } from 'react';
import { Server, Copy, Check, Link2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const INTEGRATIONS = [
  { name: 'Claude', icon: '🤖', desc: 'Anthropic Claude for reasoning and content generation', connected: false },
  { name: 'Cursor', icon: '✏️', desc: 'AI-powered code editor integration', connected: false },
  { name: 'OpenAI Codex', icon: '💻', desc: 'OpenAI Codex for developer workflows', connected: false },
  { name: 'Windsurf', icon: '🌊', desc: 'Windsurf AI IDE integration', connected: false },
  { name: 'Roo Cline', icon: '🔌', desc: 'VS Code extension for AI agents', connected: false },
];
const OPTIONS = INTEGRATIONS.map(i => i.name);

export default function MCPPage() {
  const [serverUrl, setServerUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [option, setOption] = useState('Claude');
  const [prompt, setPrompt] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const connect = (name) => {
    setIntegrations(integrations.map(i => i.name === name ? { ...i, connected: true } : i));
    toast.success(`${name} connected!`);
  };

  const disconnect = (name) => {
    setIntegrations(integrations.map(i => i.name === name ? { ...i, connected: false } : i));
    toast.success(`${name} disconnected`);
  };

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="INTEGRATIONS">
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
                MCP SERVER CONNECTION
              </h1>
              <div style={{ width: '100%', maxWidth: 700 }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24, marginBottom: 24 }}>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>MCP Server Configuration</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>MCP Server URL</label>
                      <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} placeholder="https://api.example.com/mcp" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Auth Token</label>
                      <input type="password" value={authToken} onChange={e => setAuthToken(e.target.value)} placeholder="Enter your auth token" style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', outline: 'none' }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 16, background: '#0a0a0a', borderRadius: 12, padding: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Connection String</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <code style={{ flex: 1, color: '#7C3AED', fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all' }}>{serverUrl ? `${serverUrl} --auth ${authToken.slice(0, 8)}...` : 'Configure above to generate connection string'}</code>
                      <button onClick={() => handleCopy(serverUrl)} style={{ padding: 8, background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}>{copied ? <Check size={14} /> : <Copy size={14} />}</button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>Available Integrations</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {integrations.map(int => (
                      <div key={int.name} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <span style={{ fontSize: 24 }}>{int.icon}</span>
                          <div>
                            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{int.name}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{int.desc}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                          {int.connected ? (
                            <>
                              <span style={{ fontSize: 10, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} /> Connected</span>
                              <button onClick={() => disconnect(int.name)} style={{ padding: '6px 12px', background: 'var(--bg-input)', color: 'red', fontSize: 12, borderRadius: 8, border: 'none', cursor: 'pointer' }}>Disconnect</button>
                            </>
                          ) : (
                            <button onClick={() => connect(int.name)} style={{
                              padding: '6px 16px', background: '#CCFF00', color: 'black',
                              fontSize: 12, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: 4,
                            }}><Link2 size={12} /> Connect</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Controls">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Search integrations..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={() => handleCopy(serverUrl)}>Copy Config</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
