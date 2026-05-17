'use client'
import Link from 'next/link'
import { useCollapsed } from './SectionSidebar'

const BADGE_STYLES = {
  NEW: { bg: 'var(--accent-primary)', color: '#000' },
  LIVE: { bg: '#22c55e', color: '#fff' },
  PRO: { bg: '#f59e0b', color: '#000' },
  HOT: { bg: '#ef4444', color: '#fff' },
  TOP: { bg: '#FF6B35', color: '#fff' },
}

export function SidebarNavItem({
  href, icon: Icon, label, desc,
  badge, isActive, onClick
}) {
  const collapsed = useCollapsed()

  const content = (
    <div
      onClick={onClick}
      title={collapsed ? label : undefined}
      style={{
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : 8,
        padding: collapsed ? '10px 0' : '8px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 9,
        borderLeft: `3px solid ${isActive ? 'var(--accent-primary)' : 'transparent'}`,
        background: isActive ? 'var(--bg-active)' : 'transparent',
        cursor: 'pointer', marginBottom: 1,
        transition: 'all 140ms ease',
      }}
      onMouseEnter={e => {
        if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'
      }}
      onMouseLeave={e => {
        if (!isActive) e.currentTarget.style.background = 'transparent'
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: 5, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13,
        color: isActive ? 'var(--accent-primary)' : 'var(--icon-default)',
      }}>
        {Icon && <Icon size={15} />}
      </div>

      {!collapsed && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12, fontWeight: isActive ? 600 : 500,
            color: isActive ? 'var(--text-active)' : 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {label}
          </div>
          {desc && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
              {desc}
            </div>
          )}
        </div>
      )}

      {!collapsed && badge && (
        <span style={{
          fontSize: 8, fontWeight: 700, padding: '1px 5px',
          borderRadius: 3, flexShrink: 0,
          background: BADGE_STYLES[badge]?.bg || 'var(--accent-primary)',
          color: BADGE_STYLES[badge]?.color || '#000',
        }}>
          {badge}
        </span>
      )}
    </div>
  )

  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link> : content
}

export function SidebarSectionLabel({ label, collapsed: forceCollapsed }) {
  const collapsed = useCollapsed()
  const isCollapsed = forceCollapsed !== undefined ? forceCollapsed : collapsed

  if (isCollapsed) return (
    <div style={{
      height: 1, margin: '8px 8px',
      background: 'var(--border-subtle)',
    }} />
  )
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, color: 'var(--text-muted)',
      textTransform: 'uppercase', letterSpacing: '0.09em',
      padding: '10px 12px 4px',
    }}>
      {label}
    </div>
  )
}
