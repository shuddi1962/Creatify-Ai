'use client';

export function NavBadge({ type }) {
  if (type === 'NEW') return (
    <span style={{
      position: 'absolute', top: -4, left: -4,
      background: '#a3e635', color: '#000',
      fontSize: '8px', fontWeight: 700,
      padding: '1px 4px', borderRadius: '4px',
      letterSpacing: '0.05em', lineHeight: 1.4,
      zIndex: 10, pointerEvents: 'none'
    }}>NEW</span>
  );
  if (type === 'TOP') return (
    <span style={{
      position: 'absolute', top: -4, left: -4,
      background: '#ec4899', color: '#fff',
      fontSize: '8px', fontWeight: 700,
      padding: '1px 4px', borderRadius: '4px',
      letterSpacing: '0.05em', lineHeight: 1.4,
      zIndex: 10, pointerEvents: 'none'
    }}>TOP</span>
  );
  return null;
}
