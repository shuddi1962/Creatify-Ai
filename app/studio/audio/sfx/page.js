'use client';

import { useState } from 'react';
import { Volume2, Library, Grid } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const CATEGORIES = ['Nature', 'Urban', 'Mechanical', 'Human', 'Impact', 'Ambient', 'Foley', 'Sci-Fi'];
const PRESET_EXAMPLES = [
  'Glass breaking', 'Thunder', 'Crowd cheering', 'Footsteps', 
  'Car engine', 'Door creaking', 'Rain', 'Wind', 'Explosion',
  'Bird chirping', 'Keyboard typing', 'Applause', 'Gunshot'
];
const DURATION_OPTIONS = ['1s', '2s', '5s', '10s', '30s'];
const VARIATION_OPTIONS = ['1', '2', '4'];

export default function SfxPage() {
  const [prompt, setPrompt] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [duration, setDuration] = useState('5s');
  const [variations, setVariations] = useState('1');
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt or select from library');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating sound effect!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults(Array(parseInt(variations)).fill(null).map((_, i) => ({
          id: `demo-${Date.now()}-${i}`,
          url: 'https://www.w3schools.com/html/movie.mp3',
          prompt: prompt,
          type: 'audio'
        })));
        toast.success('Demo: Sound effect generated!');
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
        title="SOUND EFFECTS"
        subtitle="Create any sound effect from a simple text description"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Prompt</SectionLabel>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the sound effect you want..."
                className="w-full h-24 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none"
              />
            </div>

            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/[0.08] rounded-xl text-sm text-white hover:bg-[#222] transition-all"
            >
              <Library size={16} className="text-[#666]" />
              Browse library
            </button>

            {showLibrary && (
              <div>
                <SectionLabel>Categories</SectionLabel>
                <div className="flex flex-wrap gap-2 mb-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#6366f1] text-white'
                          : 'bg-[#1a1a1a] text-[#888] hover:bg-[#222]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <SectionLabel>Quick Examples</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {PRESET_EXAMPLES.map(ex => (
                    <button
                      key={ex}
                      onClick={() => { setPrompt(ex); setShowLibrary(false); }}
                      className="px-3 py-1.5 bg-[#1a1a1a] text-[#888] rounded-lg text-xs font-medium border border-white/[0.08] hover:bg-[#222] hover:text-white transition-all"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Duration</SectionLabel>
                <StudioDropdown options={DURATION_OPTIONS} value={duration} onChange={setDuration} />
              </div>
              <div>
                <SectionLabel>Variations</SectionLabel>
                <StudioDropdown options={VARIATION_OPTIONS} value={variations} onChange={setVariations} />
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
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate Sound Effect
          </GenerateButton>
        </div>

        {results.length > 0 && (
          <div className="mt-8">
            <ResultsGrid results={results} columns={Math.min(parseInt(variations), 3)} />
          </div>
        )}
      </div>
    </div>
  );
}