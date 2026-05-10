'use client';

import { useState } from 'react';
import { Code, Copy, Eye, EyeOff, RefreshCw, Download } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

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

export default function APIPage() {
  const [apiKey, setApiKey] = useState('sk-creatify-xxxx-xxxx-xxxx-xxxx');
  const [showKey, setShowKey] = useState(false);
  const [section, setSection] = useState('Authentication');

  const sections = ['Authentication', 'Image Endpoints', 'Video Endpoints', 'Audio Endpoints', 'Bulk Endpoints', 'Webhooks', 'Rate Limits'];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Code} title="API ACCESS" subtitle="REST API endpoints for all generation features with full documentation" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <div className="space-y-1">
            {sections.map(s => (
              <button key={s} onClick={() => setSection(s)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${section === s ? 'bg-[#7C3AED] text-white' : 'text-[#555] hover:text-white hover:bg-[#1a1a1a]'}`}>{s}</button>
            ))}
          </div>

          <div className="space-y-6">
            {section === 'Authentication' && (
              <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
                <h3 className="text-white font-bold mb-4">Authentication</h3>
                <p className="text-[#555] text-sm mb-4">All API requests require a Bearer token in the Authorization header.</p>
                <div className="bg-[#0a0a0a] rounded-xl p-4 mb-4">
                  <p className="text-[10px] text-[#444] uppercase mb-2">Your API Key</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-[#06B6D4] text-sm font-mono">{showKey ? apiKey : '•'.repeat(32)}</code>
                    <button onClick={() => setShowKey(!showKey)} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white">{showKey ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                    <button onClick={() => handleCopy(apiKey)} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white"><Copy size={14} /></button>
                    <button onClick={() => { setApiKey(`sk-creatify-${Date.now()}`); toast.success('Key regenerated!'); }} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white"><RefreshCw size={14} /></button>
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-4">
                  <p className="text-[10px] text-[#444] uppercase mb-2">Example Request</p>
                  <pre className="text-[#10B981] text-xs font-mono overflow-x-auto">{`curl -X GET https://api.creatify.ai/v1/image/generate \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "a sunset", "model": "flux"}'`}</pre>
                </div>
              </div>
            )}

            {['Image Endpoints', 'Video Endpoints', 'Audio Endpoints', 'Bulk Endpoints', 'Webhooks', 'Rate Limits'].includes(section) && (
              <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
                <h3 className="text-white font-bold mb-4">{section}</h3>
                <div className="space-y-3">
                  {ENDPOINTS.filter(e => {
                    if (section === 'Image Endpoints') return e.path.includes('image');
                    if (section === 'Video Endpoints') return e.path.includes('video');
                    if (section === 'Audio Endpoints') return e.path.includes('audio');
                    if (section === 'Bulk Endpoints') return e.path.includes('bulk');
                    if (section === 'Webhooks') return e.path.includes('webhook');
                    return false;
                  }).map((ep, i) => (
                    <div key={i} className="bg-[#0a0a0a] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#7C3AED]/20 text-[#7C3AED]'}`}>{ep.method}</span>
                        <code className="text-[#ccc] text-xs font-mono">{ep.path}</code>
                      </div>
                      <p className="text-[#555] text-xs">{ep.desc}</p>
                    </div>
                  ))}
                </div>
                {section === 'Rate Limits' && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="bg-[#0a0a0a] rounded-xl p-4 text-center"><p className="text-[#CCFF00] text-lg font-bold">100</p><p className="text-[#555] text-xs">req/min</p></div>
                    <div className="bg-[#0a0a0a] rounded-xl p-4 text-center"><p className="text-[#CCFF00] text-lg font-bold">1000</p><p className="text-[#555] text-xs">req/hour</p></div>
                    <div className="bg-[#0a0a0a] rounded-xl p-4 text-center"><p className="text-[#CCFF00] text-lg font-bold">10000</p><p className="text-[#555] text-xs">req/day</p></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <button onClick={() => toast.success('Opening full API docs...')} className="mt-6 w-full px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] transition-all">View Full API Documentation</button>
      </div>
    </div>
  );
}