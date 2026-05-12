'use client';

import { useState } from 'react';
import { Music, Search, Play, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const AUDIO_FILES = [
  { id: 1, name: 'voiceover-1.mp3', model: 'ElevenLabs', date: 'May 8', size: '4.1 MB', duration: '2:34' },
  { id: 2, name: 'voiceover-2.mp3', model: 'ElevenLabs', date: 'May 7', size: '3.8 MB', duration: '2:12' },
  { id: 3, name: 'background-music.mp3', model: 'Suno', date: 'May 6', size: '8.2 MB', duration: '3:45' },
  { id: 4, name: 'product-intro.mp3', model: 'ElevenLabs', date: 'May 5', size: '2.9 MB', duration: '1:48' },
];

export default function AudioPage() {
  const [audioFiles] = useState(AUDIO_FILES);
  const [search, setSearch] = useState('');
  const [playing, setPlaying] = useState(null);
  const filtered = audioFiles.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="AUDIO">
          <div style={{ padding: 8, color: 'var(--text-secondary)', fontSize: 12 }}>
            {audioFiles.length} audio files
          </div>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <div style={{ zIndex: 1, padding: 24, width: '100%', height: '100%', overflowY: 'auto' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textAlign: 'center', marginBottom: 6,
            }}>
              AUDIO
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>{filtered.length} audio files</p>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              {filtered.map(audio => (
                <div key={audio.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'var(--bg-card)', borderRadius: 12,
                  border: '1px solid var(--border-subtle)', padding: '12px 16px',
                  marginBottom: 8,
                }}>
                  <button onClick={() => setPlaying(playing === audio.id ? null : audio.id)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'var(--accent-bg)', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    <Play size={14} style={{ color: 'var(--accent-text)', marginLeft: 2 }} />
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{audio.name}</p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{audio.model}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{audio.duration}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{audio.size}</span>
                    </div>
                  </div>
                  <button onClick={() => toast.success('Downloading audio...')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                    <Download size={14} />
                  </button>
                  <button onClick={() => toast.success('Audio deleted')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Search">
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audio..."
              style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px 8px 32px', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
            />
          </div>
        </DirectorBar>
      }
    />
  );
}
