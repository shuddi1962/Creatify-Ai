'use client';

import { useState } from 'react';
import { Image, Camera } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import * as muapi from '@/packages/studio/src/muapi';

const CAMERA_PRESETS = ['Wide Shot', 'Close-Up', 'Aerial', 'Eye-Level', 'Low Angle', 'Dutch Tilt', 'Over-the-Shoulder', 'POV', 'Macro', 'Fish-Eye'];
const LENS_TYPES = ['24mm', '35mm', '50mm', '85mm', '135mm', '200mm'];
const APERTURES = ['f/1.4', 'f/1.8', 'f/2.8', 'f/5.6', 'f/8', 'f/11'];
const DOF_OPTIONS = ['Shallow', 'Normal', 'Deep'];
const LIGHTING_PRESETS = ['Golden Hour', 'Blue Hour', 'Studio', 'Overcast', 'Night', 'Dramatic'];

export default function CameraAnglePage() {
  const [prompt, setPrompt] = useState('');
  const [cameraPreset, setCameraPreset] = useState('Wide Shot');
  const [lens, setLens] = useState('50mm');
  const [aperture, setAperture] = useState('f/2.8');
  const [dof, setDof] = useState('Normal');
  const [lighting, setLighting] = useState('Golden Hour');
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const fullPrompt = `${prompt}, ${cameraPreset} shot, ${lens} lens, ${aperture} aperture, ${dof} depth of field, ${lighting} lighting`;
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        const response = await muapi.generateImage(apiKey, {
          model,
          prompt: fullPrompt,
          aspect_ratio: '16:9',
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Cinematic shot generated!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1280/720`,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Demo: Shot generated!');
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
        icon={Camera}
        title="CINEMATIC CAMERAS"
        subtitle="Image generation with professional camera controls and depth of field"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Describe your scene</SectionLabel>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A lone traveler standing on a mountain ridge at sunset..."
                className="w-full h-28 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <SectionLabel>Camera Preset</SectionLabel>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {CAMERA_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCameraPreset(preset)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      cameraPreset === preset
                        ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SectionLabel>Lens Type</SectionLabel>
                <StudioDropdown options={LENS_TYPES} value={lens} onChange={setLens} label="LENS" />
              </div>
              <div>
                <SectionLabel>Aperture</SectionLabel>
                <StudioDropdown options={APERTURES} value={aperture} onChange={setAperture} label="APERTURE" />
              </div>
              <div>
                <SectionLabel>Depth of Field</SectionLabel>
                <StudioDropdown options={DOF_OPTIONS} value={dof} onChange={setDof} label="DEPTH OF FIELD" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Lighting Preset</SectionLabel>
                <StudioDropdown options={LIGHTING_PRESETS} value={lighting} onChange={setLighting} label="LIGHTING" />
              </div>
              <div>
                <SectionLabel>Model</SectionLabel>
                <ModelSelector type="image" value={model} onChange={setModel} />
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate Shot
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}
