import { NavBadge } from './NavBadge'

export function NavMenuItem({ icon: Icon, name, description, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 8px',
        borderRadius: 8,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'background 120ms ease',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 38, height: 38,
          borderRadius: 9,
          background: '#2a2a2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9CA3AF',
        }}>
          {Icon && <Icon size={17} />}
        </div>
        <NavBadge type={badge} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#ffffff',
          lineHeight: 1.2,
          marginBottom: 2,
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 10,
          color: '#6B7280',
          lineHeight: 1.35,
        }}>
          {description}
        </div>
      </div>
    </button>
  )
}
