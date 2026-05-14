'use client'

export default function GenerationPanel({ children, prompt, onPromptChange, placeholder = 'Describe what you want to create...', loading, onGenerate, generateLabel = 'Generate', extraControls }) {
  return (
    <div style={{
      maxWidth: 900, margin: '0 auto 32px',
      padding: '0 24px',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}>
        {onPromptChange && (
          <div style={{ padding: '20px 20px 0' }}>
            <label style={{
              fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', marginBottom: 8,
            }}>
              PROMPT
            </label>
            <textarea
              value={prompt}
              onChange={e => onPromptChange(e.target.value)}
              placeholder={placeholder}
              rows={4}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                padding: '14px 16px',
                color: 'var(--text-primary)',
                fontSize: 15,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 150ms',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-active)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>
        )}

        {children}

        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          gap: 12,
        }}>
          {loading && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                border: '2px solid var(--accent-primary)',
                borderTopColor: 'transparent',
                animation: 'spin 600ms linear infinite',
              }} />
              Generating...
            </div>
          )}
          <button
            onClick={onGenerate}
            disabled={loading}
            style={{
              background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)',
              color: 'var(--btn-generate-text)',
              border: 'none', borderRadius: 12,
              padding: '12px 28px', fontSize: 15, fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.02em',
              transition: 'opacity 150ms, transform 100ms',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {loading ? 'Generating...' : `✦ ${generateLabel}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export function PromptSection({ value, onChange, placeholder }) {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <label style={{
        fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        display: 'block', marginBottom: 8,
      }}>
        PROMPT
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: '100%',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: '14px 16px',
          color: 'var(--text-primary)',
          fontSize: 15,
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'inherit',
          transition: 'border-color 150ms',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--border-active)'}
        onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
      />
    </div>
  )
}

export function ControlsGrid({ children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 16,
      padding: '20px',
    }}>
      {children}
    </div>
  )
}

export function GenerateSection({ onClick, loading, label = 'Generate' }) {
  return (
    <div style={{
      padding: '16px 20px',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
      gap: 12,
    }}>
      {loading && (
        <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            border: '2px solid var(--accent-primary)',
            borderTopColor: 'transparent',
            animation: 'spin 600ms linear infinite',
          }} />
          Generating...
        </div>
      )}
      <button
        onClick={onClick}
        disabled={loading}
        style={{
          background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)',
          color: 'var(--btn-generate-text)',
          border: 'none', borderRadius: 12,
          padding: '12px 28px', fontSize: 15, fontWeight: 800,
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: '0.02em',
          transition: 'opacity 150ms, transform 100ms',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
        onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {loading ? 'Generating...' : `✦ ${label}`}
      </button>
    </div>
  )
}
