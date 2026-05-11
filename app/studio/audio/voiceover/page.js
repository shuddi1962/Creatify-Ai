'use client';

import { useState } from 'react';
import { Mic, Play, Pause, Download } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic', 'Russian', 'Dutch', 'Polish', 'Turkish', 'Vietnamese', 'Thai', 'Indonesian', 'Czech', 'Romanian', 'Hungarian', 'Greek', 'Swedish', 'Norwegian', 'Finnish', 'Danish', 'Ukrainian', 'Hebrew', 'Bengali', 'Tamil', 'Telugu', 'Malay', 'Filipino'];
const VOICES = [
  { id: 'adam', name: 'Adam', language: 'English', gender: 'Male' },
  { id: 'sarah', name: 'Sarah', language: 'English', gender: 'Female' },
  { id: 'mike', name: 'Mike', language: 'English', gender: 'Male' },
  { id: 'emily', name: 'Emily', language: 'English', gender: 'Female' },
  { id: 'carlos', name: 'Carlos', language: 'Spanish', gender: 'Male' },
  { id: 'camille', name: 'Camille', language: 'French', gender: 'Female' },
  { id: 'hans', name: 'Hans', language: 'German', gender: 'Male' },
  { id: 'yuki', name: 'Yuki', language: 'Japanese', gender: 'Female' },
  { id: 'min-jun', name: 'Min-Jun', language: 'Korean', gender: 'Male' },
  { id: 'wei', name: 'Wei', language: 'Chinese', gender: 'Female' },
];
const SPEED_OPTIONS = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'];
const EMPHASIS_OPTIONS = ['Neutral', 'Dramatic', 'Conversational', 'Newscast', 'Whisper', 'Energetic', 'Calm', 'Formal'];
const MODEL_OPTIONS = ['ElevenLabs', 'OpenAI TTS', 'Muapi Voice'];
const OUTPUT_FORMAT = ['MP3', 'WAV', 'FLAC'];

export default function VoiceoverPage() {
  const [script, setScript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('sarah');
  const [language, setLanguage] = useState('English');
  const [speed, setSpeed] = useState('1x');
  const [pitch, setPitch] = useState(0);
  const [emphasis, setEmphasis] = useState('Neutral');
  const [model, setModel] = useState('ElevenLabs');
  const [outputFormat, setOutputFormat] = useState('MP3');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(null);

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating voiceover!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/movie.mp3',
          model: model,
          format: outputFormat,
          duration: '0:45',
        }]);
        toast.success('Demo: Voiceover generated!');
      }
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const currentVoice = VOICES.find(v => v.id === selectedVoice);
  const charCount = script.length;

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        icon={Mic}
        title="TEXT TO VOICEOVER"
        subtitle="Generate natural voiceovers from text in 100+ voices and languages"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <SectionLabel>Script</SectionLabel>
                <span className="text-xs text-[#555]">{charCount} characters</span>
              </div>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Type or paste your script here..."
                className="w-full h-40 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Voice</SectionLabel>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                >
                  {VOICES.map(voice => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name} ({voice.language}, {voice.gender})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setPreviewPlaying(previewPlaying === selectedVoice ? null : selectedVoice)}
                  className="mt-2 flex items-center gap-2 text-xs text-[#7C3AED] hover:text-[#9F5AFD]"
                >
                  {previewPlaying === selectedVoice ? <Pause size={12} /> : <Play size={12} />}
                  Preview voice
                </button>
              </div>
              <div>
                <SectionLabel>Language</SectionLabel>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SectionLabel>Speech Speed</SectionLabel>
                <StudioDropdown label="SPEECH SPEED" value={speed} onChange={setSpeed} options={SPEED_OPTIONS} />
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
              <div>
                <SectionLabel>Emphasis</SectionLabel>
                <StudioDropdown label="EMPHASIS" value={emphasis} onChange={setEmphasis} options={EMPHASIS_OPTIONS} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SectionLabel>Model</SectionLabel>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                >
                  {MODEL_OPTIONS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <SectionLabel>Output Format</SectionLabel>
                <StudioDropdown label="OUTPUT FORMAT" value={outputFormat} onChange={setOutputFormat} options={OUTPUT_FORMAT} />
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate Voiceover
          </GenerateButton>
        </div>

        {results.length > 0 && (
          <div className="mt-8 bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
            <SectionLabel>Results</SectionLabel>
            {results.map((result, i) => (
              <div key={i} className="bg-[#0a0a0a] rounded-xl p-4 flex items-center gap-4 mt-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white hover:bg-[#9F5AFD] transition-all"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <div className="flex-1">
                  <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#7C3AED] rounded-full w-1/2" />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-[#555]">{result.duration}</span>
                    <span className="text-xs text-[#555]">{result.format}</span>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-white/[0.08] text-[#888] hover:text-white">
                  <Download size={16} />
                </button>
                <button className="px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg text-xs font-medium">
                  Use in Video
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}