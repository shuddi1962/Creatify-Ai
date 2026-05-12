'use client';

import { useState } from 'react';
import { Layout, Plus, FileText, Save, Download, Share2, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const SHOT_TYPES = ['Establishing', 'Wide', 'Medium', 'Close-Up', 'Extreme Close-Up', 'Two-Shot', 'Over-the-Shoulder', 'POV', 'Dutch Angle', 'Bird\'s Eye', 'Low Angle'];

export default function CinemaStoryboardPage() {
  const [scenes, setScenes] = useState([
    { id: 1, number: 1, thumbnail: null, shotType: 'Establishing', notes: 'Opening shot of the city skyline at dawn', duration: 5, status: 'done' },
    { id: 2, number: 2, thumbnail: null, shotType: 'Medium', notes: 'Main character walking through a crowded street', duration: 8, status: 'done' },
    { id: 3, number: 3, thumbnail: null, shotType: 'Close-Up', notes: 'Character finds the mysterious package', duration: 4, status: 'pending' },
  ]);
  const [totalDuration, setTotalDuration] = useState(17);

  const addScene = () => {
    const newScene = {
      id: Date.now(), number: scenes.length + 1, thumbnail: null,
      shotType: 'Medium', notes: '', duration: 5, status: 'pending',
    };
    setScenes([...scenes, newScene]);
    setTotalDuration(prev => prev + 5);
  };

  const updateScene = (id, field, value) => {
    setScenes(scenes => scenes.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, [field]: value };
      if (field === 'duration') {
        setTotalDuration(scenes.reduce((sum, sc) => sum + (sc.id === id ? parseInt(value) : sc.duration), 0));
      }
      return updated;
    }));
  };

  const deleteScene = (id) => {
    const remaining = scenes.filter(s => s.id !== id);
    setScenes(remaining.map((s, i) => ({ ...s, number: i + 1 })));
    setTotalDuration(remaining.reduce((sum, s) => sum + s.duration, 0));
  };

  const generateThumbnail = async (id) => {
    toast.success('Generating thumbnail...');
    await new Promise(r => setTimeout(r, 2000));
    setScenes(scenes => scenes.map(s => s.id === id ? { ...s, thumbnail: `https://picsum.photos/seed/scene${id}/320/180` } : s));
    toast.success('Thumbnail generated!');
  };

  const handleSave = () => toast.success('Storyboard saved');
  const handleExportPDF = () => toast.success('Exporting as PDF...');
  const handleExportImages = () => toast.success('Exporting images...');

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="SHOT TYPES">
          {SHOT_TYPES.map(t => (
            <button key={t}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '6px 10px',
                background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6,
                color: 'var(--text-secondary)', fontSize: 11, textAlign: 'left',
              }}
            >{t}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
            color: 'transparent',
            background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1, marginBottom: 16,
          }}>
            STORYBOARD BUILDER
          </h1>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', maxWidth: '90%', padding: '0 16px', zIndex: 1 }}>
            {scenes.map(scene => (
              <div key={scene.id} style={{
                flexShrink: 0, width: 200,
                background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: 'var(--accent-text)',
                  }}>{scene.number}</div>
                  <GripVertical size={12} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />
                </div>
                {scene.thumbnail ? (
                  <img src={scene.thumbnail} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%', aspectRatio: '16/9', background: 'var(--bg-input)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: 'var(--text-muted)',
                  }}>No thumbnail</div>
                )}
                <div style={{ padding: '8px 10px', display: 'flex', gap: 4 }}>
                  <button onClick={() => generateThumbnail(scene.id)}
                    style={{
                      padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                      background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)', cursor: 'pointer',
                    }}
                  >Generate</button>
                  <button onClick={() => deleteScene(scene.id)}
                    style={{
                      padding: '2px 6px', borderRadius: 4, fontSize: 9,
                      background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    }}
                  ><Trash2 size={11} /></button>
                </div>
              </div>
            ))}
            <button onClick={addScene} style={{
              flexShrink: 0, width: 200,
              border: '2px dashed var(--border-default)', borderRadius: 12,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, cursor: 'pointer', background: 'none', minHeight: 200,
            }}>
              <Plus size={24} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Add Scene</span>
            </button>
          </div>
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', width: '100%' }}>
            <button onClick={addScene}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                background: 'var(--accent-bg)', border: 'none', borderRadius: 8,
                color: 'var(--accent-text)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            ><Plus size={14} /> New Scene</button>
            <button onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8,
                color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
              }}
            ><Save size={14} /> Save</button>
            <button onClick={handleExportPDF}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8,
                color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
              }}
            ><Download size={14} /> Export</button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              Total: <strong style={{ color: 'var(--text-primary)' }}>{totalDuration}s</strong>
            </span>
          </div>
        </DirectorBar>
      }
    />
  );
}
