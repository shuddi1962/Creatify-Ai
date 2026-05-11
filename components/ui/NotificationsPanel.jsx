'use client';

import { useState } from 'react';
import { Bell, Image, Video, Zap, Info, CheckCheck, X } from 'lucide-react';

const TABS = ['All', 'Generation', 'System'];

const NOTIFICATIONS = [
  { id: 1, type: 'generation', icon: Image, title: 'Image generation complete', time: '2 min ago', color: '#6366f1' },
  { id: 2, type: 'generation', icon: Video, title: 'Video rendering finished', time: '15 min ago', color: '#10b981' },
  { id: 3, type: 'system', icon: Zap, title: 'Credits running low (10% remaining)', time: '1 hour ago', color: '#f59e0b' },
  { id: 4, type: 'system', icon: Info, title: 'New model available: Seedance 3.0', time: '3 hours ago', color: '#6366f1' },
];

export default function NotificationsPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All' ? NOTIFICATIONS
    : NOTIFICATIONS.filter(n => n.type === activeTab.toLowerCase());

  return (
    <div style={{
      width: 340,
      background: 'var(--bg-dropdown)',
      border: '1px solid var(--border-default)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-dropdown)',
      overflow: 'hidden',
      animation: 'dropIn 150ms ease',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={16} style={{ color: 'var(--text-primary)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 4, borderRadius: 6, fontSize: 11,
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title="Mark all read"
          >
            <CheckCheck size={14} />
          </button>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 4, borderRadius: 6,
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '6px 0', fontSize: 12, fontWeight: 500,
              borderRadius: 6, border: 'none', cursor: 'pointer',
              background: activeTab === tab ? 'var(--accent-bg)' : 'transparent',
              color: activeTab === tab ? 'var(--accent-text)' : 'var(--text-secondary)',
              transition: 'all 100ms',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '32px 16px', gap: 8,
          }}>
            <Bell size={24} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>You're all caught up</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>No new notifications</span>
          </div>
        ) : (
          filtered.map(n => (
            <div key={n.id} style={{
              display: 'flex', gap: 10, padding: '10px 16px',
              cursor: 'pointer', transition: 'background 100ms',
              borderBottom: '1px solid var(--border-subtle)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${n.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <n.icon size={14} style={{ color: n.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{n.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <button style={{
          width: '100%', padding: '10px 16px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 500, color: 'var(--accent-text)',
          borderTop: '1px solid var(--border-subtle)',
          transition: 'background 100ms',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Mark all as read
        </button>
      )}
    </div>
  );
}
