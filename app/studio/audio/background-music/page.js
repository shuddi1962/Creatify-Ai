'use client';

import { useState } from 'react';
import { Music, Video, Sliders } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const ENERGY_OPTIONS = ['Constant', 'Build Up', 'Drop', 'Rise and Fall'];
const GENRES = ['Pop', 'Electronic', 'Cinematic', 'Acoustic', 'Rock', 'Jazz', 'Ambient'];
const MOODS = ['Energetic', 'Calm', 'Happy', 'Sad', 'Tense'];

export default function BackgroundMusicPage() {
  const [mode, setMode] = useState('standalone');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [autoScore, setAutoScore] = useState(true);
  const [genre, setGenre] = useState('Cinematic');
  const [mood, setMood] = useState('Calm');
  const [selectedInstruments, setSelectedInstruments] = useState(['Piano', 'Strings']);
  const [energy, setEnergy] = useState('Constant');
  const [volume, setVolume] = useState(70);
  const [fadeIn, setFadeIn] = useState(true);
  const [fadeOut, setFadeOut] = useState(true);
  const [loop, setLoop] = useState(false);
  const [duration, setDuration] = useState('Match video');
  const [customDuration, setCustomDuration] = useState(60);
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

  const toggleInstrument = (inst) => {
    if (selectedInstruments.includes(inst)) {
      setSelectedInstruments(selectedInstruments.filter(i => i !== inst));
    } else {
      setSelectedInstruments([...selectedInstruments, inst]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating background music!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/movie.mp3',
          prompt: `${genre} - ${mood}`,
          type: 'audio'
        }]);
        toast.success('Demo: Background music generated!');
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
        title="BACKGROUND MUSIC"
        subtitle="Auto-score background music perfectly matched to your video"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('video')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'video' ? 'bg-[#6366f1] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}
              >
                <Video size={14} className="inline mr-1" />
                With Video
              </button>
              <button
                onClick={() => setMode('standalone')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'standalone' ? 'bg-[#6366f1] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}
              >
                <Music size={14} className="inline mr-1" />
                Standalone
              </button>
            </div>

            {mode === 'video' && (
              <div>
                <SectionLabel>Upload Video</SectionLabel>
                {videoPreview ? (
                  <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                    <video src={videoPreview} controls className="w-full h-40 object-contain rounded-lg" />
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
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoScore(!autoScore)}
                className={`w-12 h-6 rounded-full transition-all ${autoScore ? 'bg-[#6366f1]' : 'bg-[#1a1a1a]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoScore ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-[#888]">Auto-score (AI analyzes video content)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Genre</SectionLabel>
                <StudioDropdown options={GENRES} value={genre} onChange={setGenre} />
              </div>
              <div>
                <SectionLabel>Mood</SectionLabel>
                <StudioDropdown options={MOODS} value={mood} onChange={setMood} />
              </div>
            </div>

            <div>
              <SectionLabel>Instruments</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {['Piano', 'Guitar', 'Drums', 'Strings', 'Bass', 'Synth'].map(inst => (
                  <button
                    key={inst}
                    onClick={() => toggleInstrument(inst)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedInstruments.includes(inst)
                        ? 'bg-[#6366f1] text-white border border-[#6366f1]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Energy Curve</SectionLabel>
                <StudioDropdown options={ENERGY_OPTIONS} value={energy} onChange={setEnergy} />
              </div>
              <div>
                <SectionLabel>Music Volume: {volume}%</SectionLabel>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFadeIn(!fadeIn)}
                  className={`w-12 h-6 rounded-full transition-all ${fadeIn ? 'bg-[#6366f1]' : 'bg-[#1a1a1a]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${fadeIn ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-[#888]">Fade in</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFadeOut(!fadeOut)}
                  className={`w-12 h-6 rounded-full transition-all ${fadeOut ? 'bg-[#6366f1]' : 'bg-[#1a1a1a]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${fadeOut ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-[#888]">Fade out</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLoop(!loop)}
                  className={`w-12 h-6 rounded-full transition-all ${loop ? 'bg-[#6366f1]' : 'bg-[#1a1a1a]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${loop ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-[#888]">Loop</span>
              </div>
            </div>

            <div>
              <SectionLabel>Duration</SectionLabel>
              <div className="flex gap-2 items-center">
                {mode === 'video' ? (
                  <button
                    onClick={() => setDuration('Match video')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${duration === 'Match video' ? 'bg-[#6366f1] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}
                  >
                    Match video
                  </button>
                ) : null}
                <button
                  onClick={() => setDuration('Custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${duration === 'Custom' ? 'bg-[#6366f1] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}
                >
                  Custom
                </button>
                {duration === 'Custom' && (
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(parseInt(e.target.value))}
                    className="w-20 bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm"
                    placeholder="seconds"
                  />
                )}
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate Background Music
          </GenerateButton>
        </div>

        {results.length > 0 && (
          <div className="mt-8">
            <ResultsGrid results={results} columns={1} />
          </div>
        )}
      </div>
    </div>
  );
}