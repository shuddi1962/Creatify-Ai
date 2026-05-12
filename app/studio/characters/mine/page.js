'use client';

import { useState } from 'react';
import { Users, UserPlus, Image, Video, Edit, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';
import Link from 'next/link';

const SAMPLE_CHARACTERS = [
  { id: 1, name: 'Sarah', type: 'Real Person', images: 12, avatar: 'https://picsum.photos/seed/sarah/200' },
  { id: 2, name: 'The Explorer', type: 'Fictional', images: 8, avatar: 'https://picsum.photos/seed/explorer/200' },
  { id: 3, name: 'Cyber Cop', type: '3D', images: 5, avatar: 'https://picsum.photos/seed/cybercop/200' },
  { id: 4, name: 'Mia', type: 'Anime', images: 15, avatar: 'https://picsum.photos/seed/mia/200' },
];
const OPTIONS = SAMPLE_CHARACTERS.map(c => c.name);

export default function MyCharactersPage() {
  const [characters, setCharacters] = useState(SAMPLE_CHARACTERS);
  const [option, setOption] = useState('All');
  const [prompt, setPrompt] = useState('');

  const handleDelete = (id) => {
    setCharacters(characters.filter(c => c.id !== id));
    toast.success('Character deleted');
  };

  const filtered = option === 'All' ? characters : characters.filter(c => c.name === option);

  return (
    <>
      <Toaster position="top-center" />
      <StudioEditorLayout
        left={
          <LeftPanel title="CHARACTERS">
            <button onClick={() => setOption('All')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: option === 'All' ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: option === 'All' ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left',
              }}
            >All Characters</button>
            {OPTIONS.map(p => (
              <button key={p} onClick={() => setOption(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '8px 12px',
                  background: option === p ? 'var(--accent-bg)' : 'none',
                  border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: option === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                }}
              >{p}</button>
            ))}
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '40px' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
                color: 'transparent',
                background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textAlign: 'center', zIndex: 1, marginBottom: 32,
              }}>
                MY CHARACTERS
              </h1>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ width: 80, height: 80, background: 'var(--bg-input)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Users size={32} color="var(--text-muted)" /></div>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>No characters yet</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Create your first character to use across generations</p>
                  <Link href="/studio/characters/create" style={{ display: 'inline-block', padding: '10px 24px', background: '#CCFF00', color: 'black', fontWeight: 700, borderRadius: 12, textDecoration: 'none', fontSize: 14 }}>Create Character</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 700, margin: '0 auto' }}>
                  {filtered.map(char => (
                    <div key={char.id} style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                        <img src={char.avatar} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} alt="" />
                        <div>
                          <h3 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{char.name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(124,58,237,0.2)', color: '#7C3AED', borderRadius: 4 }}>{char.type}</span>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{char.images} videos</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => toast.success('Opening image generator...')} style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-input)', color: 'var(--text-secondary)', fontSize: 12, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Image size={12} /> Image</button>
                        <button onClick={() => toast.success('Opening video generator...')} style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-input)', color: 'var(--text-secondary)', fontSize: 12, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Video size={12} /> Video</button>
                        <button onClick={() => toast.success('Editing character...')} style={{ padding: '8px', background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}><Edit size={14} /></button>
                        <button onClick={() => handleDelete(char.id)} style={{ padding: '8px', background: 'var(--bg-input)', color: 'var(--text-secondary)', borderRadius: 8, border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Actions">
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Search characters..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <Link href="/studio/characters/create" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#CCFF00', color: 'black', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                <UserPlus size={16} /> Create New Character
              </Link>
            </div>
          </DirectorBar>
        }
      />
    </>
  );
}
