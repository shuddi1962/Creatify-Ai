export function NavBadge({ type }) {
  if (!type) return null
  const styles = {
    position: 'absolute', top: -5, left: -5,
    fontSize: 8, fontWeight: 700,
    padding: '1px 4px', borderRadius: 3,
    letterSpacing: '0.04em', lineHeight: 1.5,
    zIndex: 10, pointerEvents: 'none',
    ...(type === 'NEW' ? { background: 'var(--badge-new-bg)', color: 'var(--badge-new-color)' } : {}),
    ...(type === 'TOP' ? { background: 'var(--badge-top-bg)', color: 'var(--badge-top-color)' } : {}),
  }
  return <span style={styles}>{type}</span>
}