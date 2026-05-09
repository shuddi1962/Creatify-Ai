'use client';

import { NavBadge } from './NavBadge';

export function NavCard({ icon: Icon, label, description, badge, onClick, size = 40 }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 10,
        background: 'transparent', border: 'none',
        cursor: 'pointer', width: '100%', textAlign: 'left',
        transition: 'background 150ms ease'
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: size, height: size, borderRadius: 10,
          background: '#2a2a2a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#9CA3AF'
        }}>
          <Icon size={Math.round(size * 0.45)} />
        </div>
        <NavBadge type={badge} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </div>
        <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {description}
        </div>
      </div>
    </button>
  );
}
