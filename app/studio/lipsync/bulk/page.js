'use client';

import { useState } from 'react';
import { Image, FileAudio, Users } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';
import ProgressTable from '@/components/studio/ProgressTable';

const NAMING_OPTIONS = ['Sequential', 'Use audio filename', 'Custom prefix'];
const OUTPUT_QUALITY = ['720p', '1080p'];
const OUTPUT_FORMAT = ['MP4', 'MOV', 'WEBM'];

export default function BulkLipSyncPage() {
  const [characterFile, setCharacterFile] = useState(null);
  const [characterPreview, setCharacterPreview] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [namingConvention, setNamingConvention] = useState('Sequential');
  const [customPrefix, setCustomPrefix] = useState('');
  const [outputQuality, setOutputQuality] = useState('1080p');
  const [outputFormat, setOutputFormat] = useState('MP4');
  const [model, setModel] = useState('infinite-talk');
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleCharacterUpload = (file) => {
    if (file) {
      setCharacterFile(file);
      setCharacterPreview(URL.createObjectURL(file));
    } else {
      setCharacterFile(null);
      setCharacterPreview(null);
    }
  };

  const handleAudioUpload = (files) => {
    setAudioFiles(Array.from(files));
  };

  const handleStart = async () => {
    if (!characterFile) {
      toast.error('Please upload a portrait image');
      return;
    }
    if (audioFiles.length === 0) {
      toast.error('Please upload audio files');
      return;
    }

    setLoading(true);
    setStarted(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResults = audioFiles.map((file, i) => ({
      id: `job-${i}`,
      filename: file.name,
      status: i === 0 ? 'processing' : 'queued',
      progress: i === 0 ? 45 : 0,
    }));
    
    setResults(mockResults);
    
    setTimeout(() => {
      setResults(prev => prev.map((r, i) => i === 0 ? { ...r, status: 'completed', progress: 100 } : r));
    }, 2000);
    
    setLoading(false);
    toast.success(`Started processing ${audioFiles.length} files!`);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        title="BULK LIP SYNC"
        subtitle="One character × 100 audio files = 100 talking videos automatically"
        badge="NEW"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Character (used for all videos)</SectionLabel>
                {characterPreview ? (
                  <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a] w-40">
                    <img src={characterPreview} alt="Character" className="w-full h-40 object-cover rounded-lg" />
                    <button
                      onClick={() => handleCharacterUpload(null)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                      <Image size={20} className="text-[#666]" />
                    </div>
                    <p className="text-xs font-medium text-white">Upload portrait</p>
                    <input type="file" accept="image/*" onChange={(e) => handleCharacterUpload(e.target.files?.[0])} className="hidden" />
                  </label>
                )}
              </div>
              <div>
                <SectionLabel>Audio Files (MP3/WAV)</SectionLabel>
                <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                  <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                    <FileAudio size={20} className="text-[#666]" />
                  </div>
                  <p className="text-xs font-medium text-white">
                    {audioFiles.length > 0 ? `${audioFiles.length} files selected` : 'Upload audio files'}
                  </p>
                  <p className="text-[10px] text-[#555]">Up to 100 files</p>
                  <input type="file" accept="audio/*" multiple onChange={(e) => handleAudioUpload(e.target.files)} className="hidden" />
                </label>
                {audioFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {audioFiles.slice(0, 5).map((f, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#1a1a1a] rounded text-[10px] text-[#888]">{f.name}</span>
                    ))}
                    {audioFiles.length > 5 && (
                      <span className="px-2 py-0.5 bg-[#1a1a1a] rounded text-[10px] text-[#888]">+{audioFiles.length - 5} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SectionLabel>Naming Convention</SectionLabel>
                <PillSelector options={NAMING_OPTIONS} value={namingConvention} onChange={setNamingConvention} />
              </div>
              <div>
                <SectionLabel>Output Quality</SectionLabel>
                <PillSelector options={OUTPUT_QUALITY} value={outputQuality} onChange={setOutputQuality} />
              </div>
              <div>
                <SectionLabel>Output Format</SectionLabel>
                <PillSelector options={OUTPUT_FORMAT} value={outputFormat} onChange={setOutputFormat} />
              </div>
            </div>

            {namingConvention === 'Custom prefix' && (
              <div>
                <SectionLabel>Custom Prefix</SectionLabel>
                <input
                  type="text"
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value)}
                  placeholder="e.g., video_"
                  className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-[#444]"
                />
              </div>
            )}

            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector type="lipsync" value={model} onChange={setModel} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleStart} loading={loading} disabled={started}>
            {started ? 'Processing...' : `Start Bulk Lip Sync (${audioFiles.length})`}
          </GenerateButton>
        </div>

        {started && results.length > 0 && (
          <div className="mt-8">
            <SectionLabel>Progress</SectionLabel>
            <ProgressTable items={results} />
          </div>
        )}

        <ResultsGrid results={results.filter(r => r.status === 'completed').map(r => ({ ...r, url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video' }))} columns={1} />
      </div>
    </div>
  );
}