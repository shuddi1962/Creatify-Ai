'use client';

import { useState } from 'react';
import { Mic, Upload, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

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
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Mic} badge="NEW" title="BULK LIP SYNC" subtitle="One character plus up to 100 audio files equals 100 talking videos" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        {!started ? (
          <>
            <GenerationPanel>
              <div className="space-y-4">
                <SectionLabel>Character Image</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                    <Upload size={24} className="text-[#666]" />
                    <p className="text-sm font-medium text-white">Upload character portrait</p>
                    <p className="text-xs text-[#555]">PNG/JPG, max 10MB</p>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleCharacter(e.target.files[0])} className="hidden" />
                  </label>
                  {character && <img src={URL.createObjectURL(character)} alt="" className="w-full aspect-square rounded-xl object-cover" />}
                </div>
              </div>
            </GenerationPanel>
            <GenerationPanel>
              <div className="space-y-4">
                <SectionLabel>Audio Files</SectionLabel>
                <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                  <Upload size={24} className="text-[#666]" />
                  <p className="text-sm font-medium text-white">Drag & drop audio batch or CSV</p>
                  <p className="text-xs text-[#555]">MP3/WAV files or CSV with audio_url column</p>
                  <input type="file" accept=".csv,.mp3,.wav" multiple onChange={e => {
                    const files = Array.from(e.target.files || []);
                    const csv = files.find(f => f.name.endsWith('.csv'));
                    const audios = files.filter(f => !f.name.endsWith('.csv'));
                    if (csv) handleCSVUplod(csv);
                    if (audios.length > 0) {
                      setRows(audios.map((f, i) => ({ id: i + 1, filename: f.name, status: 'pending', progress: 0 })));
                      toast.success(`${audios.length} audio files loaded`);
                    }
                  }} className="hidden" />
                </label>
                {rows.length > 0 && (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {rows.map(r => (
                      <div key={r.id} className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded-lg">
                        <Mic size={12} className="text-[#555]" />
                        <span className="text-xs text-white flex-1 truncate">{r.filename}</span>
                        <span className="text-[10px] text-[#555]">Ready</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </GenerationPanel>
            <GenerationPanel>
              <div className="space-y-4">
                <SectionLabel>Model</SectionLabel>
                <ModelSelector value={model} onChange={setModel} type="lipsync" />
                <SectionLabel>Output Quality</SectionLabel>
                <StudioDropdown label="Output Quality" options={QUALITY_OPTIONS} value={quality} onChange={setQuality} />
              </div>
            </GenerationPanel>
            {rows.length > 0 && (
              <div className="flex justify-end">
                <button onClick={handleStart} className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">
                  Start Bulk Lip Sync
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <GenerationPanel>
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-white">{completed}/{rows.length} complete</p>
                <div className="w-64 h-2 bg-[#1a1a1a] rounded-full">
                  <div className="h-full bg-[#CCFF00] rounded-full" style={{ width: `${rows.length > 0 ? (completed / rows.length) * 100 : 0}%` }} />
                </div>
                {completed > 0 && <button className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-xl"><Download size={14} />Download All</button>}
              </div>
            </GenerationPanel>
            <GenerationPanel>
              <div className="space-y-2">
                {rows.map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-white/[0.08]">
                    <span className="text-xs font-bold text-[#555] w-6">#{r.id}</span>
                    <span className="text-xs text-white flex-1 truncate">{r.filename}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${r.status === 'completed' ? 'bg-green-500/20 text-green-400' : r.status === 'generating' ? 'bg-[#CCFF00]/20 text-[#CCFF00]' : 'bg-[#1a1a1a] text-[#555]'}`}>{r.status}</span>
                    {r.status === 'generating' && <div className="w-16 h-1.5 bg-[#1a1a1a] rounded-full"><div className="h-full bg-[#CCFF00] rounded-full" style={{ width: `${r.progress}%` }} /></div>}
                    {r.status === 'completed' && r.url && (
                      <>
                        <img src={r.url} alt="" className="w-10 h-10 rounded object-cover" />
                        <button className="p-1 text-[#888] hover:text-white"><Download size={14} /></button>
                      </>
                    )}
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