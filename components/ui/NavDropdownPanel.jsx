export function NavDropdownPanel({ children, style }) {
  return (
    <div className="flyout-scrollbar" style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 8,
      background: 'var(--bg-flyout)',
      border: '1px solid var(--border-strong)',
      borderRadius: 14,
      padding: '16px 16px 24px',
      minWidth: 820,
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      zIndex: 99999,
      animation: 'dropFade 180ms ease forwards',
      ...style,
    }}>
      {children}
    </div>
  );
}
