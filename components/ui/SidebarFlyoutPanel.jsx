export function SidebarFlyoutPanel({ title, leftLabel, rightLabel, left, right, style }) {
  const colHeaderStyle = {
    fontSize: 10,
    fontWeight: 500,
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 6,
    padding: '0 4px',
  }
  return (
    <div className="flyout-scrollbar" style={{
      position: 'fixed',
      background: '#1C1C1C',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 14,
      padding: 16,
      width: 640,
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
      zIndex: 9999,
      animation: 'flyoutFade 180ms ease forwards',
      ...style,
    }}>
      <div style={{
        position: 'absolute',
        left: -7,
        top: 40,
        width: 0,
        height: 0,
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        borderRight: '7px solid #1C1C1C',
      }} />

      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12, padding: '0 4px' }}>
        {title}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={colHeaderStyle}>{leftLabel || 'Discover'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{left}</div>
        </div>
        <div>
          <div style={colHeaderStyle}>{rightLabel || 'Create'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{right}</div>
        </div>
      </div>
    </div>
  )
}
