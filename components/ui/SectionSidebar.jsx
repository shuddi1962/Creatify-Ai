'use client'
import { useState, createContext, useContext } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const CollapsedContext = createContext(false)
export const useCollapsed = () => useContext(CollapsedContext)

export function SectionSidebar({
  sectionName, sectionIcon: SectionIcon, sectionEmoji,
  toolCount, children, bottomContent
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      width: collapsed ? 52 : 220,
      flexShrink: 0,
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      height: '100%',
      transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
    }}>

      <div style={{
        padding: collapsed ? '12px 0' : '12px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : 8,
        justifyContent: collapsed ? 'center' : 'flex-start',
        flexShrink: 0,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 15,
          color: 'var(--accent-primary)',
        }}>
          {SectionIcon ? <SectionIcon size={16} /> : sectionEmoji}
        </div>

        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
              {sectionName}
            </div>
            {toolCount && (
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {toolCount} tools
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            width: 22, height: 22, borderRadius: 5, flexShrink: 0,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
            marginLeft: collapsed ? 0 : 'auto',
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '6px',
      }}>
        <CollapsedContext.Provider value={collapsed}>
          {children}
        </CollapsedContext.Provider>
      </div>

      {bottomContent && !collapsed && (
        <div style={{ flexShrink: 0, padding: '0 6px 8px' }}>
          {bottomContent}
        </div>
      )}
    </div>
  )
}
