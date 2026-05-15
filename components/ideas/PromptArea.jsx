'use client'
import { useState } from 'react'

export default function PromptArea({ label, value, onChange, placeholder, rows = 4, hint }) {
  const [focused, setFocused] = useState(false)
  const hasContent = value?.trim().length > 0

  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label style={{
          fontSize: 11, fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 10,
        }}>
          {label}
          <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 400 }}>*</span>
        </label>
      )}

      <div style={{
        background: 'var(--bg-input)',
        border: `2px solid ${
          focused ? 'var(--border-focus)'
          : hasContent ? 'var(--border-active)'
          : 'var(--border-default)'
        }`,
        borderRadius: 14,
        transition: 'border-color 150ms',
        overflow: 'hidden',
      }}>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none', outline: 'none',
            padding: '16px 18px',
            color: 'var(--text-primary)',
            fontSize: 15,
            lineHeight: 1.6,
            resize: 'vertical',
            fontFamily: 'inherit',
            minHeight: rows * 28,
          }}
        />

        <div style={{
          padding: '6px 16px 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {hint || 'Be descriptive for best results'}
          </span>
          <span style={{
            fontSize: 11, color: value?.length > 400 ? '#f59e0b' : 'var(--text-muted)',
          }}>
            {value?.length || 0} chars
          </span>
        </div>
      </div>
    </div>
  )
}
