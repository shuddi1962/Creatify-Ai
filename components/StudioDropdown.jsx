'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export default function StudioDropdown({ label, value, onChange, options, theme }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 160, dropUp: false })
  const [actualHeight, setActualHeight] = useState(200)
  const ref = useRef(null)
  const btnRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const measureAndOpen = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const hasDesc = options.some(o => typeof o === 'object' && o.desc)
    const perItem = hasDesc ? 60 : 44
    const estHeight = Math.min(options.length * perItem + 24, 360)
    const spaceBelow = window.innerHeight - rect.bottom - 20
    const spaceAbove = rect.top - 20
    const shouldDropUp = spaceBelow < estHeight && spaceAbove >= spaceBelow
    setPos({
      top: shouldDropUp ? Math.max(rect.top - Math.min(estHeight, 360) - 8, 8) : rect.bottom + 8,
      left: Math.min(rect.left, window.innerWidth - (rect.width + 20)),
      width: Math.max(rect.width, 180),
      dropUp: shouldDropUp,
    })
    setOpen(true)
  }, [options])

  useEffect(() => {
    if (!open) return
    const onScroll = () => measureAndOpen()
    window.addEventListener('scroll', onScroll, true)
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [open, measureAndOpen])

  useEffect(() => {
    if (!open || !panelRef.current) return
    const h = panelRef.current.scrollHeight
    if (h > 0 && h !== actualHeight) setActualHeight(h)
  }, [open, actualHeight])

  useEffect(() => {
    if (!open || !panelRef.current || !btnRef.current) return
    const panel = panelRef.current
    const btnRect = btnRef.current.getBoundingClientRect()
    const pH = panel.scrollHeight
    const spaceBelow = window.innerHeight - btnRect.bottom - 20
    const spaceAbove = btnRect.top - 20
    if (spaceBelow < pH && spaceAbove >= spaceBelow) {
      const upTop = btnRect.top - Math.min(pH, 360) - 8
      setPos(prev => ({ ...prev, top: Math.max(upTop, 8), dropUp: true }))
    } else {
      setPos(prev => ({ ...prev, top: btnRect.bottom + 8, dropUp: false }))
    }
  }, [open, actualHeight])

  const isDark = theme === 'dark' || (!theme && typeof window !== 'undefined' && document.documentElement.getAttribute('data-theme') !== 'light')

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      {label && (
        <div style={{
          fontSize: 11, fontWeight: 600,
          color: 'var(--text-icon)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 6,
        }}>
          {label}
        </div>
      )}

      <button
        ref={btnRef}
        onClick={() => open ? setOpen(false) : measureAndOpen()}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          width: '100%',
          minWidth: 140,
          padding: '8px 12px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 10,
          color: 'var(--text-primary)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'border-color 150ms, background 150ms',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms',
            opacity: 0.6,
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            minWidth: pos.width,
            maxWidth: 360,
            maxHeight: 360,
            overflowY: 'auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-strong)',
            borderRadius: 12,
            padding: '6px',
            zIndex: 999999,
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            animation: 'dropIn 150ms ease',
          }}
        >
          {options.map(opt => {
            const isSelected = value === opt.label || value === opt
            const optLabel = typeof opt === 'string' ? opt : opt.label
            const optDesc = typeof opt === 'object' ? opt.desc : null
            return (
              <div
                key={optLabel}
                onClick={() => { onChange(optLabel); setOpen(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: isSelected ? 'var(--bg-hover)' : 'transparent',
                  transition: 'background 120ms',
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)'
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent'
                }}
              >
                <div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'var(--color-accent)' : 'var(--text-primary)',
                  }}>
                    {optLabel}
                  </div>
                  {optDesc && (
                    <div style={{
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      marginTop: 1,
                    }}>
                      {optDesc}
                    </div>
                  )}
                </div>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
