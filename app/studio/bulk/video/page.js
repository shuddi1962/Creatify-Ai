'use client';

import { useState } from 'react';
import { Video, Upload, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import AspectRatioPicker from '@/components/studio/AspectRatioPicker';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

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
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Video} title="BULK VIDEO" subtitle="Upload a CSV and generate up to 500 videos in one batch" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        {!started ? (
          <>
            <GenerationPanel>
              <div className="space-y-4">
                <SectionLabel>CSV Upload</SectionLabel>
                <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-8 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                  <Upload size={24} className="text-[#666]" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Drag & drop CSV file</p>
                    <p className="text-xs text-[#555] mt-1">Columns: prompt, model, duration, aspect_ratio</p>
                  </div>
                  <input type="file" accept=".csv" onChange={e => e.target.files?.[0] && handleCSV(e.target.files[0])} className="hidden" />
                </label>
                <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] p-4 text-xs text-[#888]">
                  <p className="font-semibold text-white mb-2">Required CSV columns:</p>
                  <p>prompt — Video description</p>
                  <p>model — Model ID (optional)</p>
                  <p>duration — Seconds (optional)</p>
                  <p>aspect_ratio — e.g. 16:9, 1:1, 9:16 (optional)</p>
                </div>
              </div>
            </GenerationPanel>
            <GenerationPanel>
              <div className="space-y-4">
                <SectionLabel>Default Settings</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <SectionLabel>Model</SectionLabel>
                    <ModelSelector value={model} onChange={setModel} type="video" />
                  </div>
                  <div>
                    <SectionLabel>Aspect Ratio</SectionLabel>
                    <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <SectionLabel>Duration</SectionLabel>
                    <PillSelector options={['5', '10']} value={duration} onChange={setDuration} />
                  </div>
                  <div>
                    <SectionLabel>Naming</SectionLabel>
                    <PillSelector options={['Sequential', 'Row Number', 'Custom Prefix']} value={naming} onChange={setNaming} />
                  </div>
                </div>
              </div>
            </GenerationPanel>
            {rows.length > 0 && (
              <GenerationPanel>
                <div className="space-y-3">
                  <SectionLabel>{rows.length} Videos in Batch</SectionLabel>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {rows.map(r => (
                      <div key={r.id} className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded-lg">
                        <span className="text-xs text-[#555] w-6">#{r.id}</span>
                        <span className="text-xs text-white flex-1 truncate">{r.prompt}</span>
                        <span className="text-[10px] text-[#555]">{r.model}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GenerationPanel>
            )}
            {rows.length > 0 && (
              <div className="flex justify-end">
                <button onClick={handleStart} className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all">
                  Start Bulk Generation
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
                <div className="flex gap-2">
                  {completed > 0 && <button className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-bold rounded-xl flex items-center gap-1"><Download size={14} />Download All</button>}
                </div>
              </div>
            </GenerationPanel>
            <GenerationPanel>
              <div className="space-y-2">
                {rows.map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl border border-white/[0.08]">
                    <span className="text-xs font-bold text-[#555] w-6">#{r.id}</span>
                    <span className="text-xs text-white flex-1 truncate">{r.prompt}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${r.status === 'completed' ? 'bg-green-500/20 text-green-400' : r.status === 'generating' ? 'bg-[#CCFF00]/20 text-[#CCFF00]' : 'bg-[#1a1a1a] text-[#555]'}`}>{r.status}</span>
                    {r.status === 'generating' && <div className="w-16 h-1.5 bg-[#1a1a1a] rounded-full"><div className="h-full bg-[#CCFF00] rounded-full" style={{ width: `${r.progress}%` }} /></div>}
                    {r.status === 'completed' && r.url && (
                      <>
                        <img src={r.url} alt="" className="w-12 h-8 rounded object-cover" />
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