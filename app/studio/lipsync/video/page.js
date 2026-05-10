'use client';

import { useState } from 'react';
import { Video, Mic, FileText } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const SYNC_MODES = ['Replace Audio + Sync Lips', 'Add New Voice', 'Translate & Sync'];
const FACE_REGIONS = ['Auto-detect', 'Manual selection'];

export default function VideoLipSyncPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [ttsText, setTtsText] = useState('');
  const [inputMode, setInputMode] = useState('audio');
  const [syncMode, setSyncMode] = useState('Replace Audio + Sync Lips');
  const [language, setLanguage] = useState('English');
  const [faceRegion, setFaceRegion] = useState('Auto-detect');
  const [model, setModel] = useState('infinite-talk');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      setVideoFile(null);
      setVideoPreview(null);
    }
  };

  const handleAudioUpload = (file) => {
    if (file) {
      setAudioFile(file);
    } else {
      setAudioFile(null);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video');
      return;
    }

    if (inputMode === 'audio' && !audioFile && !ttsText) {
      toast.error('Please upload audio or enter text');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Syncing lips!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: syncMode,
          type: 'video'
        }]);
        toast.success('Demo: Lips synced!');
      }
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        title="VIDEO LIP SYNC"
        subtitle="Sync lips perfectly on any existing video with new audio"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Video with Face</SectionLabel>
                {videoPreview ? (
                  <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                    <video src={videoPreview} controls className="w-full h-40 object-cover rounded-lg" />
                    <button
                      onClick={() => handleVideoUpload(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                      <Video size={20} className="text-[#666]" />
                    </div>
                    <p className="text-xs font-medium text-white">Upload video</p>
                    <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} className="hidden" />
                  </label>
                )}
              </div>
              <div>
                <SectionLabel>Audio Source</SectionLabel>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setInputMode('audio')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      inputMode === 'audio' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'
                    }`}
                  >
                    Audio File
                  </button>
                  <button
                    onClick={() => setInputMode('tts')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      inputMode === 'tts' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'
                    }`}
                  >
                    TTS Text
                  </button>
                </div>
                {inputMode === 'audio' ? (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-4 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                    <div className="w-8 h-8 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                      <Mic size={16} className="text-[#666]" />
                    </div>
                    <p className="text-xs font-medium text-white">Upload audio</p>
                    <input type="file" accept="audio/*" onChange={(e) => handleAudioUpload(e.target.files?.[0])} className="hidden" />
                  </label>
                ) : (
                  <textarea
                    value={ttsText}
                    onChange={(e) => setTtsText(e.target.value)}
                    placeholder="Enter text to convert to speech..."
                    className="w-full h-24 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-3 text-white placeholder-[#444] resize-none text-sm"
                  />
                )}
              </div>
            </div>

            <div>
              <SectionLabel>Sync Mode</SectionLabel>
              <PillSelector options={SYNC_MODES} value={syncMode} onChange={setSyncMode} />
            </div>

            {syncMode === 'Translate & Sync' && (
              <div>
                <SectionLabel>Language</SectionLabel>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                  <option>Japanese</option>
                  <option>Korean</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Face Region</SectionLabel>
                <PillSelector options={FACE_REGIONS} value={faceRegion} onChange={setFaceRegion} />
              </div>
              <div>
                <SectionLabel>Model</SectionLabel>
                <ModelSelector type="lipsync" value={model} onChange={setModel} />
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Sync Lips
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}