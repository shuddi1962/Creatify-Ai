'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const WORKFLOW_TABS = [
  { id: 'canvas', label: 'Canvas', desc: 'Infinite visual canvas for building AI workflow chains', icon: '🎨' },
  { id: 'builder', label: 'Node Builder', desc: 'Drag-and-drop node-based AI pipeline builder', icon: '🔧' },
  { id: 'mine', label: 'My Workflows', desc: 'All your saved, pinned, and recent workflow pipelines', icon: '📁' },
  { id: 'templates', label: 'Templates', desc: 'Start instantly from pre-built workflow templates', icon: '📋' },
  { id: 'community', label: 'Community', desc: 'Browse and run workflows published by other creators', icon: '🌍' },
  { id: 'playground', label: 'Playground', desc: 'Run any workflow interactively with a live form UI', icon: '🎮' },
  { id: 'scheduled', label: 'Scheduled Runs', desc: 'Set any workflow to run automatically on a schedule', icon: '⏰' },
  { id: 'share', label: 'Share Workflow', desc: 'Publish your workflow pipeline for others to use', icon: '📤' },
];

const TEMPLATES = [
  { id: 't1', name: 'Image to Video Pipeline', category: 'Video', runs: 1250 },
  { id: 't2', name: 'Bulk Image Generator', category: 'Image', runs: 890 },
  { id: 't3', name: 'Lip Sync Automation', category: 'Audio', runs: 670 },
  { id: 't4', name: 'Social Media Scheduler', category: 'Marketing', runs: 450 },
  { id: 't5', name: 'Content Repurposer', category: 'Content', runs: 320 },
  { id: 't6', name: 'AI Video Editor', category: 'Video', runs: 280 },
];

export default function WorkflowStudioTabs({ initialTab, apiKey, isHeaderVisible, onToggleHeader }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'canvas');
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const router = useRouter();

  const renderCanvas = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-[#14B8A6]/20 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Visual Workflow Builder</h3>
            <p className="text-[#9CA3AF] max-w-md">Drag and drop nodes to create powerful AI pipelines. Connect image generation, video creation, lip sync, and more.</p>
          </div>
          <button className="px-8 py-3 rounded-xl bg-[#14B8A6] text-white font-bold hover:bg-[#0D9488] transition-all">
            Open Canvas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {['Image Input', 'Text Prompt', 'Image Generate', 'Video Generate', 'Lip Sync', 'Audio Generate', 'Output', 'Condition'].map((node) => (
          <div key={node} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center cursor-move hover:bg-white/10">
            <div className="text-sm text-white">{node}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBuilder = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
          <h3 className="text-lg font-bold text-white">Node-Based Builder</h3>
          <p className="text-[#9CA3AF]">Create complex workflows with customizable nodes</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['Input Nodes', 'Processing', 'Output Nodes'].map((cat) => (
          <div key={cat} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-sm font-medium text-white mb-3">{cat}</h4>
            <div className="space-y-2">
              {['Text', 'Image', 'Audio', 'Video', 'API'].map((type) => (
                <div key={type} className="p-2 rounded-lg bg-black/20 text-xs text-[#9CA3AF] cursor-move hover:text-white">{type} Node</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMine = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">My Workflows</h3>
        <button className="px-4 py-2 rounded-lg bg-[#14B8A6] text-white text-sm font-medium hover:bg-[#0D9488]">
          + New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white/5 rounded-xl border border-white/10">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="mx-auto mb-4"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <div className="text-[#9CA3AF]">No workflows yet. Create your first one!</div>
          </div>
        ) : workflows.map((wf) => (
          <div key={wf.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#14B8A6]/50 cursor-pointer">
            <div className="aspect-video bg-black/20 rounded-lg mb-3" />
            <div className="text-sm font-medium text-white">{wf.name}</div>
            <div className="text-xs text-[#9CA3AF]">{wf.nodes} nodes • {wf.runs} runs</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Workflow Templates</h3>
        <div className="flex gap-2">
          {['All', 'Video', 'Image', 'Audio', 'Marketing'].map((cat) => (
            <button key={cat} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9CA3AF] hover:text-white">{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#14B8A6]/50 cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-[#14B8A6]/20 to-[#14B8A6]/5 rounded-lg mb-3 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div className="text-sm font-medium text-white">{t.name}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[#9CA3AF]">{t.category}</span>
              <span className="text-xs text-[#14B8A6]">{t.runs} runs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Community Workflows</h3>
        <input type="search" placeholder="Search workflows..." className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.slice(0, 3).map((t) => (
          <div key={t.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-3" />
            <div className="text-sm font-medium text-white">{t.name}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 rounded-full bg-white/20" />
              <span className="text-xs text-[#9CA3AF]">Community</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlayground = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
        <h3 className="text-lg font-bold text-white mb-4">Workflow Playground</h3>
        <p className="text-[#9CA3AF] mb-6">Run any workflow with live input form</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">Select Workflow</label>
            <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
              <option>Choose a workflow...</option>
              {TEMPLATES.map((t) => <option key={t.id}>{t.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">Prompt</label>
            <textarea rows={3} placeholder="Enter your prompt..." className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
          </div>

          <button className="px-8 py-3 rounded-xl bg-[#14B8A6] text-white font-bold hover:bg-[#0D9488] transition-all">
            Run Workflow
          </button>
        </div>
      </div>
    </div>
  );

  const renderScheduled = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Scheduled Runs</h3>
        <button className="px-4 py-2 rounded-lg bg-[#14B8A6] text-white text-sm font-medium hover:bg-[#0D9488]">
          + New Schedule
        </button>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="mx-auto mb-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <div className="text-[#9CA3AF]">No scheduled workflows yet</div>
      </div>
    </div>
  );

  const renderShare = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
        <h3 className="text-lg font-bold text-white mb-4">Share Your Workflow</h3>
        <p className="text-[#9CA3AF] mb-6">Publish your workflow for the community to use</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">Workflow Name</label>
            <input type="text" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">Description</label>
            <textarea rows={3} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-2">Category</label>
            <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
              <option>Video</option>
              <option>Image</option>
              <option>Audio</option>
              <option>Marketing</option>
            </select>
          </div>
          <button className="px-8 py-3 rounded-xl bg-[#14B8A6] text-white font-bold hover:bg-[#0D9488] transition-all">
            Publish Workflow
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'canvas': return renderCanvas();
      case 'builder': return renderBuilder();
      case 'mine': return renderMine();
      case 'templates': return renderTemplates();
      case 'community': return renderCommunity();
      case 'playground': return renderPlayground();
      case 'scheduled': return renderScheduled();
      case 'share': return renderShare();
      default: return renderCanvas();
    }
  };

  return (
    <div className="min-h-full bg-[#0A0F1E] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Workflows</h1>
        <p className="text-[#9CA3AF]">Chain multiple AI operations together in reusable pipelines</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {WORKFLOW_TABS.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); router.push(`/studio/workflows/${tab.id}`); }} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#14B8A6] text-white' : 'bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white'}`}>
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