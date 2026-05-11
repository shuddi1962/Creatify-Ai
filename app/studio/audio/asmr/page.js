'use client';

import { useState } from 'react';
import { Headphones, Play } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const ASMR_TYPES = [
  'Whispering', 'Tapping', 'Crinkling', 'Scratching', 'Water', 'Rain', 
  'Keyboard Typing', 'Hair Brushing', 'Cooking', 'Nature', 'Mouth Sounds', 'Page Turning'
];
const INTENSITY_OPTIONS = ['Very Gentle', 'Gentle', 'Medium'];
const AMBIENCE_OPTIONS = ['Silence', 'White Noise', 'Rain', 'Forest', 'Cafe'];
const DURATION_OPTIONS = ['1min', '5min', '10min', '30min', '1hr'];

export default function AsmrPage() {
  const [asmrType, setAsmrType] = useState('Whispering');
  const [intensity, setIntensity] = useState('Gentle');
  const [binaural, setBinaural] = useState(true);
  const [ambience, setAmbience] = useState('Silence');
  const [duration, setDuration] = useState('10min');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating ASMR!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 4000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/movie.mp3',
          prompt: `${asmrType} - ${intensity}`,
          type: 'audio'
        }]);
        toast.success('Demo: ASMR generated!');
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
        title="ASMR GENERATOR"
        subtitle="Generate soothing, high-quality ASMR audio with AI"
        badge="NEW"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>ASMR Type</SectionLabel>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {ASMR_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setAsmrType(type)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      asmrType === type
                        ? 'bg-[#6366f1] text-white border border-[#6366f1]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Intensity</SectionLabel>
                <StudioDropdown options={INTENSITY_OPTIONS} value={intensity} onChange={setIntensity} />
              </div>
              <div>
                <SectionLabel>Duration</SectionLabel>
                <StudioDropdown options={DURATION_OPTIONS} value={duration} onChange={setDuration} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBinaural(!binaural)}
                className={`w-12 h-6 rounded-full transition-all ${binaural ? 'bg-[#6366f1]' : 'bg-[#1a1a1a]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${binaural ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-[#888]">Binaural mode (headphones recommended)</span>
            </div>

            <div>
              <SectionLabel>Background Ambience</SectionLabel>
              <StudioDropdown options={AMBIENCE_OPTIONS} value={ambience} onChange={setAmbience} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate ASMR
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