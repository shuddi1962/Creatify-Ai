'use client';

import { useState } from 'react';
import { GitMerge, Play, Save, FolderOpen, ZoomIn, ZoomOut, Plus, Share2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const NODE_CATEGORIES = ['Input', 'Generate Image', 'Generate Video', 'Audio', 'Transform', 'Output', 'Logic', 'Data'];
const SAMPLE_NODES = [
  { id: 'n1', x: 80, y: 120, type: 'Input', label: 'Text Input', color: '#7C3AED' },
  { id: 'n2', x: 350, y: 100, type: 'Generate Image', label: 'Flux Model', color: '#7C3AED' },
  { id: 'n3', x: 620, y: 100, type: 'Transform', label: 'Upscale', color: '#F59E0B' },
  { id: 'n4', x: 350, y: 280, type: 'Generate Video', label: 'Seedance', color: '#10B981' },
  { id: 'n5', x: 620, y: 280, type: 'Output', label: 'Save to Media', color: '#CCFF00' },
];

export default function CanvasPage() {
  const [nodes, setNodes] = useState(SAMPLE_NODES);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  const addNode = (type) => {
    const newNode = { id: `n${Date.now()}`, x: 300 + Math.random() * 200, y: 150 + Math.random() * 150, type, label: type, color: '#7C3AED' };
    setNodes([...nodes, newNode]);
    toast.success(`${type} node added`);
  };

  const handleRun = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Workflow executed!'); }, 3000);
  };

  const handleSave = () => toast.success('Workflow saved!');
  const handleLoad = () => toast.success('Loading workflow...');
  const handleNew = () => { setNodes([]); toast.success('New canvas'); };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={GitMerge} badge="NEW" title="WORKFLOW CANVAS" subtitle="Infinite visual canvas for building and running AI workflow chains" />
      
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex gap-2">
            <button onClick={handleNew} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm rounded-lg hover:text-white flex items-center gap-2 transition-all"><Plus size={14} /> New</button>
            <button onClick={handleLoad} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm rounded-lg hover:text-white flex items-center gap-2 transition-all"><FolderOpen size={14} /> Load</button>
            <button onClick={handleSave} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm rounded-lg hover:text-white flex items-center gap-2 transition-all"><Save size={14} /> Save</button>
            <button onClick={() => toast.success('Share link copied!')} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm rounded-lg hover:text-white flex items-center gap-2 transition-all"><Share2 size={14} /> Share</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#888] hover:text-white"><ZoomOut size={14} /></button>
            <span className="text-[#555] text-xs px-2">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#888] hover:text-white"><ZoomIn size={14} /></button>
            <button onClick={handleRun} disabled={loading} className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 flex items-center gap-2 transition-all">
              {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Play size={14} />}
              Run Workflow
            </button>
          </div>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden">
          <div className="flex">
            <div className="w-48 border-r border-white/[0.08] p-3 min-h-[500px]">
              <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest mb-3">Node Library</p>
              {NODE_CATEGORIES.map(cat => (
                <div key={cat} className="mb-2">
                  <p className="text-[9px] text-[#333] uppercase mb-1">{cat}</p>
                  <button onClick={() => addNode(cat)} className="w-full text-left px-2 py-1 text-xs text-[#888] hover:text-white hover:bg-[#1a1a1a] rounded transition-all">+ Add</button>
                </div>
              ))}
            </div>
            <div className="flex-1 relative overflow-hidden" style={{ minHeight: '500px', background: 'repeating-linear-gradient(0deg, #0a0a0a 0px, #0a0a0a 19px, #111 19px, #111 20px), repeating-linear-gradient(90deg, #0a0a0a 0px, #0a0a0a 19px, #111 19px, #111 20px)' }}>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                {nodes.map(node => (
                  <div key={node.id} onClick={() => setSelectedNode(node.id)} className={`absolute w-40 bg-[#1a1a1a] rounded-xl border-2 cursor-pointer transition-all ${selectedNode === node.id ? 'border-[#CCFF00] shadow-lg shadow-[#CCFF00]/20' : 'border-white/[0.08] hover:border-[#333]'}`} style={{ left: node.x, top: node.y }}>
                    <div className="w-full h-1 rounded-t-xl" style={{ backgroundColor: node.color }} />
                    <div className="p-3">
                      <p className="text-[10px] text-[#555] uppercase">{node.type}</p>
                      <p className="text-white text-sm font-semibold">{node.label}</p>
                    </div>
                  </div>
                ))}
                {nodes.length > 1 && (
                  <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
                    <line x1={nodes[0].x + 80} y1={nodes[0].y + 40} x2={nodes[1].x} y2={nodes[1].y + 40} stroke="#333" strokeWidth="2" strokeDasharray="4 2" />
                    <line x1={nodes[1].x + 80} y1={nodes[1].y + 40} x2={nodes[2].x} y2={nodes[2].y + 40} stroke="#333" strokeWidth="2" strokeDasharray="4 2" />
                    <line x1={nodes[0].x + 80} y1={nodes[0].y + 60} x2={nodes[3].x} y2={nodes[3].y + 40} stroke="#333" strokeWidth="2" strokeDasharray="4 2" />
                    <line x1={nodes[3].x + 80} y1={nodes[3].y + 40} x2={nodes[4].x} y2={nodes[4].y + 40} stroke="#333" strokeWidth="2" strokeDasharray="4 2" />
                  </svg>
                )}
              </div>
              {nodes.length === 0 && <div className="absolute inset-0 flex items-center justify-center"><p className="text-[#444] text-sm">Click nodes from the library to add them</p></div>}
            </div>
            {selectedNode && (
              <div className="w-64 border-l border-white/[0.08] p-4">
                <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest mb-3">Node Settings</p>
                {(() => {
                  const node = nodes.find(n => n.id === selectedNode);
                  return (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] text-[#555] uppercase block mb-1">Label</label>
                        <input defaultValue={node.label} className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-[9px] text-[#555] uppercase block mb-1">Type</label>
                        <p className="text-xs text-[#888]">{node.type}</p>
                      </div>
                      <button onClick={() => setNodes(nodes.filter(n => n.id !== selectedNode))} className="w-full px-3 py-2 bg-red-500/20 text-red-500 text-xs rounded-lg hover:bg-red-500/30">Remove Node</button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}