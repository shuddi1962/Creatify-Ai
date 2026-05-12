'use client';

import { useState } from 'react';
import { Clapperboard } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout';

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
    <StudioEditorLayout
      left={
        <LeftPanel title="GENRES">
          {GENRES.map(g => (
            <button key={g.id} onClick={() => handleSelect(g)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 12px',
                background: selectedGenre === g.id ? 'var(--accent-bg)' : 'none',
                border: 'none', cursor: 'pointer', borderRadius: 8,
                color: selectedGenre === g.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontSize: 13, textAlign: 'left', transition: 'all 100ms',
              }}
            >{g.name}</button>
          ))}
        </LeftPanel>
      }
      canvas={
        <StudioCanvas overlay={<CornerMarkers />}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700,
            color: 'transparent',
            background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center', zIndex: 1,
          }}>
            GENRE PRESETS
          </h1>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: 8, marginTop: 24, zIndex: 1, maxWidth: 500, width: '100%', padding: '0 16px',
          }}>
            {GENRES.map(g => (
              <button key={g.id} onClick={() => handleSelect(g)}
                style={{
                  background: selectedGenre === g.id ? 'var(--accent-bg)' : 'var(--bg-card)',
                  borderRadius: 10, border: selectedGenre === g.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  padding: '10px 12px', cursor: 'pointer', textAlign: 'left',
                }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: selectedGenre === g.id ? 'var(--accent-text)' : 'var(--text-primary)' }}>{g.name}</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{g.style}</div>
              </button>
            ))}
          </div>
          {selectedGenre && (
            <div style={{ marginTop: 16, zIndex: 1, width: '60%' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Scene Description</div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                style={{
                  width: '100%', height: 80, borderRadius: 10,
                  border: '1px solid var(--border-default)', background: 'var(--bg-input)',
                  color: 'var(--text-primary)', padding: 10, fontSize: 13, resize: 'none',
                }}
              />
            </div>
          )}
        </StudioCanvas>
      }
      directorBar={
        <DirectorBar title="Controls">
          <PromptInput value={''} placeholder="Select a genre preset and describe your scene..." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <GenerateButton onClick={handleGenerate} disabled={loading || !selectedGenre} style={{ opacity: loading || !selectedGenre ? 0.6 : 1 }}>
              {loading ? 'Generating...' : 'Generate Video'}
            </GenerateButton>
          </div>
        </DirectorBar>
      }
    />
  );
}
