'use client';

import { useState } from 'react';
import { PanelLeftClose, ChevronDown, Sparkles, Film, Play, Image as ImageIcon, Layout as LayoutIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioDropdown from '@/components/StudioDropdown';

const VIDEO_LENGTH_OPTIONS = [
  { label: '15s', desc: 'Quick clip' },
  { label: '30s', desc: 'Standard short' },
  { label: '60s', desc: 'Long short' },
  { label: '2min', desc: 'Mini documentary' },
  { label: '5min', desc: 'Full content' },
];
const SHOTS_OPTIONS = ['3', '5', '8', '12'];
const STYLE_OPTIONS = ['Cinematic', 'Documentary', 'Commercial', 'Music Video', 'Short Film', 'Vlog'];

export default function SmartShotPage() {
  const [theme, setTheme] = useState('dark');
  const [prompt, setPrompt] = useState('');
  const [videoLength, setVideoLength] = useState('30s');
  const [numShots, setNumShots] = useState('5');
  const [visualStyle, setVisualStyle] = useState('Cinematic');
  const [autoStoryboard, setAutoStoryboard] = useState(true);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your video concept');
      return;
    }
    toast.success('Demo: Smart shot generation started!');
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
            <Film size={12} /> Scene
          </button>
        </div>

        <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.07em',
            padding: '0 4px 10px',
          }}>
            Storyboard
          </div>

          {[1, 2, 3, 4, 5].map(scene => (
            <button key={scene} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '8px 10px',
              background: scene === 1 ? 'var(--accent-bg)' : 'none',
              border: scene === 1 ? '1px solid var(--accent-border)' : 'none',
              cursor: 'pointer',
              borderRadius: 8, marginBottom: 4,
              color: scene === 1 ? 'var(--accent-text)' : 'var(--text-secondary)',
              fontSize: 13, textAlign: 'left',
              transition: 'all 100ms',
            }}>
              <div style={{
                width: 48, height: 36, borderRadius: 6,
                background: 'var(--bg-input)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: 10, color: 'var(--text-muted)',
              }}>
                {scene}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>Scene {scene}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{['Opening shot', 'Establishing', 'Action begins', 'Mid point', 'Climax'][scene - 1]}</div>
              </div>
            </button>
          ))}

          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '10px 12px', marginTop: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: 8, color: 'var(--accent-text)', fontSize: 13,
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
            Auto-generate scenes
          </button>
        </div>
      </div>

      {/* ========== CENTER — PREVIEW CANVAS ========== */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          flex: 1,
          background: 'radial-gradient(ellipse at center, #0a1a2e 0%, #000a14 40%, #000000 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 24,
            fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            SMART SHOT
          </div>

          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
            width: '60%', maxWidth: 480, zIndex: 1,
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                aspectRatio: '16/9',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: 'rgba(255,255,255,0.2)',
              }}>
                Scene {i}
              </div>
            ))}
          </div>

          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            display: 'flex', gap: 4,
          }}>
              <button onClick={() => toast.success('Reference image feature coming soon')} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '7px 12px', fontSize: 12,
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}>
                <ImageIcon size={14} /> Add reference
              </button>
          </div>
        </div>

        {/* ========== DIRECTOR BAR ========== */}
        <div style={{
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '0',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Film size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                Shot Planner
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setAutoStoryboard(!autoStoryboard)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  background: 'none', border: 'none', padding: '4px 0',
                }}
              >
                Auto-plan
                <div style={{
                  width: 32, height: 18, borderRadius: 100, position: 'relative',
                  background: autoStoryboard ? 'var(--accent-primary)' : 'var(--bg-input)',
                  border: 'none', cursor: 'pointer',
                }}>
                  <div style={{
                    position: 'absolute', top: 2,
                    left: autoStoryboard ? 14 : 2,
                    width: 14, height: 14, borderRadius: '50%',
                    background: '#fff', transition: 'left 150ms',
                  }} />
                </div>
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
          }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your video concept..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  padding: '0',
                  resize: 'none',
                  height: 20,
                }}
              />
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              flexShrink: 0, flexWrap: 'wrap',
            }}>
              <div style={{ minWidth: 100 }}>
                <StudioDropdown
                  value={videoLength}
                  options={VIDEO_LENGTH_OPTIONS}
                  onChange={setVideoLength}
                  theme={theme}
                />
              </div>
              <div style={{ minWidth: 80 }}>
                <StudioDropdown
                  value={numShots}
                  options={SHOTS_OPTIONS}
                  onChange={setNumShots}
                  theme={theme}
                />
              </div>
              <div style={{ minWidth: 120 }}>
                <StudioDropdown
                  value={visualStyle}
                  options={STYLE_OPTIONS}
                  onChange={setVisualStyle}
                  theme={theme}
                />
              </div>

              <button onClick={handleGenerate} style={{
                background: '#CCFF00',
                border: 'none',
                borderRadius: 10,
                padding: '10px 24px',
                fontSize: 14, fontWeight: 700,
                color: '#000',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap',
              }}>
                <Play size={14} /> GENERATE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
