'use client';

import { useState } from 'react';
import { Film } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import AspectRatioPicker from '@/components/studio/AspectRatioPicker';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const GENRES = ['Action', 'Horror', 'Romance', 'Sci-Fi', 'Drama', 'Comedy', 'Documentary', 'Music Video', 'Commercial', 'Thriller'];
const VISUAL_STYLES = ['Blockbuster', 'Indie Film', 'Short Film', 'Music Video', 'TV Drama', 'Anime Cinematic', 'European Art Film'];
const SHOT_TYPES = ['Establishing', 'Medium', 'Close-Up', 'Extreme Close-Up', 'Two-Shot', 'Ensemble'];
const LIGHTING = ['Motivated', 'High-Key', 'Low-Key', 'Natural', 'Magic Hour', 'Night'];

export default function CinemaGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Action');
  const [visualStyle, setVisualStyle] = useState('Blockbuster');
  const [shotType, setShotType] = useState('Medium');
  const [lighting, setLighting] = useState('Motivated');
  const [model, setModel] = useState('seedance-2');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState('5');
  const [quality, setQuality] = useState('high');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your cinematic scene');
      return;
    }
    setLoading(true);
    toast.success('Generating cinematic scene...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      const result = {
        id: Date.now(),
        type: 'video',
        url: 'https://picsum.photos/seed/cinema/1280/720',
        prompt: `${genre} - ${prompt}`,
        model,
      };
      setResults([result]);
      toast.success('Cinematic scene generated!');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Film} title="CINEMA STUDIO" subtitle="Full cinematic video generation with Hollywood-level quality" />
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Scene Prompt</SectionLabel>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your cinematic scene in detail..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-28"
              />
            </div>
            <div>
              <SectionLabel>Genre</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      genre === g ? 'bg-[#7C3AED] text-white border border-[#7C3AED]' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Visual Style</SectionLabel>
              <PillSelector options={VISUAL_STYLES} value={visualStyle} onChange={setVisualStyle} />
            </div>
            <div>
              <SectionLabel>Shot Type</SectionLabel>
              <PillSelector options={SHOT_TYPES} value={shotType} onChange={setShotType} />
            </div>
            <div>
              <SectionLabel>Lighting</SectionLabel>
              <PillSelector options={LIGHTING} value={lighting} onChange={setLighting} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Model</SectionLabel>
                <ModelSelector value={model} onChange={setModel} type="video" />
              </div>
              <div>
                <SectionLabel>Duration (seconds)</SectionLabel>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white appearance-none"
                  >
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <SectionLabel>Aspect Ratio</SectionLabel>
              <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} options={['16:9', '1:1', '9:16', '2.39:1']} />
            </div>
            <div>
              <SectionLabel>Quality</SectionLabel>
              <PillSelector options={['standard', 'high', 'ultra']} value={quality} onChange={setQuality} />
            </div>
            <GenerateButton onClick={handleGenerate} loading={loading}>
              Generate Scene
            </GenerateButton>
          </div>
        </GenerationPanel>
        <ResultsGrid results={results} columns={2} />
      </div>
    </div>
  );
}