'use client';

import { useState } from 'react';
import { Mic, Play, Pause, Trash2, Edit, Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const VOICE_TYPE_OPTIONS = ['Single Speaker', 'Multi-speaker'];

export default function VoiceClonePage() {
  const [step, setStep] = useState(1);
  const [voiceFile, setVoiceFile] = useState(null);
  const [voiceName, setVoiceName] = useState('');
  const [voiceType, setVoiceType] = useState('Single Speaker');
  const [cloning, setCloning] = useState(false);
  const [clonedVoice, setClonedVoice] = useState(null);
  const [script, setScript] = useState('');
  const [speed, setSpeed] = useState('1x');
  const [pitch, setPitch] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [savedVoices, setSavedVoices] = useState([
    { id: '1', name: 'My Voice', type: 'Single Speaker', samplePlayed: false },
    { id: '2', name: 'Narrator', type: 'Single Speaker', samplePlayed: false },
  ]);
  const [playingVoice, setPlayingVoice] = useState(null);

  const handleVoiceUpload = (file) => {
    if (file) {
      setVoiceFile(file);
    } else {
      setVoiceFile(null);
    }
  };

  const handleClone = async () => {
    if (!voiceFile) {
      toast.error('Please upload a voice sample');
      return;
    }
    if (!voiceName.trim()) {
      toast.error('Please name your voice clone');
      return;
    }

    setCloning(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setClonedVoice({ id: Date.now().toString(), name: voiceName, type: voiceType });
    toast.success('Voice clone created!');
    setStep(2);
    setCloning(false);
  };

  const handleGenerate = async () => {
    if (!clonedVoice && !selectedVoice) {
      toast.error('Please select or create a voice clone');
      return;
    }
    if (!script.trim()) {
      toast.error('Please enter a script');
      return;
    }

    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setResults([{
      id: `demo-${Date.now()}`,
      url: 'https://www.w3schools.com/html/movie.mp3',
      voice: clonedVoice?.name || selectedVoice,
    }]);
    toast.success('Audio generated with your voice clone!');
    setGenerating(false);
  };

  const handleDeleteVoice = (id) => {
    setSavedVoices(savedVoices.filter(v => v.id !== id));
    toast.success('Voice clone deleted');
  };

  const [selectedVoice, setSelectedVoice] = useState('');

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        title="VOICE CLONING"
        subtitle="Clone any voice from a 10-second sample and reuse it forever"
        badge="NEW"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setStep(1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${step === 1 ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}
          >
            Clone Voice
          </button>
          <button
            onClick={() => setStep(2)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${step === 2 ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}
          >
            Use Clone
          </button>
        </div>

        {step === 1 && (
          <GenerationPanel>
            <div className="space-y-6">
              <div>
                <SectionLabel>Step 1: Upload Voice Sample (10-60 seconds)</SectionLabel>
                <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-8 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                  <div className="w-14 h-14 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                    <Mic size={28} className="text-[#666]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Upload voice sample</p>
                    <p className="text-xs text-[#555] mt-1">Clear audio, no music, 10-60 seconds</p>
                  </div>
                  <input type="file" accept="audio/*" onChange={(e) => handleVoiceUpload(e.target.files?.[0])} className="hidden" />
                </label>
                {voiceFile && (
                  <p className="mt-2 text-xs text-[#7C3AED]">Loaded: {voiceFile.name}</p>
                )}
              </div>

              <div>
                <SectionLabel>Voice Name</SectionLabel>
                <input
                  type="text"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  placeholder="e.g., My Voice, Narrator..."
                  className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-[#444]"
                />
              </div>

              <div>
                <SectionLabel>Voice Type</SectionLabel>
                <StudioDropdown label="VOICE TYPE" value={voiceType} onChange={setVoiceType} options={VOICE_TYPE_OPTIONS} />
              </div>

              <GenerateButton onClick={handleClone} loading={cloning}>
                Create Voice Clone
              </GenerateButton>
            </div>
          </GenerationPanel>
        )}

        {step === 2 && (
          <GenerationPanel>
            <div className="space-y-6">
              <div>
                <SectionLabel>Select Cloned Voice</SectionLabel>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                >
                  <option value="">Select a voice clone...</option>
                  {savedVoices.map(voice => (
                    <option key={voice.id} value={voice.name}>{voice.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <SectionLabel>Script</SectionLabel>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Enter text to speak with your cloned voice..."
                  className="w-full h-32 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <SectionLabel>Speed</SectionLabel>
                  <StudioDropdown label="SPEED" value={speed} onChange={setSpeed} options={['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x']} />
                </div>
                <div>
                  <SectionLabel>Pitch: {pitch > 0 ? '+' : ''}{pitch}</SectionLabel>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={pitch}
                    onChange={(e) => setPitch(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </div>
              </div>

              <GenerateButton onClick={handleGenerate} loading={generating}>
                Generate with Cloned Voice
              </GenerateButton>
            </div>
          </GenerationPanel>
        )}

        {savedVoices.length > 0 && (
          <div className="mt-8">
            <SectionLabel>My Voice Library</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedVoices.map(voice => (
                <div key={voice.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                      <Mic size={16} className="text-[#666]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{voice.name}</p>
                      <p className="text-xs text-[#555]">{voice.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPlayingVoice(playingVoice === voice.id ? null : voice.id)}
                      className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white"
                    >
                      {playingVoice === voice.id ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDeleteVoice(voice.id)} className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8 bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
            <SectionLabel>Results</SectionLabel>
            {results.map((result, i) => (
              <div key={i} className="bg-[#0a0a0a] rounded-xl p-4 flex items-center gap-4 mt-2">
                <button className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white">
                  <Play size={16} />
                </button>
                <div className="flex-1">
                  <p className="text-sm text-white">Generated with {result.voice}</p>
                </div>
                <button className="px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg text-xs font-medium">
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}