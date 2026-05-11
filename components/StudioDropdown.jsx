'use client'

import { useState, useRef, useEffect } from 'react'

export default function StudioDropdown({ label, value, onChange, options, theme }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          width: '100%',
          minWidth: 160,
          padding: '10px 14px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 10,
          color: 'var(--text-primary)',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'border-color 150ms, background 150ms',
        }}
      >
        <span>{value}</span>
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
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          minWidth: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-strong)',
          borderRadius: 12,
          padding: '6px',
          zIndex: 500,
          boxShadow: '0 8px 32px var(--overlay-bg)',
          animation: 'dropIn 150ms ease',
        }}>
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
                  if (!isSelected)
                    e.currentTarget.style.background = 'var(--bg-hover)'
                }}
                onMouseLeave={e => {
                  if (!isSelected)
                    e.currentTarget.style.background = 'transparent'
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