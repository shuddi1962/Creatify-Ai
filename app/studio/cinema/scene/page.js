'use client';

import { useState } from 'react';
import { Layers, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';
import UploadZone from '@/components/studio/UploadZone';

const COMPOSITION_RULES = ['Rule of Thirds', 'Golden Ratio', 'Symmetry', 'Leading Lines', 'Frame in Frame', 'Diagonal'];
const COLOR_HARMONY = ['Complementary', 'Analogous', 'Triadic', 'Monochromatic'];

export default function CinemaScenePage() {
  const [subject, setSubject] = useState('');
  const [background, setBackground] = useState('');
  const [foreground, setForeground] = useState('');
  const [props, setProps] = useState('');
  const [lighting, setLighting] = useState('');
  const [weather, setWeather] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('Golden Hour');
  const [composition, setComposition] = useState('Rule of Thirds');
  const [colorHarmony, setColorHarmony] = useState('Complementary');
  const [depthLayers, setDepthLayers] = useState({ foreground: true, midground: true, background: true });
  const [refImage, setRefImage] = useState(null);
  const [model, setModel] = useState('seedance-2');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    setLoading(true);
    toast.success('Composing scene...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      setResults([{ id: Date.now(), type: 'video', url: 'https://picsum.photos/seed/scene/1280/720', prompt: subject }]);
      toast.success('Scene composed!');
    } catch (e) {
      toast.error('Failed to compose scene');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Layers} title="SCENE COMPOSITION" subtitle="Director-level control over every element in your scene" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <div>
              <SectionLabel>Subject</SectionLabel>
              <textarea value={subject} onChange={e => setSubject(e.target.value)} placeholder="Main subject description..." className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-20" />
            </div>
            <div>
              <SectionLabel>Background</SectionLabel>
              <textarea value={background} onChange={e => setBackground(e.target.value)} placeholder="Background environment and setting..." className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-20" />
            </div>
            <div>
              <SectionLabel>Foreground Elements</SectionLabel>
              <textarea value={foreground} onChange={e => setForeground(e.target.value)} placeholder="Elements in front of the subject..." className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-16" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Props</SectionLabel>
                <textarea value={props} onChange={e => setProps(e.target.value)} placeholder="Objects in scene..." className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-16" />
              </div>
              <div>
                <SectionLabel>Lighting Setup</SectionLabel>
                <textarea value={lighting} onChange={e => setLighting(e.target.value)} placeholder="How the scene is lit..." className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] resize-none h-16" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Weather</SectionLabel>
                <PillSelector options={['Clear', 'Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Foggy', 'Windy', 'Mixed']} value={weather} onChange={setWeather} />
              </div>
              <div>
                <SectionLabel>Time of Day</SectionLabel>
                <PillSelector options={['Dawn', 'Golden Hour', 'Midday', 'Afternoon', 'Dusk', 'Night', 'Blue Hour']} value={timeOfDay} onChange={setTimeOfDay} />
              </div>
            </div>
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <div className="space-y-4">
            <div>
              <SectionLabel>Composition Rules</SectionLabel>
              <PillSelector options={COMPOSITION_RULES} value={composition} onChange={setComposition} />
            </div>
            <div>
              <SectionLabel>Depth Layers</SectionLabel>
              <div className="flex gap-2">
                {['foreground', 'midground', 'background'].map(layer => (
                  <button
                    key={layer}
                    onClick={() => setDepthLayers(prev => ({ ...prev, [layer]: !prev[layer] }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      depthLayers[layer] ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Color Harmony</SectionLabel>
              <PillSelector options={COLOR_HARMONY} value={colorHarmony} onChange={setColorHarmony} />
            </div>
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <div className="space-y-4">
            <SectionLabel>Reference Image</SectionLabel>
            <UploadZone onFile={setRefImage} accept="image/*" label="Upload reference image" icon={Upload} preview={refImage ? URL.createObjectURL(refImage) : null} />
            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector value={model} onChange={setModel} type="video" />
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Compose Scene
          </GenerateButton>
        </div>
        <ResultsGrid results={results} columns={2} />
      </div>
    </div>
  );
}