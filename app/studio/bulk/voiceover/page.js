'use client';

import { useState } from 'react';
import { Volume2, Upload, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, PromptInput, ControlButton, CornerMarkers } from '@/components/studio/StudioEditorLayout';

const VOICES = ['Emma (US Female)', 'James (US Male)', 'Sophie (UK Female)', 'Liam (UK Male)', 'Yuki (Japanese)', 'Mei (Chinese)', 'Carlos (Spanish)', 'Sofia (French)', 'Hans (German)', 'Aria (Italian)'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Chinese', 'Korean', 'Hindi', 'Arabic'];
const SPEEDS = ['0.75x', '1x', '1.25x', '1.5x'];
const OUTPUT_FORMATS = ['MP3', 'WAV'];

export default function BulkVoiceoverPage() {
  const [inputMode, setInputMode] = useState('csv');
  const [csvFile, setCsvFile] = useState(null);
  const [manualText, setManualText] = useState('');
  const [defaultVoice, setDefaultVoice] = useState('Emma (US Female)');
  const [defaultLang, setDefaultLang] = useState('English');
  const [defaultSpeed, setDefaultSpeed] = useState('1x');
  const [outputFormat, setOutputFormat] = useState('MP3');
  const [rows, setRows] = useState([]);
  const [started, setStarted] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleCSV = (file) => {
    setCsvFile(file);
    const sampleRows = [
      { id: 1, script: 'Welcome to our product demo. Let me show you how it works.', voice: 'Emma (US Female)', language: 'English', speed: '1x', status: 'pending', progress: 0 },
      { id: 2, script: 'This amazing product will transform your daily routine.', voice: 'James (US Male)', language: 'English', speed: '1x', status: 'pending', progress: 0 },
      { id: 3, script: 'Subscribe now for exclusive offers and updates.', voice: 'Emma (US Female)', language: 'English', speed: '1x', status: 'pending', progress: 0 },
    ];
    setRows(sampleRows);
    toast.success('CSV loaded — 3 voiceovers in batch');
  };

  const handleManualStart = () => {
    const scripts = manualText.split('\n').filter(l => l.trim());
    if (scripts.length === 0) { toast.error('Enter at least one script'); return; }
    setRows(scripts.map((s, i) => ({
      id: i + 1,
      script: s.trim(),
      voice: defaultVoice,
      language: defaultLang,
      speed: defaultSpeed,
      status: 'pending',
      progress: 0,
    })));
    toast.success(`${scripts.length} scripts loaded`);
  };

  const handleStart = async () => {
    if (rows.length === 0) { toast.error('No scripts loaded'); return; }
    setStarted(true);
    setGenerating(true);
    toast.success('Bulk voiceover started!');
    for (const row of rows) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'generating', progress: 0 } : r));
      for (let p = 0; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 300));
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, progress: p } : r));
      }
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'completed', progress: 100, url: '#' } : r));
    }
    setGenerating(false);
    toast.success('Bulk voiceover complete!');
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
          >Manual Text</button>
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent',
            background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            BULK VOICEOVER
          </h1>
          {!started && rows.length === 0 && inputMode === 'csv' && (
            <label style={{ zIndex: 1, marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 40, border: '2px dashed var(--border-subtle)', borderRadius: 16, cursor: 'pointer', background: 'var(--bg-card)', maxWidth: 400 }}>
              <Upload size={28} style={{ color: 'var(--text-muted)' }} />
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Drag & drop CSV file</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Columns: script, voice_name, language, speed</p>
              <input type="file" accept=".csv" onChange={e => e.target.files?.[0] && handleCSV(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          )}
          {!started && rows.length === 0 && inputMode === 'manual' && (
            <div style={{ zIndex: 1, marginTop: 24, width: '100%', maxWidth: 500, padding: 16 }}>
              <textarea value={manualText} onChange={e => setManualText(e.target.value)} placeholder="Enter scripts, one per line..." style={{ width: '100%', height: 160, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 16, fontSize: 13, color: 'var(--text-primary)', resize: 'none' }} />
              <button onClick={handleManualStart} style={{ marginTop: 12, padding: '10px 24px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Load Scripts</button>
            </div>
          )}
          {rows.length > 0 && !started && (
            <div style={{ zIndex: 1, marginTop: 24, width: '100%', maxWidth: 500, padding: 16, maxHeight: '50%', overflowY: 'auto' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>{rows.length} Scripts Loaded</span>
              {rows.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-card)', borderRadius: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 24 }}>#{r.id}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.script}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.voice.split(' ')[0]}</span>
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
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.script}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                    background: r.status === 'completed' ? 'rgba(74,222,128,0.2)' : r.status === 'generating' ? 'rgba(204,255,0,0.2)' : 'var(--bg-input)',
                    color: r.status === 'completed' ? '#4ade80' : r.status === 'generating' ? '#CCFF00' : 'var(--text-muted)',
                  }}>{r.status}</span>
                  {r.status === 'generating' && <div style={{ width: 60, height: 6, background: 'var(--bg-input)', borderRadius: 100 }}><div style={{ height: '100%', background: '#CCFF00', borderRadius: 100, width: `${r.progress}%` }} /></div>}
                  {r.status === 'completed' && <button style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Download size={14} /></button>}
                </div>
              ))}
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Settings">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <select value={defaultVoice} onChange={e => setDefaultVoice(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-primary)' }}>
              {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select value={defaultLang} onChange={e => setDefaultLang(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-primary)' }}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <StudioDropdown label="Speed" options={SPEEDS} value={defaultSpeed} onChange={setDefaultSpeed} />
            <StudioDropdown label="Format" options={OUTPUT_FORMATS} value={outputFormat} onChange={setOutputFormat} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {rows.length > 0 && !started && (
              <button onClick={handleStart} style={{ padding: '10px 24px', background: '#CCFF00', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>START BULK</button>
            )}
          </div>
        </DirectorBar>
      }
    />
  );
}
