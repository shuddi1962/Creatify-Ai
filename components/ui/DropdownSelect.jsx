'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function DropdownSelect({ value, onChange, options = [], placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const normalized = options.map(o => (typeof o === 'string' ? { id: o, label: o } : o));
  const selected = normalized.find(o => o.id === value) || normalized[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: '8px 12px',
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 150ms ease',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => !open && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={14} style={{ color: '#888', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
      </button>

      {open && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
            }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              zIndex: 100,
              background: '#1C1C1C',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: 4,
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              maxHeight: 240,
              overflowY: 'auto',
            }}
          >
            {normalized.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { onChange(opt.id); setOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: opt.id === value ? 'rgba(0,200,150,0.15)' : 'transparent',
                  color: opt.id === value ? '#00C896' : '#ccc',
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 100ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = opt.id === value ? 'rgba(0,200,150,0.15)' : 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = opt.id === value ? 'rgba(0,200,150,0.15)' : 'transparent'}
              >
                <span>{opt.label}</span>
                {opt.id === value && <span style={{ color: '#00C896', fontSize: 11 }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
