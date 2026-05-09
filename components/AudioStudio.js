'use client';

import { useState } from 'react';

const AUDIO_TABS = [
  { id: 'voiceover', label: 'Text to Voiceover', desc: '100+ voices, multilingual, ElevenLabs powered' },
  { id: 'voice-clone', label: 'Voice Cloning', desc: 'Upload 10s sample and clone any voice' },
  { id: 'music', label: 'Text to Music', desc: 'Generate music by genre, mood, and BPM' },
  { id: 'sfx', label: 'Sound Effects', desc: 'AI-generated sound effects library' },
  { id: 'subtitles', label: 'Audio to Subtitles', desc: 'Auto-generate subtitles from audio' },
  { id: 'asmr', label: 'ASMR Generator', desc: 'Generate ASMR audio content' },
  { id: 'background-music', label: 'Background Music', desc: 'Royalty-free background music generation' },
];

const VOICES = [
  { id: 'en-US-1', name: 'Rachel', lang: 'English (US)', gender: 'Female' },
  { id: 'en-US-2', name: 'Tony', lang: 'English (US)', gender: 'Male' },
  { id: 'en-GB-1', name: 'Emma', lang: 'English (UK)', gender: 'Female' },
  { id: 'en-GB-2', name: 'James', lang: 'English (UK)', gender: 'Male' },
  { id: 'es-1', name: 'Sofia', lang: 'Spanish', gender: 'Female' },
  { id: 'fr-1', name: 'Pierre', lang: 'French', gender: 'Male' },
  { id: 'de-1', name: 'Lena', lang: 'German', gender: 'Female' },
  { id: 'ja-1', name: 'Yuki', lang: 'Japanese', gender: 'Female' },
  { id: 'ko-1', name: 'Minji', lang: 'Korean', gender: 'Female' },
  { id: 'zh-1', name: 'Wei', lang: 'Chinese', gender: 'Male' },
];

const GENRES = ['Pop', 'Rock', 'Electronic', 'Hip Hop', 'Jazz', 'Classical', 'Ambient', 'Lo-fi', 'R&B', 'Country', 'Folk', 'Metal'];
const MOODS = ['Happy', 'Sad', 'Energetic', 'Calm', 'Dark', 'Romantic', 'Epic', 'Mysterious', 'Funny', 'Inspirational'];

export default function AudioStudio() {
  const [activeTab, setActiveTab] = useState('voiceover');
  const [prompt, setPrompt] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt) return;
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  const renderTextToVoiceover = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Select Voice</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {VOICES.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVoice(v.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedVoice === v.id
                  ? 'bg-[#7C3AED]/20 border-[#7C3AED]/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="text-sm font-medium text-[#F9FAFB]">{v.name}</div>
              <div className="text-[10px] text-[#9CA3AF]">{v.lang} • {v.gender}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Script</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter the text you want to convert to speech..."
          rows={4}
          maxLength={5000}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] resize-none"
        />
        <div className="text-xs text-[#9CA3AF] mt-1 text-right">{prompt.length}/5000</div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={!prompt || generating}
          className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {generating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
          {generating ? 'Generating...' : 'Generate Voiceover'}
        </button>
        {generating && (
          <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
            <div className="w-32 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-[#7C3AED] animate-pulse" style={{ width: '60%' }} />
            </div>
            Processing...
          </div>
        )}
      </div>

      {generating && (
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-[#7C3AED] animate-pulse" style={{ width: '45%' }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#9CA3AF]">Generating audio...</span>
                <span className="text-[10px] text-[#9CA3AF]">45%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVoiceClone = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </div>
        <p className="text-sm font-medium text-[#F9FAFB]">Upload a 10-second voice sample</p>
        <p className="text-xs text-[#9CA3AF] mt-1">WAV or MP3, at least 10 seconds of clear speech</p>
        <button className="mt-4 px-6 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all">Upload Audio</button>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Voice Name</label>
        <input
          type="text"
          placeholder="Name your cloned voice..."
          className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED]"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Test Script</label>
        <textarea
          rows={3}
          placeholder="Enter text to test your cloned voice..."
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] resize-none"
        />
      </div>

      <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-all">
        Clone Voice
      </button>
    </div>
  );

  const renderTextToMusic = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Description</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the music you want to create..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Genre</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.slice(0, 6).map((g) => (
              <button key={g} className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-[#9CA3AF] hover:bg-white/5 transition-all">{g}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Mood</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.slice(0, 5).map((m) => (
              <button key={m} className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-[#9CA3AF] hover:bg-white/5 transition-all">{m}</button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Duration</label>
        <div className="flex gap-2">
          {['15s', '30s', '60s', '120s'].map((d) => (
            <button key={d} className="px-4 py-2 rounded-lg text-xs border border-white/10 text-[#9CA3AF] hover:bg-white/5 transition-all">{d}</button>
          ))}
        </div>
      </div>

      <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Generate Music</button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'voiceover': return renderTextToVoiceover();
      case 'voice-clone': return renderVoiceClone();
      case 'music': return renderTextToMusic();
      default:
        return (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
              <p className="text-sm text-[#9CA3AF]">Coming soon</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-[#0A0F1E] overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Audio Studio</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Generate voiceovers, music, sound effects, and more with AI
          </p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {AUDIO_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPrompt(''); }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB] border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
