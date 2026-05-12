'use client';

import { useState } from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const PROJECTS = [
  { id: 1, name: 'Product Campaign', count: 24, preview: ['https://picsum.photos/seed/p1/100/100', 'https://picsum.photos/seed/p2/100/100', 'https://picsum.photos/seed/p3/100/100'], updated: '2 hours ago' },
  { id: 2, name: 'Social Media Pack', count: 18, preview: ['https://picsum.photos/seed/s1/100/100', 'https://picsum.photos/seed/s2/100/100'], updated: '1 day ago' },
  { id: 3, name: 'Brand Assets', count: 12, preview: ['https://picsum.photos/seed/b1/100/100'], updated: '3 days ago' },
  { id: 4, name: 'Client Work', count: 36, preview: ['https://picsum.photos/seed/c1/100/100', 'https://picsum.photos/seed/c2/100/100', 'https://picsum.photos/seed/c3/100/100', 'https://picsum.photos/seed/c4/100/100'], updated: '1 week ago' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(PROJECTS);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');

  const createProject = () => {
    if (!newName.trim()) return;
    setProjects([{ id: Date.now(), name: newName, count: 0, preview: [], updated: 'Just now' }, ...projects]);
    setNewName('');
    setShowNew(false);
  };

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="PROJECTS">
          <div style={{ padding: 8, color: 'var(--text-secondary)', fontSize: 12 }}>
            {projects.length} projects
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
              textAlign: 'center', marginBottom: 24,
            }}>
              MY PROJECTS
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {projects.map(proj => (
                <div key={proj.id} style={{
                  background: 'var(--bg-card)', borderRadius: 12,
                  border: '1px solid var(--border-subtle)', padding: 16,
                  cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FolderOpen size={20} style={{ color: '#CCFF00' }} />
                      <div>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{proj.name}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>{proj.count} items &middot; {proj.updated}</p>
                      </div>
                    </div>
                  </div>
                  {proj.preview.length > 0 && (
                    <div style={{ display: 'flex' }}>
                      {proj.preview.map((src, i) => (
                        <img key={i} src={src} style={{ width: 28, height: 28, borderRadius: 6, border: '2px solid var(--bg-card)', marginRight: -8 }} alt="" />
                      ))}
                      {proj.count > proj.preview.length && (
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 10 }}>
                          +{proj.count - proj.preview.length}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {showNew && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
                onClick={() => setShowNew(false)}>
                <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24, width: '100%', maxWidth: 360 }}
                  onClick={e => e.stopPropagation()}>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16 }}>New Project</h3>
                  <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Project name"
                    style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', marginBottom: 16 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setShowNew(false)}
                      style={{ flex: 1, padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}
                    >Cancel</button>
                    <button onClick={createProject}
                      style={{ flex: 1, padding: '10px', background: '#CCFF00', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >Create</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <GenerateButton onClick={() => setShowNew(true)} credits={0}>
            <Plus size={14} /> New Project
          </GenerateButton>
        </DirectorBar>
      }
    />
  );
}
