'use client';

import { useState } from 'react';
import { PanelLeftClose, Camera, Sparkles, Film, Image as ImageIcon, Square } from 'lucide-react';
import StudioDropdown from '@/components/StudioDropdown';

const CAMERA_PRESETS = [
  { label: 'Wide Shot', desc: 'Capture the full scene' },
  { label: 'Close-Up', desc: 'Detail and emotion' },
  { label: 'Aerial', desc: 'Bird\'s eye perspective' },
  { label: 'Low Angle', desc: 'Dramatic upward view' },
  { label: 'Eye-Level', desc: 'Natural perspective' },
  { label: 'Dutch Tilt', desc: 'Tilted dynamic angle' },
  { label: 'Over-the-Shoulder', desc: 'Conversational shot' },
  { label: 'POV', desc: 'First person view' },
  { label: 'Macro', desc: 'Extreme close-up' },
  { label: 'Fish-Eye', desc: 'Ultra-wide distortion' },
];

const LENS_TYPES = [
  { label: '24mm', desc: 'Wide angle' },
  { label: '35mm', desc: 'Street photography' },
  { label: '50mm', desc: 'Standard prime' },
  { label: '85mm', desc: 'Portrait' },
  { label: '135mm', desc: 'Telephoto' },
  { label: '200mm', desc: 'Super telephoto' },
];

const APERTURES = ['f/1.4', 'f/1.8', 'f/2.8', 'f/5.6', 'f/8', 'f/11'];
const DOF_OPTIONS = ['Shallow', 'Normal', 'Deep'];
const LIGHTING_PRESETS = ['Golden Hour', 'Blue Hour', 'Studio', 'Overcast', 'Night', 'Dramatic'];

export default function CinemaCameraPage() {
  const [theme, setTheme] = useState('dark');
  const [prompt, setPrompt] = useState('');
  const [cameraPreset, setCameraPreset] = useState('Wide Shot');
  const [lens, setLens] = useState('50mm');
  const [aperture, setAperture] = useState('f/2.8');
  const [dof, setDof] = useState('Normal');
  const [lighting, setLighting] = useState('Golden Hour');

  return (
    <div style={{
      display: 'flex', height: '100%',
      background: 'var(--bg-page)', overflow: 'hidden',
    }}>
      {/* LEFT PANEL */}
      <div style={{
        width: 240, background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', fontSize: 13,
          }}>
            <PanelLeftClose size={16} /> Hide
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--bg-input)', border: '1px solid var(--border-default)',
            borderRadius: 8, padding: '5px 10px', fontSize: 12,
            color: 'var(--text-secondary)', cursor: 'pointer',
          }}>
            <Camera size={12} /> Presets
          </button>
        </div>
        <div style={{ padding: '8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '10px 12px 6px' }}>
            Shot Presets
          </div>
          {CAMERA_PRESETS.map((preset, i) => {
            const isActive = cameraPreset === preset.label;
            return (
              <button key={i} onClick={() => setCameraPreset(preset.label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px',
                  background: isActive ? 'var(--accent-bg)' : 'none', border: 'none', cursor: 'pointer',
                  borderRadius: 8, color: isActive ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left', transition: 'all 100ms',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: isActive ? 500 : 400 }}>{preset.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{preset.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CENTER CANVAS */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          flex: 1, background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0014 40%, #000000 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 24, fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            CINEMA CAMERA CONTROLS
          </div>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
          {[{ top: '12%', left: '12%' }, { top: '12%', right: '12%' }, { bottom: '36%', left: '12%' }, { bottom: '36%', right: '12%' }].map((pos, i) => (
            <div key={i} style={{ position: 'absolute', ...pos, width: 12, height: 12, borderTop: i < 2 ? '2px solid rgba(255,255,255,0.2)' : 'none', borderBottom: i >= 2 ? '2px solid rgba(255,255,255,0.2)' : 'none', borderLeft: i % 2 === 0 ? '2px solid rgba(255,255,255,0.2)' : 'none', borderRight: i % 2 === 1 ? '2px solid rgba(255,255,255,0.2)' : 'none' }} />
          ))}
          <div style={{ width: 160, height: 160, border: '2px dashed rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 1 }}>
            <Camera size={32} style={{ color: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Drop image here</span>
          </div>
        </div>

        {/* DIRECTOR BAR */}
        <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Camera size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Camera Controls</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 140 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lens</div>
              <StudioDropdown options={LENS_TYPES} value={lens} onChange={setLens} theme={theme} />
            </div>
            <div style={{ minWidth: 100 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Aperture</div>
              <StudioDropdown options={APERTURES} value={aperture} onChange={setAperture} theme={theme} />
            </div>
            <div style={{ minWidth: 120 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Depth of Field</div>
              <StudioDropdown options={DOF_OPTIONS} value={dof} onChange={setDof} theme={theme} />
            </div>
            <div style={{ minWidth: 140 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lighting</div>
              <StudioDropdown options={LIGHTING_PRESETS} value={lighting} onChange={setLighting} theme={theme} />
            </div>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the scene..."
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
            </div>
            <button style={{ background: '#CCFF00', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 700, color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>
              GENERATE
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Sparkles size={12} /> Model: Flux Pro
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Square size={12} /> 1:1
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              High Quality
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
