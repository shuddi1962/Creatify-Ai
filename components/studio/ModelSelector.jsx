'use client';

import { ChevronDown } from 'lucide-react';
import { IMAGE_MODELS, VIDEO_MODELS, AUDIO_MODELS, LIPSYNC_MODELS } from 'studio/src/models';

export default function ModelSelector({ value, onChange, type = 'image' }) {
  const models = type === 'video' ? VIDEO_MODELS
    : type === 'audio' ? AUDIO_MODELS
    : type === 'lipsync' ? LIPSYNC_MODELS
    : IMAGE_MODELS;
  const selected = models.find(m => m.id === value) || models[0];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance: 'none',
          width: '100%',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: '10px 16px',
          paddingRight: 36,
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 150ms',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--border-active)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
      >
        {models.map(m => (
          <option key={m.id} value={m.id} style={{ background: 'var(--bg-dropdown)', color: 'var(--text-primary)' }}>
            {m.name}{m.badge ? ` (${m.badge})` : ''}
          </option>
        ))}
      </select>
      <ChevronDown size={16} style={{
        position: 'absolute', right: 12, top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
