'use client';

import { useState } from 'react';
import { PanelLeftClose, ChevronDown, Heart, Plus, Sparkles, Layers, Film, Image as ImageIcon, Video, Volume2, Layout as LayoutIcon } from 'lucide-react';
import StudioDropdown from '@/components/StudioDropdown';

export default function CinemaStudioPage() {
  const [theme, setTheme] = useState('dark');
  const [prompt, setPrompt] = useState('');

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
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'var(--bg-input)', border: '1px solid var(--border-default)',
              borderRadius: 8, padding: '5px 10px', fontSize: 12,
              color: 'var(--text-secondary)', cursor: 'pointer',
            }}>
              Type: All <ChevronDown size={12} />
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: '1px solid var(--border-default)',
              borderRadius: 8, padding: '5px 10px', fontSize: 12,
              color: 'var(--text-secondary)', cursor: 'pointer',
            }}>
              <Heart size={12} /> Liked
            </button>
          </div>
        </div>

        <div style={{ padding: '8px' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '10px 12px',
            background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Plus size={16} /> New project
          </button>

          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '10px 12px',
            background: 'var(--accent-bg)', border: 'none', cursor: 'pointer',
            borderRadius: 8, color: 'var(--accent-text)', fontSize: 13,
            fontWeight: 500,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 8,
              background: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={12} color="#fff" />
            </div>
            AI Director
          </button>

          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '10px 12px',
            background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <div style={{
              width: 24, height: 24, borderRadius: 8,
              background: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Layers size={12} color="#fff" />
            </div>
            Elements
          </button>
        </div>

        <div style={{
          padding: '4px 8px 8px',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 4,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.07em',
            padding: '10px 12px 6px',
          }}>
            Projects
          </div>

          <button style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '8px 12px',
            background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'var(--bg-input)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>🎬</div>
            My Generations
          </button>

          {['New project', 'Untitled', 'Untitled'].map((name, i) => (
            <button key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '8px 12px',
              background: i === 0 ? 'var(--bg-hover)' : 'none',
              border: 'none', cursor: 'pointer',
              borderRadius: 8, color: 'var(--text-primary)', fontSize: 13,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = i === 0 ? 'var(--bg-hover)' : 'none'}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'var(--bg-input)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>🎭</div>
              {name}
            </button>
          ))}
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
          background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0014 40%, #000000 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'crosshair',
        }}>
          <div style={{
            position: 'absolute', top: 24,
            fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            CINEMA STUDIO 3.5
          </div>

          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />

          {[
            { top: '15%', left: '15%' },
            { top: '15%', right: '15%' },
            { bottom: '30%', left: '15%' },
            { bottom: '30%', right: '15%' },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', ...pos,
              width: 12, height: 12,
              borderTop: i < 2 ? '2px solid rgba(255,255,255,0.2)' : 'none',
              borderBottom: i >= 2 ? '2px solid rgba(255,255,255,0.2)' : 'none',
              borderLeft: i % 2 === 0 ? '2px solid rgba(255,255,255,0.2)' : 'none',
              borderRight: i % 2 === 1 ? '2px solid rgba(255,255,255,0.2)' : 'none',
            }} />
          ))}

          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 52px)',
            fontWeight: 700,
            color: 'transparent',
            background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            maxWidth: '70%',
            lineHeight: 1.2,
            padding: '0 24px',
            zIndex: 1,
          }}>
            What would you shoot<br />with infinite budget?
          </h1>

          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 8, padding: '7px 12px', fontSize: 12,
              color: 'var(--text-secondary)', cursor: 'pointer',
            }}>
              <ImageIcon size={14} /> Image
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 8, padding: '7px 12px', fontSize: 12,
              color: 'var(--text-secondary)', cursor: 'pointer',
            }}>
              <Video size={14} /> Video
            </button>
          </div>
        </div>

        {/* ========== DIRECTOR PANEL (bottom bar) ========== */}
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
                Director Panel
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {[null, null, null].map((_, i) => (
              <div key={i} style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '1.5px dashed var(--border-default)',
                background: 'var(--bg-input)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}>
                <Plus size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}

            <div style={{
              width: 56, height: 40, borderRadius: 6,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              overflow: 'hidden', flexShrink: 0,
              position: 'relative',
            }}>
              <img
                src="https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=200"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ minWidth: 160 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3,
                textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Movement
              </div>
              <StudioDropdown
                value="Orbit around"
                options={[
                  { label: 'Orbit around', desc: 'Circle the subject' },
                  { label: 'Zoom in', desc: 'Push toward subject' },
                  { label: 'Pan left', desc: 'Sweep horizontally' },
                  { label: 'Pan right', desc: 'Sweep right' },
                  { label: 'Crane up', desc: 'Lift camera upward' },
                  { label: 'Dolly push', desc: 'Track forward' },
                  { label: 'Handheld', desc: 'Natural camera shake' },
                  { label: 'Static', desc: 'No camera movement' },
                ]}
                theme={theme}
              />
            </div>

            <div style={{
              flex: 1,
              height: 40,
              background: 'var(--bg-input)',
              borderRadius: 8,
              border: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center',
              padding: '0 12px', overflow: 'hidden',
              position: 'relative',
            }}>
              <svg width="100%" height="30" viewBox="0 0 300 30" preserveAspectRatio="none">
                <path
                  d="M0,20 C50,20 80,8 120,5 C160,2 200,8 240,5 C260,4 280,8 300,15"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                />
                {[30, 90, 150, 210, 270].map((x, i) => (
                  <circle key={i} cx={x} cy={i===1||i===3 ? 8 : 14}
                    r="4" fill="#6366f1" />
                ))}
              </svg>
            </div>

            <div style={{ minWidth: 120 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3,
                textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Speed ramp
              </div>
              <StudioDropdown
                value="Custom"
                options={['Linear', 'Ease In', 'Ease Out', 'Ease In Out', 'Custom']}
                theme={theme}
              />
            </div>

            <div style={{ minWidth: 100 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3,
                textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Duration
              </div>
              <StudioDropdown
                value="12s"
                options={[
                  { label: '3s', desc: 'Quick clip' },
                  { label: '5s', desc: 'Standard' },
                  { label: '8s', desc: 'Extended' },
                  { label: '10s', desc: 'Long form' },
                  { label: '12s', desc: 'Maximum' },
                ]}
                theme={theme}
              />
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                placeholder="Describe your scene — use @ to add characters & locations"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  padding: '0',
                }}
              />
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              flexShrink: 0,
            }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '6px 10px', fontSize: 12,
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}>
                <Sparkles size={12} /> Cinema Studio 3.5
              </button>

              <button style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '6px 10px', fontSize: 12,
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}>
                <Film size={12} /> Single shot
              </button>

              <button style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '6px 10px', fontSize: 12,
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}>
                <LayoutIcon size={12} /> 16:9
              </button>

              <button style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '6px 10px', fontSize: 12,
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}>
                1080p
              </button>

              <button style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '6px 10px', fontSize: 12,
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}>
                🎨 General
              </button>

              <button style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '6px 10px', fontSize: 12,
                color: 'var(--text-secondary)', cursor: 'pointer',
              }}>
                <Volume2 size={12} /> On
              </button>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '6px 10px', fontSize: 12,
                color: 'var(--text-secondary)',
              }}>
                <button style={{ background:'none',border:'none',cursor:'pointer',
                  color:'var(--text-secondary)', padding:'0 2px' }}>−</button>
                1/4
                <button style={{ background:'none',border:'none',cursor:'pointer',
                  color:'var(--text-secondary)', padding:'0 2px' }}>+</button>
              </div>

              <button style={{
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 600,
                color: 'var(--text-secondary)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                lineHeight: 1.2,
              }}>
                <Plus size={10} />
                START<br/>FRAME
              </button>
              <button style={{
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 600,
                color: 'var(--text-secondary)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                lineHeight: 1.2,
              }}>
                <Plus size={10} />
                END<br/>FRAME
              </button>

              <button style={{
                background: '#CCFF00',
                border: 'none',
                borderRadius: 10,
                padding: '10px 20px',
                fontSize: 14, fontWeight: 700,
                color: '#000',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap',
                minWidth: 140,
              }}>
                GENERATE
              </button>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 180, right: 16,
        }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-card)', border: '1px solid var(--border-default)',
            borderRadius: 100, padding: '8px 14px', fontSize: 13, fontWeight: 500,
            color: 'var(--text-primary)', cursor: 'pointer',
            boxShadow: 'var(--shadow-card)',
          }}>
            💬 AI Director
          </button>
        </div>
      </div>
    </div>
  );
}

