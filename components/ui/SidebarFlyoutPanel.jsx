import { useEffect, useRef } from 'react'

export function SidebarFlyoutPanel({ title, leftLabel, rightLabel, left, right, style }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!panelRef.current || !style?.top) return
    const panel = panelRef.current
    const rect = panel.getBoundingClientRect()
    const overflowsBottom = rect.bottom > window.innerHeight - 16
    const overflowsTop = rect.top < 8
    if (overflowsBottom && !overflowsTop) {
      const shift = rect.bottom - window.innerHeight + 16
      panel.style.top = `${rect.top - shift}px`
    }
  }, [style?.top])

  const colHeaderStyle = {
    fontSize: 10,
    fontWeight: 500,
    color: 'var(--text-menu-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 6,
    padding: '0 4px',
  }
  return (
    <div ref={panelRef} style={{
      position: 'fixed',
      background: 'var(--bg-flyout)',
      border: '1px solid var(--border-strong)',
      borderRadius: 14,
      padding: '16px 16px 24px',
      width: 640,
      boxShadow: '0 20px 60px var(--overlay-bg)',
      zIndex: 999999,
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
        borderRight: '7px solid var(--bg-flyout)',
      }} />

      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, padding: '0 4px' }}>
        {title}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div style={colHeaderStyle}>{leftLabel || 'Discover'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{left}</div>
        </div>
        <div>
          <div style={colHeaderStyle}>{rightLabel || 'Create'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{right}</div>
        </div>
      </div>
    </div>
  )
}