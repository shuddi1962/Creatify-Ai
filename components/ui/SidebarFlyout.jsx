'use client';

import { NavCard } from './NavCard';

const COL_HEADER_STYLE = {
  fontSize: 11, color: '#4B5563', fontWeight: 500,
  textTransform: 'uppercase', letterSpacing: '0.07em',
  padding: '8px 12px 4px'
};

export function SidebarFlyout({ isOpen, leftItems, rightItems, leftTitle = 'Features', rightTitle = 'More', onItemClick, topOffset = 0, style = {} }) {
  if (!isOpen) return null;

  const maxTop = window.innerHeight - 400;
  const clampedTop = Math.max(16, Math.min(topOffset - 20, maxTop));

  return (
    <div
      style={{
        position: 'fixed', left: 64, top: clampedTop,
        width: 520,
        background: '#1C1C1C',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        padding: 20,
        zIndex: 50,
        opacity: 0,
        transform: 'translateX(-8px)',
        animation: 'sidebarFlyoutIn 180ms ease forwards',
        ...style
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <div>
          <div style={COL_HEADER_STYLE}>{leftTitle}</div>
          {leftItems.map((item, i) => (
            <NavCard
              key={i}
              icon={item.icon}
              label={item.label}
              description={item.description}
              badge={item.badge}
              onClick={() => { onItemClick?.(item); }}
            />
          ))}
        </div>
        <div>
          <div style={COL_HEADER_STYLE}>{rightTitle}</div>
          {rightItems.map((item, i) => (
            <NavCard
              key={i}
              icon={item.icon}
              label={item.label}
              description={item.description}
              badge={item.badge}
              onClick={() => { onItemClick?.(item); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
