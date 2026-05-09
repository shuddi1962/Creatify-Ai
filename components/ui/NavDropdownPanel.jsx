export function NavDropdownPanel({ children, style }) {
  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 8,
      background: '#1C1C1C',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 14,
      padding: 16,
      minWidth: 680,
      boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
      zIndex: 9999,
      animation: 'dropFade 180ms ease forwards',
      ...style,
    }}>
      {children}
    </div>
  )
}
