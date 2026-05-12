'use client';

import { useState } from 'react';
import { Video, Upload, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import AspectRatioPicker from '@/components/studio/AspectRatioPicker';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const SAMPLE_ROWS = [
  { id: 1, prompt: 'Epic mountain drone shot', model: 'seedance-2', duration: '5', aspect_ratio: '16:9', status: 'pending', progress: 0 },
  { id: 2, prompt: 'City street timelapse at night', model: 'kling-3', duration: '5', aspect_ratio: '16:9', status: 'pending', progress: 0 },
  { id: 3, prompt: 'Product reveal animation', model: 'seedance-2', duration: '10', aspect_ratio: '1:1', status: 'pending', progress: 0 },
];

export default function BulkVideoPage() {
  const [csvFile, setCsvFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [model, setModel] = useState('seedance-2');
  const [duration, setDuration] = useState('5');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [naming, setNaming] = useState('Sequential');
  const [generating, setGenerating] = useState(false);
  const [started, setStarted] = useState(false);

  const handleCSV = (file) => {
    setCsvFile(file);
    setRows(SAMPLE_ROWS);
    toast.success('CSV loaded — 3 videos in batch');
  };

  const handleStart = async () => {
    if (rows.length === 0) { toast.error('No videos to generate'); return; }
    setStarted(true);
    setGenerating(true);
    toast.success('Bulk video generation started!');
    for (const row of rows) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'generating', progress: 0 } : r));
      for (let p = 0; p <= 100; p += 10) {
        await new Promise(r => setTimeout(r, 400));
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, progress: p } : r));
      }
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'completed', progress: 100, url: `https://picsum.photos/seed/videobulk${row.id}/640/360` } : r));
    }
    setGenerating(false);
    toast.success('Bulk video generation complete!');
  };

  const completed = rows.filter(r => r.status === 'completed').length;

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="CSV UPLOAD">
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 24, border: '2px dashed var(--border-subtle)', borderRadius: 12, cursor: 'pointer', background: 'var(--bg-card)' }}>
            <Upload size={24} style={{ color: 'var(--text-muted)' }} />
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'center' }}>Drag & drop CSV<br />Columns: prompt, model, duration</p>
            <input type="file" accept=".csv" onChange={e => e.target.files?.[0] && handleCSV(e.target.files[0])} style={{ display: 'none' }} />
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
            BULK VIDEO
          </h1>
          {rows.length > 0 && !started && (
            <div style={{ zIndex: 1, marginTop: 24, width: '100%', maxWidth: 500, padding: 16, maxHeight: '50%', overflowY: 'auto' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>{rows.length} Videos in Batch</span>
              {rows.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-card)', borderRadius: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 24 }}>#{r.id}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.prompt}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.model}</span>
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
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.prompt}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                    background: r.status === 'completed' ? 'rgba(74,222,128,0.2)' : r.status === 'generating' ? 'rgba(204,255,0,0.2)' : 'var(--bg-input)',
                    color: r.status === 'completed' ? '#4ade80' : r.status === 'generating' ? '#CCFF00' : 'var(--text-muted)',
                  }}>{r.status}</span>
                  {r.status === 'generating' && <div style={{ width: 60, height: 6, background: 'var(--bg-input)', borderRadius: 100 }}><div style={{ height: '100%', background: '#CCFF00', borderRadius: 100, width: `${r.progress}%` }} /></div>}
                  {r.status === 'completed' && r.url && <img src={r.url} alt="" style={{ width: 40, height: 24, borderRadius: 4, objectFit: 'cover' }} />}
                </div>
              ))}
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Settings">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <ModelSelector value={model} onChange={setModel} type="video" />
            <StudioDropdown label="Ratio" options={['16:9', '1:1', '9:16']} value={aspectRatio} onChange={setAspectRatio} />
            <StudioDropdown label="Duration" options={['5', '10']} value={duration} onChange={setDuration} />
            <StudioDropdown label="Naming" options={['Sequential', 'Row Number', 'Custom Prefix']} value={naming} onChange={setNaming} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {rows.length > 0 && !started && (
              <button onClick={handleStart} style={{ padding: '10px 24px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>START BULK</button>
            )}
            {started && completed > 0 && (
              <button onClick={() => toast.success('Downloading ZIP...')} style={{ padding: '10px 24px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Download size={14} /> Download</button>
            )}
          </div>
        </DirectorBar>
      }
    />
  );
}
