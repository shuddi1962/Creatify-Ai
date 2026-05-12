'use client';

import { useState } from 'react';
import { Search, Image, Video, Music, Download, Share2, Trash2, Grid, List } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import StudioDropdown from '@/components/StudioDropdown';

const SAMPLE_ASSETS = [
  { id: 1, type: 'image', url: 'https://picsum.photos/seed/a1/400/300', name: 'hero-banner.png', model: 'Flux', date: 'May 10', size: '2.4 MB' },
  { id: 2, type: 'video', url: 'https://picsum.photos/seed/a2/400/225', name: 'product-reel.mp4', model: 'Seedance', date: 'May 9', size: '18.7 MB' },
  { id: 3, type: 'image', url: 'https://picsum.photos/seed/a3/400/300', name: 'thumbnail-1.png', model: 'Flux', date: 'May 8', size: '1.2 MB' },
  { id: 4, type: 'audio', name: 'voiceover-1.mp3', model: 'ElevenLabs', date: 'May 8', size: '4.1 MB' },
  { id: 5, type: 'image', url: 'https://picsum.photos/seed/a5/400/300', name: 'social-post.png', model: 'Flux', date: 'May 7', size: '980 KB' },
  { id: 6, type: 'video', url: 'https://picsum.photos/seed/a6/400/225', name: 'ad-clip.mp4', model: 'Kling', date: 'May 6', size: '24.3 MB' },
  { id: 7, type: 'image', url: 'https://picsum.photos/seed/a7/400/300', name: 'headshot.png', model: 'Realistic', date: 'May 5', size: '1.8 MB' },
  { id: 8, type: 'image', url: 'https://picsum.photos/seed/a8/400/300', name: 'product-shot.png', model: 'Flux', date: 'May 4', size: '2.1 MB' },
];

const TYPE_FILTERS = ['All', 'Images', 'Videos', 'Audio'];
const SORTS = ['Newest', 'Oldest', 'Name', 'Size'];

export default function MediaAllPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest');
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState([]);
  const [assets] = useState(SAMPLE_ASSETS);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === assets.length ? [] : assets.map(a => a.id));

  const filtered = assets.filter(a => {
    if (typeFilter !== 'All' && a.type !== typeFilter.slice(0, -1).toLowerCase()) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="FILTERS">
          {TYPE_FILTERS.map(f => (
            <button key={f} onClick={() => setTypeFilter(f)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: typeFilter === f ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: typeFilter === f ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >
              {f === 'Images' ? <Image size={14} /> : f === 'Videos' ? <Video size={14} /> : f === 'Audio' ? <Music size={14} /> : null}
              {f}
            </button>
          ))}
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '8px 0' }} />
          {SORTS.map(s => (
            <button key={s} onClick={() => setSort(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: sort === s ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: sort === s ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >{s}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, padding: 24, width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 16,
            }}>
              MEDIA LIBRARY
            </h1>
            {selected.length > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 16px', background: 'var(--accent-bg)', borderRadius: 10,
                marginBottom: 12,
              }}>
                <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{selected.length} selected</span>
                <button style={{ padding: '4px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>Download</button>
                <button style={{ padding: '4px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>Delete</button>
                <button onClick={() => setSelected([])} style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', background: 'none', border: 'none' }}>Clear</button>
              </div>
            )}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {view === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {filtered.map(asset => (
                    <div key={asset.id} onClick={() => toggleSelect(asset.id)}
                      style={{
                        background: 'var(--bg-card)', borderRadius: 12,
                        border: selected.includes(asset.id) ? '2px solid #CCFF00' : '1px solid var(--border-subtle)',
                        overflow: 'hidden', cursor: 'pointer',
                      }}
                    >
                      <div style={{ aspectRatio: '1', background: 'var(--bg-input)' }}>
                        {asset.url ? <img src={asset.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {asset.type === 'video' ? <Video size={20} style={{ color: 'var(--text-muted)' }} /> : <Music size={20} style={{ color: 'var(--text-muted)' }} />}
                          </div>
                        )}
                      </div>
                      <div style={{ padding: 8 }}>
                        <p style={{ color: 'var(--text-primary)', fontSize: 11, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{asset.name}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 10 }}>{asset.date} &middot; {asset.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={{ padding: 12, textAlign: 'left' }}><input type="checkbox" checked={selected.length === filtered.length} onChange={toggleAll} /></th>
                        <th style={{ padding: 12, textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Name</th>
                        <th style={{ padding: 12, textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</th>
                        <th style={{ padding: 12, textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Model</th>
                        <th style={{ padding: 12, textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Size</th>
                        <th style={{ padding: 12, textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(asset => (
                        <tr key={asset.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: 12 }}><input type="checkbox" checked={selected.includes(asset.id)} onChange={() => toggleSelect(asset.id)} /></td>
                          <td style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {asset.url && <img src={asset.url} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} alt="" />}
                            <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>{asset.name}</span>
                          </td>
                          <td style={{ padding: 12 }}><span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--accent-bg)', color: 'var(--accent-text)', borderRadius: 4 }}>{asset.type}</span></td>
                          <td style={{ padding: 12, color: 'var(--text-secondary)', fontSize: 12 }}>{asset.model}</td>
                          <td style={{ padding: 12, color: 'var(--text-secondary)', fontSize: 12 }}>{asset.size}</td>
                          <td style={{ padding: 12, color: 'var(--text-secondary)', fontSize: 12 }}>{asset.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Assets">
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..."
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px 8px 32px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <ControlButton onClick={() => setView('grid')} style={{ background: view === 'grid' ? 'var(--accent-bg)' : 'var(--bg-input)', color: view === 'grid' ? 'var(--accent-text)' : 'var(--text-secondary)' }}><Grid size={12} /></ControlButton>
            <ControlButton onClick={() => setView('list')} style={{ background: view === 'list' ? 'var(--accent-bg)' : 'var(--bg-input)', color: view === 'list' ? 'var(--accent-text)' : 'var(--text-secondary)' }}><List size={12} /></ControlButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
