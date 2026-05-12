'use client';

import { useState } from 'react';
import { Code, Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const ENDPOINTS = [
  { method: 'POST', path: '/v1/image/generate', desc: 'Generate an image from text prompt', auth: 'Bearer token' },
  { method: 'POST', path: '/v1/video/generate', desc: 'Generate a video clip', auth: 'Bearer token' },
  { method: 'POST', path: '/v1/audio/voiceover', desc: 'Generate voiceover from text', auth: 'Bearer token' },
  { method: 'POST', path: '/v1/bulk/generate', desc: 'Run bulk generation job', auth: 'Bearer token' },
  { method: 'GET', path: '/v1/jobs/:id', desc: 'Check job status', auth: 'Bearer token' },
  { method: 'GET', path: '/v1/media', desc: 'List all media assets', auth: 'Bearer token' },
  { method: 'POST', path: '/v1/webhooks', desc: 'Register webhook endpoint', auth: 'Bearer token' },
  { method: 'DELETE', path: '/v1/jobs/:id', desc: 'Cancel a running job', auth: 'Bearer token' },
];
const SECTIONS = ['Authentication', 'Image Endpoints', 'Video Endpoints', 'Audio Endpoints', 'Bulk Endpoints', 'Webhooks', 'Rate Limits'];
const OPTIONS = SECTIONS;

export default function APIPage() {
  const [apiKey, setApiKey] = useState('sk-creatify-xxxx-xxxx-xxxx-xxxx');
  const [showKey, setShowKey] = useState(false);
  const [section, setSection] = useState('Authentication');
  const [prompt, setPrompt] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  const filteredEndpoints = ENDPOINTS.filter(e => {
    if (section === 'Image Endpoints') return e.path.includes('image');
    if (section === 'Video Endpoints') return e.path.includes('video');
    if (section === 'Audio Endpoints') return e.path.includes('audio');
    if (section === 'Bulk Endpoints') return e.path.includes('bulk');
    if (section === 'Webhooks') return e.path.includes('webhook');
    return false;
  });

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="SECTIONS">
            {OPTIONS.map(p => (
              <button key={p} onClick={() => setSection(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: section === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: section === p ? 'var(--accent-text)' : 'var(--text-secondary)',
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
                API ACCESS
              </h1>
              <div style={{ width: '100%', maxWidth: 800 }}>
                {section === 'Authentication' && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>Authentication</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>All API requests require a Bearer token in the Authorization header.</p>
                    <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Your API Key</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <code style={{ flex: 1, color: '#7C3AED', fontSize: 14, fontFamily: 'monospace' }}>{showKey ? apiKey : '•'.repeat(32)}</code>
                        <button onClick={() => setShowKey(!showKey)} style={{ padding: 8, background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}>{showKey ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                        <button onClick={() => handleCopy(apiKey)} style={{ padding: 8, background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}><Copy size={14} /></button>
                        <button onClick={() => { setApiKey(`sk-creatify-${Date.now()}`); toast.success('Key regenerated!'); }} style={{ padding: 8, background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}><RefreshCw size={14} /></button>
                      </div>
                    </div>
                    <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 16 }}>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Example Request</p>
                      <pre style={{ color: '#10B981', fontSize: 12, fontFamily: 'monospace', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{`curl -X GET https://api.creatify.ai/v1/image/generate \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "a sunset", "model": "flux"}'`}</pre>
                    </div>
                  </div>
                )}

                {filteredEndpoints.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>{section}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {filteredEndpoints.map((ep, i) => (
                        <div key={i} style={{ background: '#0a0a0a', borderRadius: 12, padding: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                              background: ep.method === 'GET' ? 'rgba(16,185,129,0.2)' : 'rgba(124,58,237,0.2)',
                              color: ep.method === 'GET' ? '#10B981' : '#7C3AED',
                            }}>{ep.method}</span>
                            <code style={{ color: '#ccc', fontSize: 12, fontFamily: 'monospace' }}>{ep.path}</code>
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{ep.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'Rate Limits' && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>Rate Limits</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                        <p style={{ color: '#CCFF00', fontSize: 24, fontWeight: 700 }}>100</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>req/min</p>
                      </div>
                      <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                        <p style={{ color: '#CCFF00', fontSize: 24, fontWeight: 700 }}>1000</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>req/hour</p>
                      </div>
                      <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                        <p style={{ color: '#CCFF00', fontSize: 24, fontWeight: 700 }}>10000</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>req/day</p>
                      </div>
                    </div>
                  </div>
                )}

                {section !== 'Authentication' && section !== 'Rate Limits' && filteredEndpoints.length === 0 && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24, textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No endpoints found for this section.</p>
                  </div>
                )}

                <button onClick={() => toast.success('Opening full API docs...')} style={{
                  width: '100%', marginTop: 24, padding: '12px 24px',
                  background: '#CCFF00', color: 'black', fontWeight: 700,
                  borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 16,
                }}>View Full API Documentation</button>
              </div>
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="API">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Search endpoints..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <GenerateButton onClick={() => handleCopy(apiKey)}>Copy API Key</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
