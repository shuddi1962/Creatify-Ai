'use client';

import { PanelLeftClose } from 'lucide-react';

export function LeftPanel({ children, title = 'Tools', onHide }) {
  return (
    <div style={{
      width: 240,
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onHide} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 13,
        }}>
          <PanelLeftClose size={16} />
          Hide
        </button>
        <div style={{
          fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {title}
        </div>
      </div>
      <div style={{ padding: '8px', flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

export function StudioCanvas({ children, overlay }) {
  return (
    <div style={{
      flex: 1,
      background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0014 40%, #000000 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      {overlay}
      {children}
    </div>
  );
}

export function DirectorBar({ children, title }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border-subtle)',
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
              {title}
            </span>
          </div>
        </div>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        flexWrap: 'wrap',
      }}>
        {children}
      </div>
    </div>
  );
}

export function GenerateButton({ children, credits = 8, ...props }) {
  return (
    <button style={{
      background: '#CCFF00', border: 'none', borderRadius: 10,
      padding: '10px 24px', fontSize: 14, fontWeight: 700,
      color: '#000', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 6,
      whiteSpace: 'nowrap', flexShrink: 0,
    }} {...props}>
      {children || `GENERATE ✦ ${credits}`}
    </button>
  );
}

export function ControlButton({ children, icon: Icon, ...props }) {
  return (
    <button style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'var(--bg-input)', border: '1px solid var(--border-default)',
      borderRadius: 8, padding: '6px 10px', fontSize: 12,
      color: 'var(--text-secondary)', cursor: 'pointer',
    }} {...props}>
      {Icon && <Icon size={12} />}
      {children}
    </button>
  );
}

export function PromptInput({ value, onChange, placeholder, ...props }) {
  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Describe what you want to create...'}
        style={{
          width: '100%', background: 'transparent', border: 'none',
          outline: 'none', color: 'var(--text-primary)', fontSize: 14,
          padding: '0', resize: 'none', height: 20,
          ...props.style,
        }}
      />
    </div>
  );
}

export function CornerMarkers() {
  return (
    <>
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
    </>
  );
}

export default function StudioEditorLayout({ left, canvas, directorBar }) {
  return (
    <div style={{
      display: 'flex', height: '100%',
      background: 'var(--bg-page)',
    }}>
      {left}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minWidth: 0 }}>
        {canvas}
        <div style={{ position: 'relative', zIndex: 100 }}>
          {directorBar}
        </div>
      </div>
    </div>
  );
}
