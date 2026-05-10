'use client';

import { useState } from 'react';
import { Clapperboard } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';

const GENRES = [
  { id: 'action', name: 'Action', mood: 'High energy, fast-paced', style: 'Dynamic camera, bold colors', sample: 'Car chase sequence' },
  { id: 'horror', name: 'Horror', mood: 'Tense, unsettling, dark', style: 'Low-key lighting, desaturated tones', sample: 'Haunted mansion reveal' },
  { id: 'romance', name: 'Romance', mood: 'Warm, emotional, intimate', style: 'Soft focus, warm tones', sample: 'Sunset beach confession' },
  { id: 'sci-fi', name: 'Sci-Fi', mood: 'Futuristic, awe-inspiring', style: 'Cool tones, clean lines, FX', sample: 'Space station docking' },
  { id: 'drama', name: 'Drama', mood: 'Emotional, character-driven', style: 'Natural lighting, intimate close-ups', sample: 'Family dinner confrontation' },
  { id: 'comedy', name: 'Comedy', mood: 'Light, humorous, relatable', style: 'Bright colors, wide shots for reactions', sample: 'Wedding speech disaster' },
  { id: 'thriller', name: 'Thriller', mood: 'Suspenseful, edge-of-seat', style: 'High contrast, tight framing', sample: 'Interrogation scene' },
  { id: 'documentary', name: 'Documentary', mood: 'Authentic, informative', style: 'Natural light, handheld', sample: 'Market street vendor' },
  { id: 'western', name: 'Western', mood: 'Rugged, timeless', style: 'Warm earth tones, wide landscapes', sample: 'Desert showdown at noon' },
  { id: 'fantasy', name: 'Fantasy', mood: 'Magical, otherworldly', style: 'Rich colors, epic scale', sample: 'Dragon emergence' },
  { id: 'animation', name: 'Animation', mood: 'Creative, playful', style: 'Vibrant, stylized', sample: 'Enchanted forest creatures' },
  { id: 'music-video', name: 'Music Video', mood: 'Stylized, rhythmic', style: 'Bold visuals, dynamic cuts', sample: 'Concert performance' },
  { id: 'commercial', name: 'Commercial', mood: 'Persuasive, polished', style: 'High production, clear messaging', sample: 'Product reveal' },
  { id: 'art-film', name: 'Art Film', mood: 'Minimalist, contemplative', style: 'Long takes, muted palette', sample: 'Train window journey' },
  { id: 'k-drama', name: 'K-Drama', mood: 'Emotional, cinematic', style: 'Soft lighting, vibrant', sample: 'Rainy street reunion' },
  { id: 'bollywood', name: 'Bollywood', mood: 'Vibrant, musical', style: 'Bold colors, dance sequences', sample: 'Color festival dance' },
  { id: 'anime', name: 'Anime', mood: 'Dynamic, stylized', style: 'Cel-shaded, bold outlines', sample: 'Training montage' },
  { id: 'game-cinematic', name: 'Game Cinematic', mood: 'Epic, immersive', style: 'Cinematic, game-like quality', sample: 'Boss fight intro' },
  { id: 'fashion-film', name: 'Fashion Film', mood: 'Stylish, editorial', style: 'High fashion, artistic', sample: 'Runway collection reveal' },
  { id: 'sports-highlight', name: 'Sports Highlight', mood: 'Intense, celebratory', style: 'Dynamic, high contrast', sample: 'Championship winning goal' },
];

export default function CinemaGenresPage() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('seedance-2');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSelect = (genre) => {
    setSelectedGenre(genre.id);
    setPrompt(`${genre.name} scene: ${genre.mood}`);
    toast.success(`${genre.name} selected`);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your scene');
      return;
    }
    setLoading(true);
    toast.success('Generating...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      setResults([{ id: Date.now(), type: 'video', url: 'https://picsum.photos/seed/genre/1280/720', prompt }]);
      toast.success('Video generated!');
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Clapperboard} title="GENRE PRESETS" subtitle="One-click style presets for action, horror, romance, sci-fi and more" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {GENRES.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleSelect(genre)}
                className={`relative bg-[#0a0a0a] rounded-xl border p-3 text-left hover:border-[#7C3AED]/50 transition-all ${
                  selectedGenre === genre.id ? 'border-[#7C3AED] ring-1 ring-[#7C3AED]' : 'border-white/[0.08]'
                }`}
              >
                <p className="text-sm font-bold text-white">{genre.name}</p>
                <p className="text-[10px] text-[#555] mt-1">{genre.style}</p>
              </button>
            ))}
          </div>
        </GenerationPanel>
        {selectedGenre && (
          <GenerationPanel>
            <div className="space-y-4">
              <SectionLabel>{GENRES.find(g => g.id === selectedGenre)?.name} Scene</SectionLabel>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your scene..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-28"
              />
              <div className="flex justify-end">
                <GenerateButton onClick={handleGenerate} loading={loading}>
                  Generate {GENRES.find(g => g.id === selectedGenre)?.name} Video
                </GenerateButton>
              </div>
            </div>
          </GenerationPanel>
        )}
        <ResultsGrid results={results} columns={2} />
      </div>
    </div>
  );
}