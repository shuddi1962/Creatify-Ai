'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Image, Video, Mic, Film, Briefcase, Workflow, Zap, Settings, Home, ChevronRight } from 'lucide-react';

const SEARCH_ITEMS = [
  { category: 'Pages', items: [
    { label: 'Home', href: '/studio/home', icon: Home },
    { label: 'Settings', href: '/studio/settings', icon: Settings },
    { label: 'Pricing', href: '/studio/pricing', icon: Zap },
  ]},
  { category: 'Image Studio', items: [
    { label: 'Text to Image', href: '/studio/image/text-to-image', icon: Image },
    { label: 'Image to Image', href: '/studio/image/image-to-image', icon: Image },
    { label: 'Camera Angle', href: '/studio/image/camera-angle', icon: Image },
    { label: 'Inpaint', href: '/studio/image/inpaint', icon: Image },
    { label: 'Remove Background', href: '/studio/image/remove-bg', icon: Image },
    { label: 'Upscale', href: '/studio/image/upscale', icon: Image },
  ]},
  { category: 'Video Studio', items: [
    { label: 'Text to Video', href: '/studio/video/text-to-video', icon: Video },
    { label: 'Image to Video', href: '/studio/video/image-to-video', icon: Video },
    { label: 'Smart Shot', href: '/studio/video/smart-shot', icon: Video },
    { label: 'Camera Motion', href: '/studio/video/camera-motion', icon: Video },
  ]},
  { category: 'Cinema Studio', items: [
    { label: 'Cinematic Generator', href: '/studio/cinema/generate', icon: Film },
    { label: 'VFX Presets', href: '/studio/cinema/vfx', icon: Film },
    { label: 'Color Grading', href: '/studio/cinema/color-grading', icon: Film },
    { label: 'Storyboard', href: '/studio/cinema/storyboard', icon: Film },
  ]},
  { category: 'More', items: [
    { label: 'Lip Sync', href: '/studio/lipsync/portrait', icon: Mic },
    { label: 'Marketing Studio', href: '/studio/marketing/ugc', icon: Briefcase },
    { label: 'Workflows', href: '/studio/workflows/canvas', icon: Workflow },
    { label: 'Audio Studio', href: '/studio/audio', icon: Mic },
  ]},
];

export default function CommandPalette({ onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  const flatItems = SEARCH_ITEMS.flatMap(s =>
    s.items.filter(i =>
      !query || i.label.toLowerCase().includes(query.toLowerCase())
    )
  );

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && flatItems[selectedIndex]) {
      router.push(flatItems[selectedIndex].href);
      onClose();
    }
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh]"
      onClick={onClose}
      style={{ background: 'var(--bg-overlay)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 580,
          background: 'var(--bg-dropdown)',
          border: '1px solid var(--border-default)',
          borderRadius: 16,
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
          animation: 'fade-in-up 0.2s ease',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, tools, models..."
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              color: 'var(--text-primary)', fontSize: 15,
            }}
          />
          <kbd style={{
            fontSize: 10, color: 'var(--text-muted)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            borderRadius: 4, padding: '2px 6px',
          }}>ESC</kbd>
        </div>

        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '8px' }}>
          {flatItems.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No results found
            </div>
          ) : (
            <>
              {query === '' && SEARCH_ITEMS.map(section => (
                <div key={section.category}>
                  <div style={{
                    fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                    padding: '8px 12px 4px',
                  }}>
                    {section.category}
                  </div>
                  {section.items.map((item, i) => {
                    const Icon = item.icon;
                    const globalIndex = SEARCH_ITEMS.flatMap(s => s.items).indexOf(item);
                    return (
                      <button
                        key={item.href}
                        onClick={() => { router.push(item.href); onClose(); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          width: '100%', padding: '8px 12px',
                          borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: globalIndex === selectedIndex ? 'var(--accent-bg)' : 'transparent',
                          color: globalIndex === selectedIndex ? 'var(--accent-text)' : 'var(--text-primary)',
                          fontSize: 13, textAlign: 'left',
                          transition: 'all 100ms',
                        }}
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                        <ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                      </button>
                    );
                  })}
                </div>
              ))}
              {query !== '' && flatItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => { router.push(item.href); onClose(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '8px 12px',
                      borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: i === selectedIndex ? 'var(--accent-bg)' : 'transparent',
                      color: i === selectedIndex ? 'var(--accent-text)' : 'var(--text-primary)',
                      fontSize: 13, textAlign: 'left',
                      transition: 'all 100ms',
                    }}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    <ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
