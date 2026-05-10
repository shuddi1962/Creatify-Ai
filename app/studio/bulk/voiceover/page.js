'use client';

import { useState } from 'react';
import { Volume2, Upload, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

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
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Volume2} title="BULK VOICEOVER" subtitle="CSV of scripts instantly converted to batch audio files" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        {!started ? (
          <>
            <GenerationPanel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button onClick={() => setInputMode('csv')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${inputMode === 'csv' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>CSV Upload</button>
                  <button onClick={() => setInputMode('manual')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${inputMode === 'manual' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>Manual Text</button>
                </div>
                {inputMode === 'csv' ? (
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-8 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                      <Upload size={24} className="text-[#666]" />
                      <p className="text-sm font-medium text-white">Drag & drop CSV file</p>
                      <p className="text-xs text-[#555]">Columns: script, voice_name, language, speed, emotion</p>
                      <input type="file" accept=".csv" onChange={e => e.target.files?.[0] && handleCSV(e.target.files[0])} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <textarea value={manualText} onChange={e => setManualText(e.target.value)} placeholder="Enter scripts, one per line..." className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-40" />
                )}
              </div>
            </GenerationPanel>
            <GenerationPanel>
              <div className="space-y-4">
                <SectionLabel>Default Settings</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#888]">Default Voice</label>
                    <select value={defaultVoice} onChange={e => setDefaultVoice(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white mt-1">
                      {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#888]">Default Language</label>
                    <select value={defaultLang} onChange={e => setDefaultLang(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white mt-1">
                      {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <SectionLabel>Speed</SectionLabel>
                    <PillSelector options={SPEEDS} value={defaultSpeed} onChange={setDefaultSpeed} />
                  </div>
                  <div>
                    <SectionLabel>Output Format</SectionLabel>
                    <PillSelector options={OUTPUT_FORMATS} value={outputFormat} onChange={setOutputFormat} />
                  </div>
                </div>
              </div>
            </GenerationPanel>
            {rows.length > 0 && (
              <GenerationPanel>
                <div className="space-y-3">
                  <SectionLabel>{rows.length} Scripts Loaded</SectionLabel>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {rows.map(r => (
                      <div key={r.id} className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded-lg">
                        <span className="text-xs text-[#555] w-6">#{r.id}</span>
                        <span className="text-xs text-white flex-1 truncate">{r.script}</span>
                        <span className="text-[10px] text-[#555]">{r.voice.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GenerationPanel>
            )}
            <div className="flex justify-end gap-2">
              {inputMode === 'manual' && rows.length === 0 && (
                <button onClick={handleManualStart} className="px-4 py-2.5 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl hover:bg-[#6D28D9] transition-all">Load Scripts</button>
              )}
              {rows.length > 0 && (
                <button onClick={handleStart} className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">Start Bulk Voiceover</button>
              )}
            </div>
          </>
        ) : (
          <>
            <GenerationPanel>
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-white">{completed}/{rows.length} complete</p>
                <div className="w-64 h-2 bg-[#1a1a1a] rounded-full">
                  <div className="h-full bg-[#CCFF00] rounded-full" style={{ width: `${rows.length > 0 ? (completed / rows.length) * 100 : 0}%` }} />
                </div>
                {completed > 0 && <button className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-xl flex items-center gap-1"><Download size={14} />Download All</button>}
              </div>
            </GenerationPanel>
            <GenerationPanel>
              <div className="space-y-2">
                {rows.map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-white/[0.08]">
                    <span className="text-xs font-bold text-[#555] w-6">#{r.id}</span>
                    <span className="text-xs text-white flex-1 truncate">{r.script}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${r.status === 'completed' ? 'bg-green-500/20 text-green-400' : r.status === 'generating' ? 'bg-[#CCFF00]/20 text-[#CCFF00]' : 'bg-[#1a1a1a] text-[#555]'}`}>{r.status}</span>
                    {r.status === 'generating' && <div className="w-16 h-1.5 bg-[#1a1a1a] rounded-full"><div className="h-full bg-[#CCFF00] rounded-full" style={{ width: `${r.progress}%` }} /></div>}
                    {r.status === 'completed' && <button className="p-1 text-[#888] hover:text-white"><Download size={14} /></button>}
                  </div>
                ))}
              </div>
            </GenerationPanel>
          </>
        )}
      </div>
    </div>
  );
}