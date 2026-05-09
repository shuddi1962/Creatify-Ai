'use client';

import { NavBadge } from './NavBadge';

export function SidebarIcon({ icon: Icon, label, badge, isActive, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 3,
        padding: '8px 0', border: 'none', cursor: 'pointer',
        background: 'transparent', position: 'relative',
        transition: 'background 150ms ease'
      }}
      onMouseEnterCapture={e => {
        if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
      }}
      onMouseLeaveCapture={e => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }}
    >
      <div style={{
        position: 'relative',
        width: 48, height: 48, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
        color: isActive ? '#A78BFA' : '#6B7280',
        transition: 'background 150ms ease, color 150ms ease'
      }}>
        <Icon size={22} />
        <NavBadge type={badge} />
      </div>
      <span style={{
        fontSize: 9, fontWeight: 500,
        color: isActive ? '#A78BFA' : '#6B7280',
        lineHeight: 1.2,
        transition: 'color 150ms ease'
      }}>{label}</span>
    </button>
  );
}
