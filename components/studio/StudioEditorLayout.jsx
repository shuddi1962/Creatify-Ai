'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/lib/AuthProvider';
import { PanelLeftClose, PanelRightClose, ChevronDown, ChevronUp } from 'lucide-react';

export function LeftPanel({ children, title = 'Tools', onHide }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden"
        style={{
          position: 'fixed', left: 8, bottom: 80, zIndex: 999,
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--accent-primary)', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          color: '#000',
        }}
        title={mobileOpen ? 'Close tools' : 'Open tools'}
      >
        {mobileOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>

      {/* Desktop panel */}
      <div className="hidden lg:flex" style={{
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

      {/* Mobile bottom sheet panel */}
      {mobileOpen && (
        <div className="lg:hidden" style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 998,
          maxHeight: '50vh', overflowY: 'auto',
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border-subtle)',
          borderRadius: '16px 16px 0 0',
          padding: '12px 16px',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.3)',
          animation: 'fade-in-up 0.2s ease-out',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              {title}
            </div>
            <button onClick={() => setMobileOpen(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}>
              <PanelRightClose size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

export function StudioCanvas({ children, overlay }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'var(--bg-page)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      width: '100%', maxWidth: '100%',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(var(--border-subtle) 1px, transparent 1px),
          linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        opacity: 0.3,
      }} />
      {overlay}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

export function DirectorBar({ children, title }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border-subtle)',
      width: '100%', maxWidth: '100vw',
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
              {title}
            </span>
          </div>
        </div>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px',
        flexWrap: 'wrap',
        width: '100%', maxWidth: '100%',
      }}>
        {children}
      </div>
    </div>
  );
}

export function GenerateButton({ children, loading, ...props }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleClick = (e) => {
    if (loading) return;
    if (!user) {
      e.preventDefault();
      router.push('/studio/signup');
      return;
    }
    if (props.onClick) props.onClick(e);
  };

  return (
    <button style={{
      background: loading ? 'var(--text-muted)' : '#CCFF00',
      border: 'none', borderRadius: 10,
      padding: '8px 18px', fontSize: 13, fontWeight: 700,
      color: loading ? '#fff' : '#000',
      cursor: loading ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', gap: 5,
      whiteSpace: 'nowrap', flexShrink: 0,
      opacity: loading ? 0.6 : 1,
      transition: 'all 200ms',
    }} {...props} onClick={handleClick}>
      {loading ? (
        <><span className="spinner" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> GEN...</>
      ) : (children || 'GENERATE')}
    </button>
  );
}

export function ControlButton({ children, icon: Icon, ...props }) {
  return (
    <button style={{
      display: 'flex', alignItems: 'center', gap: 5,
      background: 'var(--bg-input)', border: '1px solid var(--border-default)',
      borderRadius: 8, padding: '5px 8px', fontSize: 11,
      color: 'var(--text-secondary)', cursor: 'pointer',
      whiteSpace: 'nowrap', flexShrink: 0,
    }} {...props}>
      {Icon && <Icon size={11} />}
      {children}
    </button>
  );
}

export function PromptInput({ value, onChange, placeholder, ...props }) {
  return (
    <div style={{ flex: '1 1 auto', minWidth: 120, maxWidth: '100%', position: 'relative' }}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Describe what you want to create...'}
        style={{
          width: '100%', maxWidth: '100%', background: 'transparent', border: 'none',
          outline: 'none', color: 'var(--text-primary)', fontSize: 13,
          padding: '0', resize: 'none', height: 18,
          ...props.style,
        }}
        rows={1}
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
          width: 10, height: 10,
          borderTop: i < 2 ? '2px solid var(--border-default)' : 'none',
          borderBottom: i >= 2 ? '2px solid var(--border-default)' : 'none',
          borderLeft: i % 2 === 0 ? '2px solid var(--border-default)' : 'none',
          borderRight: i % 2 === 1 ? '2px solid var(--border-default)' : 'none',
        }} />
      ))}
    </>
  );
}

export default function StudioEditorLayout({ left, canvas, directorBar }) {
  return (
    <div style={{
      display: 'flex', height: '100%', width: '100%', maxWidth: '100%', overflow: 'hidden',
      background: 'var(--bg-page)',
    }}>
      {left}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
        {canvas}
        <div style={{ position: 'relative', zIndex: 100, width: '100%', maxWidth: '100vw' }}>
          {directorBar}
        </div>
      </div>
    </div>
  );
}
