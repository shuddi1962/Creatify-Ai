'use client';

import { useState } from 'react';
import { Palette, Upload, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import UploadZone from '@/components/studio/UploadZone';

const PRESETS = [
  { id: 'cinema-orange-teal', name: 'Cinema Orange-Teal', color: '#008080' },
  { id: 'neon-night', name: 'Neon Night', color: '#FF00FF' },
  { id: 'golden-hour', name: 'Golden Hour', color: '#FFD700' },
  { id: 'moody-desaturated', name: 'Moody Desaturated', color: '#696969' },
  { id: 'black-white', name: 'Black & White', color: '#000000' },
  { id: 'high-contrast', name: 'High Contrast', color: '#000000' },
  { id: 'warm-vintage', name: 'Warm Vintage', color: '#D2691E' },
  { id: 'cool-futuristic', name: 'Cool Futuristic', color: '#00BFFF' },
  { id: 'bleach-bypass', name: 'Bleach Bypass', color: '#C0C0C0' },
  { id: 'cross-process', name: 'Cross Process', color: '#FF1493' },
  { id: 'faded-film', name: 'Faded Film', color: '#F5DEB3' },
  { id: 'day-for-night', name: 'Day for Night', color: '#191970' },
  { id: 'teal-shadows', name: 'Teal Shadows', color: '#008080' },
  { id: 'orange-skin', name: 'Orange Skin', color: '#FF8C00' },
  { id: 'aqua-orange', name: 'Aqua & Orange', color: '#00CED1' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: '#00FFFF' },
];

const SLIDERS = [
  { key: 'exposure', label: 'Exposure', min: -3, max: 3, step: 0.1, default: 0 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100, step: 1, default: 0 },
  { key: 'highlights', label: 'Highlights', min: -100, max: 100, step: 1, default: 0 },
  { key: 'shadows', label: 'Shadows', min: -100, max: 100, step: 1, default: 0 },
  { key: 'whites', label: 'Whites', min: -100, max: 100, step: 1, default: 0 },
  { key: 'blacks', label: 'Blacks', min: -100, max: 100, step: 1, default: 0 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100, step: 1, default: 0 },
  { key: 'vibrance', label: 'Vibrance', min: -100, max: 100, step: 1, default: 0 },
  { key: 'temperature', label: 'Temperature', min: -100, max: 100, step: 1, default: 0 },
  { key: 'tint', label: 'Tint', min: -100, max: 100, step: 1, default: 0 },
];

const HUE_SATS = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta'];

export default function CinemaColorGradingPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [adjustments, setAdjustments] = useState(Object.fromEntries(SLIDERS.map(s => [s.key, s.default])));
  const [hueAdjustments, setHueAdjustments] = useState(Object.fromEntries(HUE_SATS.map(c => [c, 0])));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handlePreset = (preset) => {
    setSelectedPreset(preset.id);
    toast.success(`Applied ${preset.name}`);
  };

  const handleGenerate = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a video or image');
      return;
    }
    setLoading(true);
    toast.success('Applying color grade...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      setResults([{ id: Date.now(), type: 'image', url: 'https://picsum.photos/seed/color/1280/720', prompt: selectedPreset || 'Custom grade' }]);
      toast.success('Color grade applied!');
    } catch (e) {
      toast.error('Failed to apply color grade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Palette} title="COLOR GRADING" subtitle="Apply professional color grading presets to any video instantly" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-4">
            <UploadZone onFile={setUploadedFile} accept="video/*,image/*" label="Upload video or image to grade" icon={Upload} preview={uploadedFile ? URL.createObjectURL(uploadedFile) : null} />
            {uploadedFile && (
              <button onClick={() => setShowBeforeAfter(!showBeforeAfter)} className="flex items-center gap-2 text-xs text-[#888] hover:text-white transition-all">
                {showBeforeAfter ? <EyeOff size={14} /> : <Eye size={14} />}
                {showBeforeAfter ? 'Hide Before/After' : 'Show Before/After'}
              </button>
            )}
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <SectionLabel>Preset Gallery</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => handlePreset(preset)}
                className={`relative rounded-xl overflow-hidden border transition-all ${
                  selectedPreset === preset.id ? 'border-[#7C3AED] ring-1 ring-[#7C3AED]' : 'border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                <div className="w-full aspect-[4/3]" style={{ backgroundColor: preset.color }} />
                <div className="p-2">
                  <p className="text-xs font-medium text-white truncate">{preset.name}</p>
                </div>
              </button>
            ))}
          </div>
        </GenerationPanel>
        <GenerationPanel>
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full text-left">
            <SectionLabel>Custom Adjustments</SectionLabel>
            <span className="text-xs text-[#7C3AED]">{showAdvanced ? 'Hide' : 'Show'}</span>
          </button>
          {showAdvanced && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SLIDERS.map(slider => (
                  <div key={slider.key}>
                    <div className="flex justify-between text-xs text-[#888] mb-1">
                      <span>{slider.label}</span>
                      <span>{adjustments[slider.key]}</span>
                    </div>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      step={slider.step}
                      value={adjustments[slider.key]}
                      onChange={e => setAdjustments(prev => ({ ...prev, [slider.key]: parseFloat(e.target.value) }))}
                      className="w-full accent-[#7C3AED]"
                    />
                  </div>
                ))}
              </div>
              <div>
                <SectionLabel>Hue / Saturation (per color)</SectionLabel>
                <div className="space-y-2 mt-2">
                  {HUE_SATS.map(color => (
                    <div key={color} className="flex items-center gap-3">
                      <span className="text-xs text-[#888] w-16">{color}</span>
                      <input
                        type="range"
                        min={-100}
                        max={100}
                        value={hueAdjustments[color]}
                        onChange={e => setHueAdjustments(prev => ({ ...prev, [color]: parseInt(e.target.value) }))}
                        className="flex-1 accent-[#7C3AED]"
                      />
                      <span className="text-xs text-[#555] w-8">{hueAdjustments[color]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Upload LUT File</SectionLabel>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border border-white/[0.08] rounded-xl text-xs text-[#888] cursor-pointer hover:bg-[#222] transition-all">
                  <Upload size={14} />
                  <span>Upload .cube LUT file</span>
                  <input type="file" accept=".cube" className="hidden" />
                </label>
              </div>
            </div>
          )}
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Apply Color Grade
          </GenerateButton>
        </div>
        <ResultsGrid results={results} />
      </div>
    </div>
  );
}