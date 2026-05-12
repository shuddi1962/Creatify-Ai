'use client';

import { useState } from 'react';
import { Mic, Upload, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const QUALITY_OPTIONS = ['standard', 'high'];

export default function BulkLipsyncPage() {
  const [character, setCharacter] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [model, setModel] = useState('infinite-talk');
  const [quality, setQuality] = useState('high');
  const [rows, setRows] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [started, setStarted] = useState(false);

  const handleCharacter = (file) => {
    setCharacter(file);
    toast.success('Character image loaded');
  };

  const handleCSVUplod = (file) => {
    setCsvFile(file);
    const audioRows = [
      { id: 1, filename: 'welcome.mp3', status: 'pending', progress: 0 },
      { id: 2, filename: 'product_intro.mp3', status: 'pending', progress: 0 },
      { id: 3, filename: 'testimonial_1.mp3', status: 'pending', progress: 0 },
      { id: 4, filename: 'testimonial_2.mp3', status: 'pending', progress: 0 },
      { id: 5, filename: 'call_to_action.mp3', status: 'pending', progress: 0 },
    ];
    setRows(audioRows);
    toast.success('CSV loaded — 5 audio files detected');
  };

  const handleStart = async () => {
    if (!character) { toast.error('Please upload a character image'); return; }
    if (rows.length === 0) { toast.error('No audio files loaded'); return; }
    setStarted(true);
    setGenerating(true);
    toast.success('Bulk lip sync started!');
    for (const row of rows) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'generating', progress: 0 } : r));
      for (let p = 0; p <= 100; p += 10) {
        await new Promise(r => setTimeout(r, 500));
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, progress: p } : r));
      }
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'completed', progress: 100, url: `https://picsum.photos/seed/lipsync${row.id}/512/512` } : r));
    }
    setGenerating(false);
    toast.success('Bulk lip sync complete!');
  };

  const completed = rows.filter(r => r.status === 'completed').length;

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="CHARACTER">
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 20, border: '2px dashed var(--border-subtle)', borderRadius: 12, cursor: 'pointer', background: 'var(--bg-card)' }}>
            {character ? (
              <img src={URL.createObjectURL(character)} alt="" style={{ width: '100%', aspectRatio: '1', borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <>
                <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>Upload character portrait</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleCharacter(e.target.files[0])} style={{ display: 'none' }} />
          </label>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            BULK LIP SYNC
          </h1>
          {rows.length > 0 && !started && (
            <div style={{ zIndex: 1, marginTop: 24, width: '100%', maxWidth: 500, padding: 16, maxHeight: '50%', overflowY: 'auto' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>{rows.length} Audio Files</span>
              {rows.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-card)', borderRadius: 8, marginBottom: 4 }}>
                  <Mic size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1 }}>{r.filename}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Ready</span>
                </div>
              ))}
            </div>
          )}
          {started && (
            <div style={{ zIndex: 1, marginTop: 24, width: '100%', maxWidth: 500, padding: 16, maxHeight: '50%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{completed}/{rows.length}</span>
                <div style={{ flex: 1, height: 8, background: 'var(--bg-input)', borderRadius: 100 }}>
                  <div style={{ height: '100%', background: '#CCFF00', borderRadius: 100, width: `${rows.length > 0 ? (completed / rows.length) * 100 : 0}%` }} />
                </div>
              </div>
              {rows.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 10, marginBottom: 4, border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', width: 24 }}>#{r.id}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1 }}>{r.filename}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                    background: r.status === 'completed' ? 'rgba(74,222,128,0.2)' : r.status === 'generating' ? 'rgba(204,255,0,0.2)' : 'var(--bg-input)',
                    color: r.status === 'completed' ? '#4ade80' : r.status === 'generating' ? '#CCFF00' : 'var(--text-muted)',
                  }}>{r.status}</span>
                  {r.status === 'generating' && <div style={{ width: 60, height: 6, background: 'var(--bg-input)', borderRadius: 100 }}><div style={{ height: '100%', background: '#CCFF00', borderRadius: 100, width: `${r.progress}%` }} /></div>}
                  {r.status === 'completed' && r.url && <img src={r.url} alt="" style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} />}
                </div>
              ))}
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Settings">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ModelSelector value={model} onChange={setModel} type="lipsync" />
            <StudioDropdown label="Quality" options={QUALITY_OPTIONS} value={quality} onChange={setQuality} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Upload size={12} /> Audio CSV
              <input type="file" accept=".csv,.mp3,.wav" multiple onChange={e => {
                const files = Array.from(e.target.files || []);
                const csv = files.find(f => f.name.endsWith('.csv'));
                const audios = files.filter(f => !f.name.endsWith('.csv'));
                if (csv) handleCSVUplod(csv);
                if (audios.length > 0) {
                  setRows(audios.map((f, i) => ({ id: i + 1, filename: f.name, status: 'pending', progress: 0 })));
                  toast.success(`${audios.length} audio files loaded`);
                }
              }} style={{ display: 'none' }} />
            </label>
            {rows.length > 0 && !started && (
              <button onClick={handleStart} style={{ padding: '10px 24px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>START LIP SYNC</button>
            )}
            {started && completed > 0 && (
              <button style={{ padding: '10px 24px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Download size={14} /> Download</button>
            )}
          </div>
        </DirectorBar>
      }
    />
  );
}
