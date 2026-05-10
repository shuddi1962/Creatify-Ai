'use client';

import { useState } from 'react';
import { Server, Copy, Check, Link2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const INTEGRATIONS = [
  { name: 'Claude', icon: '🤖', desc: 'Anthropic Claude for reasoning and content generation', connected: false },
  { name: 'Cursor', icon: '✏️', desc: 'AI-powered code editor integration', connected: false },
  { name: 'OpenAI Codex', icon: '💻', desc: 'OpenAI Codex for developer workflows', connected: false },
  { name: 'Windsurf', icon: '🌊', desc: 'Windsurf AI IDE integration', connected: false },
  { name: 'Roo Cline', icon: '🔌', desc: 'VS Code extension for AI agents', connected: false },
];

export default function MCPPage() {
  const [serverUrl, setServerUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

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
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Server} badge="NEW" title="MCP SERVER CONNECTION" subtitle="Connect Creatify AI to Claude, OpenAI Codex, and other AI agent systems" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-white font-bold mb-4">MCP Server Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">MCP Server URL</label>
              <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} placeholder="https://api.example.com/mcp" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Auth Token</label>
              <input type="password" value={authToken} onChange={e => setAuthToken(e.target.value)} placeholder="Enter your auth token" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none" />
            </div>
          </div>
          <div className="mt-4 bg-[#0a0a0a] rounded-xl p-4">
            <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest mb-2">Connection String</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-[#7C3AED] text-xs font-mono break-all">{serverUrl ? `${serverUrl} --auth ${authToken.slice(0, 8)}...` : 'Configure above to generate connection string'}</code>
              <button onClick={() => handleCopy(serverUrl)} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all">{copied ? <Check size={14} /> : <Copy size={14} />}</button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Available Integrations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {integrations.map(int => (
              <div key={int.name} className="bg-[#111111] rounded-xl border border-white/[0.08] p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{int.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold">{int.name}</h4>
                    <p className="text-[#555] text-xs">{int.desc}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  {int.connected ? (
                    <>
                      <span className="text-[10px] text-[#10B981] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Connected</span>
                      <button onClick={() => disconnect(int.name)} className="px-3 py-1.5 bg-[#1a1a1a] text-red-500 text-xs rounded-lg hover:bg-red-500/20 transition-all">Disconnect</button>
                    </>
                  ) : (
                    <button onClick={() => connect(int.name)} className="px-4 py-1.5 bg-[#CCFF00] text-black text-xs font-bold rounded-lg hover:bg-[#B8FF00] transition-all flex items-center gap-1"><Link2 size={12} /> Connect</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}