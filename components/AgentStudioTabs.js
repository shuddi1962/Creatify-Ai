'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AGENT_TABS = [
  { id: 'create', label: 'Create Agent', desc: 'Build a custom AI agent for automated content generation' },
  { id: 'mine', label: 'My Agents', desc: 'View and manage all your active and saved AI agents' },
  { id: 'templates', label: 'Agent Templates', desc: 'Start from a pre-built agent template for common tasks' },
  { id: 'logs', label: 'Agent Logs', desc: 'View complete run history, errors, and output logs' },
  { id: 'mcp', label: 'MCP Server', desc: 'Connect to Claude, OpenAI Codex, and other AI agent systems' },
  { id: 'cli', label: 'CLI Tool', desc: 'Terminal-based batch generation for developers and power users' },
  { id: 'api', label: 'API Access', desc: 'REST API endpoints for all generation features with full docs' },
  { id: 'webhooks', label: 'Webhooks', desc: 'Trigger agent runs from any external system or event' },
];

const AGENT_TEMPLATES = [
  { id: 't1', name: 'Content Writer', description: 'Generates blog posts, articles, and social content' },
  { id: 't2', name: 'Video Script Writer', description: 'Creates video scripts with hooks and CTAs' },
  { id: 't3', name: 'Image Prompt Engineer', description: 'Optimizes prompts for better AI image generation' },
  { id: 't4', name: 'SEO Analyzer', description: 'Analyzes content and suggests SEO improvements' },
  { id: 't5', name: 'Social Media Manager', description: 'Creates and schedules social media posts' },
  { id: 't6', name: 'Translation Agent', description: 'Translates content between multiple languages' },
];

const MY_AGENTS = [
  { id: 'a1', name: 'Marketing Agent', status: 'active', runs: 145, lastRun: '2 hours ago' },
  { id: 'a2', name: 'Content Generator', status: 'active', runs: 89, lastRun: '1 day ago' },
  { id: 'a3', name: 'Image Optimizer', status: 'paused', runs: 56, lastRun: '3 days ago' },
];

const LOG_ENTRIES = [
  { id: 1, agent: 'Marketing Agent', action: 'Generated 5 social posts', status: 'success', time: '2 hours ago' },
  { id: 2, agent: 'Content Generator', action: 'Wrote blog post', status: 'success', time: '5 hours ago' },
  { id: 3, agent: 'Image Optimizer', action: 'Optimized 10 prompts', status: 'success', time: '1 day ago' },
  { id: 4, agent: 'Marketing Agent', action: 'API call failed', status: 'error', time: '1 day ago' },
];

export default function AgentStudioTabs({ initialTab, apiKey, isHeaderVisible, onToggleHeader }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'mine');
  const [agents, setAgents] = useState(MY_AGENTS);

  const router = useRouter();

  const renderCreate = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Create New Agent</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">Agent Name</label>
            <input type="text" placeholder="My AI Agent" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
          </div>
          
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">Description</label>
            <textarea rows={3} placeholder="What does this agent do?" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
          </div>

          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">Capabilities</label>
            <div className="grid grid-cols-3 gap-2">
              {['Image Generation', 'Video Generation', 'Text Writing', 'Audio Generation', 'Lip Sync', 'Data Analysis'].map((cap) => (
                <label key={cap} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs text-white">{cap}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">System Prompt</label>
            <textarea rows={4} placeholder="Instructions for your agent..." className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
          </div>

          <button className="px-8 py-3 rounded-xl bg-[#A855F7] text-white font-bold hover:bg-[#9333EA] transition-all">
            Create Agent
          </button>
        </div>
      </div>
    </div>
  );

  const renderMine = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">My Agents</h3>
        <button onClick={() => { setActiveTab('create'); router.push('/studio/agents/create'); }} className="px-4 py-2 rounded-lg bg-[#A855F7] text-white text-sm font-medium hover:bg-[#9333EA]">
          + New Agent
        </button>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#A855F7]/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{agent.name}</div>
                <div className="text-xs text-[#9CA3AF] mt-1">{agent.runs} runs • {agent.lastRun}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{agent.status}</span>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">Agent Templates</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENT_TEMPLATES.map((t) => (
          <div key={t.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#A855F7]/50 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#A855F7]/20 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div className="text-sm font-medium text-white">{t.name}</div>
            <div className="text-xs text-[#9CA3AF] mt-1">{t.description}</div>
            <button className="mt-3 px-4 py-2 rounded-lg bg-[#A855F7]/20 text-[#A855F7] text-xs font-medium hover:bg-[#A855F7]/30">
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Agent Logs</h3>
        <div className="flex gap-2">
          {['All', 'Success', 'Error'].map((f) => (
            <button key={f} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {LOG_ENTRIES.map((log) => (
          <div key={log.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-sm text-white">{log.agent}</div>
              <div className="text-xs text-[#9CA3AF]">{log.action}</div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded text-xs ${log.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{log.status}</span>
              <div className="text-[10px] text-[#9CA3AF] mt-1">{log.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMCP = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">MCP Server Connection</h3>
        <p className="text-[#9CA3AF] mb-6">Connect to Model Context Protocol servers for enhanced agent capabilities</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">Server URL</label>
            <input type="url" placeholder="https://mcp-server.example.com" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
          </div>
          
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">API Key</label>
            <input type="password" placeholder="Your MCP API key" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
          </div>

          <button className="px-8 py-3 rounded-xl bg-[#A855F7] text-white font-bold hover:bg-[#9333EA] transition-all">
            Connect Server
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['Claude', 'OpenAI Codex', 'Gemini', 'Anthropic', 'Custom'].map((server) => (
          <div key={server} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-sm font-medium text-white">{server}</div>
            <div className="text-xs text-[#9CA3AF] mt-1">Not connected</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCLI = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">CLI Tool</h3>
        <p className="text-[#9CA3AF] mb-4">Terminal-based batch generation for developers</p>

        <div className="font-mono text-sm text-[#9CA3AF] bg-black/50 p-4 rounded-lg overflow-x-auto">
          <pre>{`# Install CLI
npm install -g creatify-cli

# Generate images
creatify generate image "a sunset" --count 10

# Generate videos  
creatify generate video "a car driving" --duration 5

# Batch process
creatify batch process input.csv --type image`}</pre>
        </div>

        <button className="mt-4 px-8 py-3 rounded-xl bg-[#A855F7] text-white font-bold hover:bg-[#9333EA] transition-all">
          Download CLI
        </button>
      </div>
    </div>
  );

  const renderAPI = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">API Access</h3>
        <p className="text-[#9CA3AF] mb-6">REST API endpoints for programmatic access</p>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-black/50 border border-white/10">
            <div className="text-xs text-green-400 font-mono mb-2">GET /api/v1/generate/image</div>
            <div className="text-xs text-[#9CA3AF]">Generate AI images via API</div>
          </div>
          <div className="p-4 rounded-lg bg-black/50 border border-white/10">
            <div className="text-xs text-green-400 font-mono mb-2">POST /api/v1/generate/video</div>
            <div className="text-xs text-[#9CA3AF]">Generate AI videos via API</div>
          </div>
          <div className="p-4 rounded-lg bg-black/50 border border-white/10">
            <div className="text-xs text-green-400 font-mono mb-2">POST /api/v1/lipsync</div>
            <div className="text-xs text-[#9CA3AF]">Lip sync API endpoint</div>
          </div>
        </div>

        <button className="mt-4 px-8 py-3 rounded-xl bg-[#A855F7] text-white font-bold hover:bg-[#9333EA] transition-all">
          View Full Documentation
        </button>
      </div>
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Webhooks</h3>
        <button className="px-4 py-2 rounded-lg bg-[#A855F7] text-white text-sm font-medium hover:bg-[#9333EA]">
          + Add Webhook
        </button>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="mx-auto mb-4"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        <div className="text-[#9CA3AF]">No webhooks configured yet</div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'create': return renderCreate();
      case 'mine': return renderMine();
      case 'templates': return renderTemplates();
      case 'logs': return renderLogs();
      case 'mcp': return renderMCP();
      case 'cli': return renderCLI();
      case 'api': return renderAPI();
      case 'webhooks': return renderWebhooks();
      default: return renderMine();
    }
  };

  return (
    <div className="min-h-full bg-[#0A0F1E] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Agents</h1>
        <p className="text-[#9CA3AF]">Create and customize AI agents for automated content generation</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {AGENT_TABS.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); router.push(`/studio/agents/${tab.id}`); }} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#A855F7] text-white' : 'bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
        {renderContent()}
      </div>
    </div>
  );
}