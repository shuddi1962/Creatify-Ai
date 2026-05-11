'use client';

import { useState } from 'react';
import { Music, Play, Pause } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const GENRES = ['Hip-Hop', 'Pop', 'Electronic', 'Jazz', 'Classical', 'R&B', 'Rock', 'Lo-Fi', 'Cinematic', 'Reggaeton', 'Afrobeats', 'Country'];
const MOODS = ['Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Intense', 'Mysterious', 'Playful'];
const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const INSTRUMENTS = ['Piano', 'Guitar', 'Drums', 'Bass', 'Synth', 'Strings', 'Brass', 'Vocals'];
const DURATION_OPTIONS = ['15s', '30s', '1min', '2min', '5min'];
const VOCALS_OPTIONS = ['Instrumental', 'With Vocals'];
const MODEL_OPTIONS = ['Suno', 'Udio'];

export default function MusicPage() {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Hip-Hop');
  const [mood, setMood] = useState('Energetic');
  const [bpm, setBpm] = useState(120);
  const [key, setKey] = useState('C');
  const [selectedInstruments, setSelectedInstruments] = useState(['Drums', 'Bass']);
  const [duration, setDuration] = useState('1min');
  const [vocals, setVocals] = useState('Instrumental');
  const [lyrics, setLyrics] = useState('');
  const [model, setModel] = useState('Suno');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const toggleInstrument = (inst) => {
    if (selectedInstruments.includes(inst)) {
      setSelectedInstruments(selectedInstruments.filter(i => i !== inst));
    } else {
      setSelectedInstruments([...selectedInstruments, inst]);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt describing the music');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating music!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 4000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/movie.mp3',
          prompt: prompt,
          type: 'audio'
        }]);
        toast.success('Demo: Music generated!');
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
        title="TEXT TO MUSIC"
        subtitle="Generate full music tracks by genre, mood, and BPM with AI"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Prompt</SectionLabel>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the music you want..."
                className="w-full h-24 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none"
              />
            </div>

            <div>
              <SectionLabel>Genre</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      genre === g
                        ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Mood</SectionLabel>
                <StudioDropdown label="MOOD" value={mood} onChange={setMood} options={MOODS} />
              </div>
              <div>
                <SectionLabel>BPM: {bpm}</SectionLabel>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Key</SectionLabel>
                <select
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                >
                  {KEYS.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <SectionLabel>Duration</SectionLabel>
                <StudioDropdown label="DURATION" value={duration} onChange={setDuration} options={DURATION_OPTIONS} />
              </div>
            </div>

            <div>
              <SectionLabel>Instruments</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {INSTRUMENTS.map(inst => (
                  <button
                    key={inst}
                    onClick={() => toggleInstrument(inst)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedInstruments.includes(inst)
                        ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Vocals</SectionLabel>
              <StudioDropdown label="VOCALS" value={vocals} onChange={setVocals} options={VOCALS_OPTIONS} />
            </div>

            {vocals === 'With Vocals' && (
              <div>
                <SectionLabel>Lyrics</SectionLabel>
                <textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Write your lyrics here..."
                  className="w-full h-24 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none"
                />
              </div>
            )}

            <div>
              <SectionLabel>Model</SectionLabel>
              <StudioDropdown label="MODEL" value={model} onChange={setModel} options={MODEL_OPTIONS} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate Music
          </GenerateButton>
        </div>

        {results.length > 0 && (
          <div className="mt-8">
            <SectionLabel>Results</SectionLabel>
            <ResultsGrid results={results} columns={1} />
          </div>
        )}
      </div>
    </div>
  );
}