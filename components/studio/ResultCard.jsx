'use client'

import { useState } from 'react'
import { Download, Edit3, Share2, Maximize2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResultCard({ item, type, onDownload, onEdit }) {
  const [hovered, setHovered] = useState(false)

  const handleDownload = () => {
    if (item.url) {
      const a = document.createElement('a')
      a.href = item.url
      a.download = item.filename || 'output'
      a.click()
      toast.success('Downloading...')
    }
  }

  const handleShare = () => {
    if (item.url) {
      navigator.clipboard.writeText(item.url)
      toast.success('Link copied to clipboard')
    }
  }

  const handleFullscreen = () => {
    if (item.url) window.open(item.url, '_blank')
  }

  const actionButtons = [
    { icon: Download, label: 'Download', action: onDownload || handleDownload },
    { icon: Edit3, label: 'Edit', action: onEdit },
    { icon: Share2, label: 'Share', action: handleShare },
    { icon: Maximize2, label: 'Fullscreen', action: handleFullscreen },
  ]

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16, overflow: 'hidden',
        transition: 'border-color 200ms, transform 200ms',
        ...(hovered ? {
          borderColor: 'var(--border-active)',
          transform: 'translateY(-2px)',
        } : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
        {type === 'video' ? (
          <video
            src={item.url}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            muted
            {...(hovered ? { autoPlay: true } : {})}
            loop playsInline
          />
        ) : (
          <img
            src={item.url}
            alt={item.prompt || 'Generated'}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        <div style={{
          position: 'absolute', inset: 0,
          background: hovered ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 200ms',
          opacity: hovered ? 1 : 0,
        }}>
          {actionButtons.map(({ icon: Icon, label, action }) => action && (
            <button
              key={label}
              onClick={action}
              title={label}
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px 12px' }}>
        <div style={{
          fontSize: 12, color: 'var(--text-primary)',
          fontWeight: 500, marginBottom: 4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.prompt || 'Generated'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {item.model && (
            <span style={{
              fontSize: 10, color: 'var(--text-muted)',
              background: 'var(--bg-input)',
              padding: '2px 6px', borderRadius: 4,
            }}>
              {item.model}
            </span>
          )}
          {item.creditCost && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {item.creditCost} credits
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
