'use client';

import { useState } from 'react';
import { Image, Upload, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import AspectRatioPicker from '@/components/studio/AspectRatioPicker';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const NAMING_OPTIONS = ['Sequential', 'Row Number', 'Custom Prefix'];
const OUTPUT_FORMATS = ['PNG', 'JPEG', 'WEBP'];

const SAMPLE_ROWS = [
  { id: 1, prompt: 'A majestic mountain landscape at sunset', status: 'pending', progress: 0 },
  { id: 2, prompt: 'Portrait of a person with dramatic lighting', status: 'pending', progress: 0 },
  { id: 3, prompt: 'Futuristic city with flying cars', status: 'pending', progress: 0 },
  { id: 4, prompt: 'Close-up of a flower in macro photography', status: 'pending', progress: 0 },
  { id: 5, prompt: 'Abstract art with geometric shapes', status: 'pending', progress: 0 },
];

export default function BulkImagePage() {
  const [inputMode, setInputMode] = useState('csv');
  const [csvFile, setCsvFile] = useState(null);
  const [manualList, setManualList] = useState('');
  const [model, setModel] = useState('gpt-image-2');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('standard');
  const [stylePreset, setStylePreset] = useState('none');
  const [naming, setNaming] = useState('Sequential');
  const [outputFormat, setOutputFormat] = useState('PNG');
  const [rows, setRows] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [started, setStarted] = useState(false);
  const [credits, setCredits] = useState(0);

  const estimatedCredits = rows.length * 10;

  const handleCSVUplod = (file) => {
    setCsvFile(file);
    toast.success('CSV loaded — 5 prompts detected');
    setRows(SAMPLE_ROWS);
    setCredits(SAMPLE_ROWS.length * 10);
  };

  const handleManualStart = () => {
    const prompts = manualList.split('\n').filter(l => l.trim());
    if (prompts.length === 0) { toast.error('Enter at least one prompt'); return; }
    const newRows = prompts.map((p, i) => ({ id: i + 1, prompt: p.trim(), status: 'pending', progress: 0 }));
    setRows(newRows);
    setCredits(newRows.length * 10);
    toast.success(`${newRows.length} prompts loaded`);
  };

  const handleStart = async () => {
    if (rows.length === 0) { toast.error('No prompts loaded'); return; }
    setStarted(true);
    setGenerating(true);
    toast.success('Bulk generation started!');
    for (const row of rows) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'generating', progress: 0 } : r));
      for (let p = 0; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 300));
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, progress: p } : r));
      }
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'completed', progress: 100, url: `https://picsum.photos/seed/bulk${row.id}/512/512` } : r));
    }
    setGenerating(false);
    toast.success('Bulk generation complete!');
  };

  const handleCancel = () => {
    setStarted(false);
    setRows(rows.map(r => ({ ...r, status: r.status === 'generating' ? 'cancelled' : r.status })));
    setGenerating(false);
  };

  const completed = rows.filter(r => r.status === 'completed').length;

  return (
    <StudioEditorLayout
      left={
        <LeftPanel title="INPUT">
          <button onClick={() => setInputMode('csv')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: inputMode === 'csv' ? 'var(--accent-bg)' : 'none',
              border: 'none', cursor: 'pointer', borderRadius: 8,
              color: inputMode === 'csv' ? 'var(--accent-text)' : 'var(--text-secondary)',
              fontSize: 13, textAlign: 'left',
            }}
          >CSV Upload</button>
          <button onClick={() => setInputMode('manual')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '8px 12px',
              background: inputMode === 'manual' ? 'var(--accent-bg)' : 'none',
              border: 'none', cursor: 'pointer', borderRadius: 8,
              color: inputMode === 'manual' ? 'var(--accent-text)' : 'var(--text-secondary)',
              fontSize: 13, textAlign: 'left',
            }}
          >Manual List</button>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            BULK IMAGE
          </h1>
          {!started && rows.length === 0 && inputMode === 'csv' && (
            <label style={{ zIndex: 1, marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40, border: '2px dashed var(--border-subtle)', borderRadius: 16, cursor: 'pointer', background: 'var(--bg-card)', maxWidth: 400 }}>
              <Upload size={28} style={{ color: 'var(--text-muted)' }} />
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Drag & drop CSV file</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>prompt column required</p>
              <input type="file" accept=".csv" onChange={e => e.target.files?.[0] && handleCSVUplod(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          )}
          {!started && rows.length === 0 && inputMode === 'manual' && (
            <div style={{ zIndex: 1, marginTop: 24, width: '100%', maxWidth: 500, padding: 16 }}>
              <textarea value={manualList} onChange={e => setManualList(e.target.value)} placeholder="Enter one prompt per line" style={{ width: '100%', height: 160, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 16, fontSize: 13, color: 'var(--text-primary)', resize: 'none' }} />
              <button onClick={handleManualStart} style={{ marginTop: 12, padding: '10px 24px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Load Prompts</button>
            </div>
          )}
          {rows.length > 0 && !started && (
            <div style={{ zIndex: 1, marginTop: 24, width: '100%', maxWidth: 500, padding: 16, maxHeight: '50%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{rows.length} Prompts Loaded</span>
                <span style={{ fontSize: 12, color: '#CCFF00', fontWeight: 600 }}>{estimatedCredits} credits</span>
              </div>
              {rows.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-card)', borderRadius: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 24 }}>#{r.id}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.prompt}</span>
                </div>
              ))}
            </div>
          )}
          {started && (
            <div style={{ zIndex: 1, marginTop: 24, width: '100%', maxWidth: 500, padding: 16, maxHeight: '50%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{completed}/{rows.length}</span>
                <div style={{ flex: 1, height: 8, background: 'var(--bg-input)', borderRadius: 100 }}>
                  <div style={{ height: '100%', background: '#CCFF00', borderRadius: 100, transition: 'width 300ms', width: `${rows.length > 0 ? (completed / rows.length) * 100 : 0}%` }} />
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
                  {r.status === 'completed' && r.url && <img src={r.url} alt="" style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} />}
                </div>
              ))}
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Settings">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <ModelSelector value={model} onChange={setModel} type="image" />
            <StudioDropdown label="Ratio" options={['1:1', '16:9', '9:16', '4:3', '3:2']} value={aspectRatio} onChange={setAspectRatio} />
            <StudioDropdown label="Quality" options={['standard', 'high', 'ultra']} value={quality} onChange={setQuality} />
            <StudioDropdown label="Style" options={['none', 'cinematic', 'photographic', 'anime', 'digital-art', '3d-render']} value={stylePreset} onChange={setStylePreset} />
            <StudioDropdown label="Naming" options={NAMING_OPTIONS} value={naming} onChange={setNaming} />
            <StudioDropdown label="Format" options={OUTPUT_FORMATS} value={outputFormat} onChange={setOutputFormat} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {started ? (
              <ControlButton onClick={handleCancel}><X size={14} /> Cancel</ControlButton>
            ) : rows.length > 0 ? (
              <button onClick={handleStart} style={{ padding: '10px 24px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>START BULK</button>
            ) : null}
          </div>
        </DirectorBar>
      }
    />
  );
}
