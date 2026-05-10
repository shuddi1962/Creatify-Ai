'use client';

import { useState } from 'react';
import { Image, Sun, Moon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const LIGHT_TYPES = ['Point', 'Directional', 'Ambient', 'Rim', 'Fill'];
const LIGHT_COLORS = [
  { id: 'Warm', color: '#FFD700' },
  { id: 'Cool', color: '#87CEEB' },
  { id: 'Golden', color: '#DAA520' },
  { id: 'Blue Hour', color: '#4169E1' },
  { id: 'Neon Pink', color: '#FF1493' },
  { id: 'Neon Blue', color: '#00FFFF' },
  { id: 'White', color: '#FFFFFF' },
];

const DIRECTIONS = [
  { id: 'top', label: '↑' },
  { id: 'top-right', label: '↗' },
  { id: 'right', label: '→' },
  { id: 'bottom-right', label: '↘' },
  { id: 'bottom', label: '↓' },
  { id: 'bottom-left', label: '↙' },
  { id: 'left', label: '←' },
  { id: 'top-left', label: '↖' },
];

export default function RelightPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [lightPosition, setLightPosition] = useState('right');
  const [lightType, setLightType] = useState('Directional');
  const [lightColor, setLightColor] = useState('Warm');
  const [intensity, setIntensity] = useState(70);
  const [shadowIntensity, setShadowIntensity] = useState(30);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSourceImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSourceImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) {
      toast.error('Please upload an image to relight');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setResults([{
        id: `result-${Date.now()}`,
        url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
        prompt: `${lightType} light - ${lightPosition} - ${lightColor} - ${intensity}% intensity`,
        type: 'image'
      }]);
      toast.success('Lighting applied successfully!');
    } catch (error) {
      toast.error(error.message || 'Relighting failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedColor = LIGHT_COLORS.find(c => c.id === lightColor);

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        icon={Sun}
        title="RELIGHT"
        subtitle="Adjust lighting position, color, and brightness on any photo"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Image to Relight</SectionLabel>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload image" />
            </div>

            <div>
              <SectionLabel>Light Position</SectionLabel>
              <div className="flex items-center justify-center gap-8 mt-3">
                <div className="relative w-32 h-32 bg-[#0a0a0a] rounded-full border border-white/[0.12]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-1">
                      {DIRECTIONS.map((dir) => (
                        <button
                          key={dir.id}
                          onClick={() => setLightPosition(dir.id)}
                          className={`w-8 h-8 rounded-lg text-lg font-bold transition-all ${
                            lightPosition === dir.id
                              ? 'bg-[#7C3AED] text-white'
                              : 'bg-[#1a1a1a] text-[#666] hover:bg-[#222]'
                          }`}
                        >
                          {dir.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#1a1a1a] rounded-full border border-white/[0.12]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Light Type</SectionLabel>
                <PillSelector options={LIGHT_TYPES} value={lightType} onChange={setLightType} />
              </div>
              <div>
                <SectionLabel>Light Color</SectionLabel>
                <div className="flex items-center gap-2 mt-2">
                  {LIGHT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setLightColor(c.id)}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        lightColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111]' : ''
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.id}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Intensity</SectionLabel>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                  />
                  <span className="text-sm text-white w-12">{intensity}%</span>
                </div>
              </div>
              <div>
                <SectionLabel>Shadow Intensity</SectionLabel>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadowIntensity}
                    onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                  />
                  <span className="text-sm text-white w-12">{shadowIntensity}%</span>
                </div>
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Apply Lighting
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}