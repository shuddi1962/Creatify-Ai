'use client';

import { useState } from 'react';
import { PanelLeftClose, Plus, Sparkles, Layers, Play, Save, Share2, FolderOpen, ZoomIn, ZoomOut, GitMerge } from 'lucide-react';

const NODE_CATEGORIES = [
  { name: 'INPUT', items: ['Text Input', 'Image Upload', 'Video Upload', 'Audio Upload'] },
  { name: 'GENERATE', items: ['Text to Image', 'Text to Video', 'Image to Video', 'Image to 3D'] },
  { name: 'TRANSFORM', items: ['Upscale', 'Remove BG', 'Inpaint', 'Outpaint', 'Style Transfer'] },
  { name: 'OUTPUT', items: ['Save to Media', 'Download', 'Export'] },
];

const SAMPLE_NODES = [
  { id: 'n1', x: 80, y: 120, category: 'INPUT', label: 'Text Input', color: '#6366f1' },
  { id: 'n2', x: 350, y: 100, category: 'GENERATE', label: 'Flux Model', color: '#6366f1' },
  { id: 'n3', x: 620, y: 100, category: 'TRANSFORM', label: 'Upscale', color: '#f59e0b' },
  { id: 'n4', x: 350, y: 280, category: 'GENERATE', label: 'Seedance', color: '#10b981' },
  { id: 'n5', x: 620, y: 280, category: 'OUTPUT', label: 'Save to Media', color: '#ccff00' },
];

export default function CanvasPage() {
  const [nodes, setNodes] = useState(SAMPLE_NODES);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);

  const addNode = (type) => {
    const newNode = { id: `n${Date.now()}`, x: 200 + Math.random() * 200, y: 120 + Math.random() * 200, category: type.toUpperCase(), label: type, color: '#6366f1' };
    setNodes([...nodes, newNode]);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      background: 'var(--bg-page)',
      overflow: 'hidden',
    }}>
      {/* ========== LEFT PANEL (240px) ========== */}
      <div style={{
        width: 240,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', fontSize: 13,
          }}>
            <PanelLeftClose size={16} />
            Hide
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--bg-input)', border: '1px solid var(--border-default)',
            borderRadius: 8, padding: '5px 10px', fontSize: 12,
            color: 'var(--text-secondary)', cursor: 'pointer',
          }}>
            <GitMerge size={12} /> Nodes
          </button>
        </div>

        <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.07em',
            padding: '0 4px 10px',
          }}>
            Node Library
          </div>

          {NODE_CATEGORIES.map(cat => (
            <div key={cat.name} style={{ marginBottom: 8 }}>
              <div style={{
                fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '4px 8px', marginBottom: 2,
              }}>
                {cat.name}
              </div>
              {cat.items.map(item => (
                <button key={item}
                  onClick={() => addNode(item)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '6px 10px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    borderRadius: 6, color: 'var(--text-secondary)', fontSize: 12,
                    textAlign: 'left', transition: 'all 100ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <Plus size={12} />
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ========== CENTER — INFINITE CANVAS ========== */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Tool bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 10px', fontSize: 12,
              background: 'var(--bg-input)', border: '1px solid var(--border-default)',
              borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer',
            }}><Plus size={12} /> New</button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 10px', fontSize: 12,
              background: 'var(--bg-input)', border: '1px solid var(--border-default)',
              borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer',
            }}><FolderOpen size={12} /> Load</button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 10px', fontSize: 12,
              background: 'var(--bg-input)', border: '1px solid var(--border-default)',
              borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer',
            }}><Save size={12} /> Save</button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 10px', fontSize: 12,
              background: 'var(--bg-input)', border: '1px solid var(--border-default)',
              borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer',
            }}><Share2 size={12} /> Share</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-input)', border: '1px solid var(--border-default)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <ZoomOut size={12} />
            </button>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 32, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-input)', border: '1px solid var(--border-default)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <ZoomIn size={12} />
            </button>
            <button style={{
              background: '#CCFF00', border: 'none', borderRadius: 8,
              padding: '7px 16px', fontSize: 13, fontWeight: 700, color: '#000',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Play size={12} /> RUN
            </button>
          </div>
        </div>

        {/* Infinite canvas */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}>
          <div style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: '100%', height: '100%',
          }}>
            {/* Connection lines */}
            {nodes.length > 1 && (
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="rgba(255,255,255,0.2)" />
                  </marker>
                </defs>
                {nodes.slice(0, -1).map((node, i) => (
                  <line key={i}
                    x1={node.x + 80} y1={node.y + 45}
                    x2={nodes[i + 1].x} y2={nodes[i + 1].y + 45}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    markerEnd="url(#arrowhead)"
                  />
                ))}
              </svg>
            )}

            {nodes.map(node => (
              <div key={node.id}
                onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                style={{
                  position: 'absolute', left: node.x, top: node.y,
                  width: 160,
                  background: 'var(--bg-elevated)',
                  border: `1.5px solid ${selectedNode === node.id ? '#CCFF00' : 'var(--border-subtle)'}`,
                  borderRadius: 10,
                  cursor: 'pointer',
                  boxShadow: selectedNode === node.id ? '0 0 20px rgba(204,255,0,0.15)' : 'none',
                  transition: 'all 150ms',
                  zIndex: 1,
                }}
              >
                <div style={{
                  height: 3,
                  background: node.color,
                  borderRadius: '8px 8px 0 0',
                }} />
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{node.category}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 2 }}>{node.label}</div>
                </div>
              </div>
            ))}

            {nodes.length === 0 && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 8, color: 'var(--text-muted)', fontSize: 13,
              }}>
                <Layers size={32} style={{ opacity: 0.3 }} />
                <span>Click nodes from the library to add them</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
