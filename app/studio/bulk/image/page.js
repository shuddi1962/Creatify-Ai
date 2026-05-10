'use client';

import { useState } from 'react';
import { Image, Upload, Download, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import AspectRatioPicker from '@/components/studio/AspectRatioPicker';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

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
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Image} title="BULK IMAGE" subtitle="Upload a CSV and generate up to 500 images in one batch" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        {!started ? (
          <>
            <GenerationPanel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button onClick={() => setInputMode('csv')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${inputMode === 'csv' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>CSV Upload</button>
                  <button onClick={() => setInputMode('manual')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${inputMode === 'manual' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>Manual List</button>
                </div>
                {inputMode === 'csv' ? (
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-8 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                      <Upload size={24} className="text-[#666]" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-white">Drag & drop CSV file</p>
                        <p className="text-xs text-[#555] mt-1">prompt column required</p>
                      </div>
                      <input type="file" accept=".csv" onChange={e => e.target.files?.[0] && handleCSVUplod(e.target.files[0])} className="hidden" />
                    </label>
                    <a href="#" onClick={e => { e.preventDefault(); toast.success('Template downloaded'); }} className="flex items-center gap-2 text-xs text-[#7C3AED] hover:underline">
                      <Download size={12} /> Download template CSV
                    </a>
                  </div>
                ) : (
                  <textarea value={manualList} onChange={e => setManualList(e.target.value)} placeholder="Enter one prompt per line&#10;Mountain landscape at sunset&#10;Portrait with dramatic lighting&#10;Futuristic city with neon lights" className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-40" />
                )}
              </div>
            </GenerationPanel>
            <GenerationPanel>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <SectionLabel>Model</SectionLabel>
                    <ModelSelector value={model} onChange={setModel} type="image" />
                  </div>
                  <div>
                    <SectionLabel>Default Aspect Ratio</SectionLabel>
                    <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <SectionLabel>Quality</SectionLabel>
                    <PillSelector options={['standard', 'high', 'ultra']} value={quality} onChange={setQuality} />
                  </div>
                  <div>
                    <SectionLabel>Style Preset</SectionLabel>
                    <PillSelector options={['none', 'cinematic', 'photographic', 'anime', 'digital-art', '3d-render']} value={stylePreset} onChange={setStylePreset} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <SectionLabel>Naming</SectionLabel>
                    <PillSelector options={NAMING_OPTIONS} value={naming} onChange={setNaming} />
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
                  <div className="flex justify-between items-center">
                    <SectionLabel>{rows.length} Prompts Loaded</SectionLabel>
                    <span className="text-xs text-[#CCFF00] font-semibold">{estimatedCredits} credits estimated</span>
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {rows.map(r => (
                      <div key={r.id} className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded-lg">
                        <span className="text-xs text-[#555] w-6">#{r.id}</span>
                        <span className="text-xs text-white flex-1 truncate">{r.prompt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GenerationPanel>
            )}
            <div className="flex justify-end gap-2">
              {inputMode === 'manual' && rows.length === 0 && (
                <button onClick={handleManualStart} className="px-4 py-2.5 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl hover:bg-[#6D28D9] transition-all">Load Prompts</button>
              )}
              {rows.length > 0 && (
                <button onClick={handleStart} disabled={generating} className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 transition-all">
                  {generating ? 'Starting...' : 'Start Bulk Generation'}
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <GenerationPanel>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-white">{completed} of {rows.length} complete</p>
                    <div className="w-64 h-2 bg-[#1a1a1a] rounded-full mt-2">
                      <div className="h-full bg-[#CCFF00] rounded-full transition-all" style={{ width: `${rows.length > 0 ? (completed / rows.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCancel} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-xs font-medium rounded-xl border border-white/[0.08] hover:bg-[#222] transition-all flex items-center gap-1"><X size={14} /> Cancel Batch</button>
                    {completed > 0 && (
                      <button className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-xl hover:bg-[#B8FF00] transition-all flex items-center gap-1"><Download size={14} /> Download All as ZIP</button>
                    )}
                  </div>
                </div>
              </div>
            </GenerationPanel>
            <GenerationPanel>
              <div className="space-y-2">
                {rows.map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-white/[0.08]">
                    <span className="text-xs font-bold text-[#555] w-6">#{r.id}</span>
                    <span className="text-xs text-white flex-1 truncate">{r.prompt}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                      r.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      r.status === 'generating' ? 'bg-[#CCFF00]/20 text-[#CCFF00]' :
                      r.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-[#1a1a1a] text-[#555]'
                    }`}>{r.status}</span>
                    {r.status === 'generating' && (
                      <div className="w-16 h-1.5 bg-[#1a1a1a] rounded-full">
                        <div className="h-full bg-[#CCFF00] rounded-full" style={{ width: `${r.progress}%` }} />
                      </div>
                    )}
                    {r.status === 'completed' && r.url && (
                      <>
                        <img src={r.url} alt="" className="w-8 h-8 rounded object-cover" />
                        <button className="p-1 rounded hover:bg-white/[0.08] text-[#888] hover:text-white transition-all"><Download size={14} /></button>
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