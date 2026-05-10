'use client';

import { useState } from 'react';
import { Terminal, Copy, Download, Check } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const COMMANDS = [
  { cmd: 'creatify init', desc: 'Initialize new project' },
  { cmd: 'creatify generate image "prompt"', desc: 'Generate image from prompt' },
  { cmd: 'creatify generate video --model seedance', desc: 'Generate video' },
  { cmd: 'creatify bulk --file data.csv', desc: 'Run bulk generation from CSV' },
  { cmd: 'creatify agent run my-agent', desc: 'Run an AI agent' },
];

export default function CLIPage() {
  const [copied, setCopied] = useState(null);
  const [apiKey, setApiKey] = useState('sk-creatify-xxxx-xxxx-xxxx');

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Terminal} title="CLI TOOL" subtitle="Terminal-based access to all generation features for developers" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-white font-bold mb-4">Installation</h3>
          <div className="bg-[#0a0a0a] rounded-xl p-4 flex items-center justify-between">
            <code className="text-[#06B6D4] text-sm font-mono">npm install -g @creatify/cli</code>
            <button onClick={() => handleCopy('npm install -g @creatify/cli', 'install')} className="p-2 bg-[#1a1a1a] text-[#888] rounded-lg hover:text-white transition-all">{copied === 'install' ? <Check size={14} /> : <Copy size={14} />}</button>
          </div>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-white font-bold mb-4">Quick Start</h3>
          <div className="space-y-2">
            {COMMANDS.map((c, i) => (
              <div key={i} className="bg-[#0a0a0a] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <code className="text-[#10B981] text-sm font-mono">{c.cmd}</code>
                  <p className="text-[#555] text-xs mt-1">{c.desc}</p>
                </div>
                <button onClick={() => handleCopy(c.cmd, i)} className="p-2 text-[#444] hover:text-white transition-all">{copied === i ? <Check size={14} /> : <Copy size={14} />}</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-white font-bold mb-4">Interactive Terminal</h3>
          <div className="bg-[#0a0a0a] rounded-xl p-4 font-mono text-sm">
            <p className="text-[#555]">$ creatify init</p>
            <p className="text-[#10B981]">Project initialized: /my-creatify-project</p>
            <p className="text-[#555] mt-2">$ creatify generate image "a sunset over mountains"</p>
            <p className="text-[#06B6D4]">Generating image... 100%</p>
            <p className="text-[#10B981]">Saved to: ./output/image_001.png</p>
            <p className="text-[#555] mt-2 cursor-pointer">$ <span className="animate-pulse">_</span></p>
          </div>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
          <h3 className="text-white font-bold mb-4">API Key Setup</h3>
          <div className="flex items-center gap-3">
            <input value={apiKey} onChange={e => setApiKey(e.target.value)} className="flex-1 bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-[#555] font-mono text-sm focus:outline-none" />
            <button onClick={() => { navigator.clipboard.writeText(apiKey); toast.success('API key copied!'); }} className="px-4 py-3 bg-[#1a1a1a] text-[#888] rounded-xl hover:text-white transition-all flex items-center gap-2"><Copy size={14} /> Copy</button>
          </div>
          <p className="text-[#444] text-xs mt-2">Configure with: <code className="text-[#06B6D4]">creatify config set api-key YOUR_KEY</code></p>
        </div>

        <button onClick={() => toast.success('Downloading CLI...')} className="w-full px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] transition-all flex items-center justify-center gap-2"><Download size={16} /> Download CLI</button>
      </div>
    </div>
  );
}