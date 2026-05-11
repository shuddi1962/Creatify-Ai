'use client';

import { useState } from 'react';
import { Image, User } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const STYLE_PRESETS = [
  'Business Professional', 'LinkedIn', 'Creative', 'Executive', 
  'Casual Smart', 'Medical', 'Legal', 'Tech', 'Academic'
];
const BACKGROUNDS = ['White', 'Grey', 'Dark', 'Gradient', 'Office', 'Outdoor', 'Bokeh'];
const ATTIRES = ['Suit', 'Business Casual', 'Smart Casual', 'Industry Specific'];
const EXPRESSIONS = ['Friendly', 'Confident', 'Approachable', 'Serious'];
const OUTPUT_QUANTITIES = ['10', '20', '40'];

export default function HeadshotPage() {
  const [images, setImages] = useState([]);
  const [stylePreset, setStylePreset] = useState('Business Professional');
  const [background, setBackground] = useState('Grey');
  const [attire, setAttire] = useState('Business Casual');
  const [expression, setExpression] = useState('Confident');
  const [outputQty, setOutputQty] = useState('20');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, { file, preview: e.target.result }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (images.length < 1) {
      toast.error('Please upload at least one selfie photo');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const qty = parseInt(outputQty);
      setResults(Array(qty).fill(null).map((_, i) => ({
        id: `result-${Date.now()}-${i}`,
        url: `https://picsum.photos/seed/${Date.now() + i}/600/800`,
        prompt: `${stylePreset} - ${attire} - ${expression}`,
        type: 'image'
      })));
      toast.success(`${qty} headshots generated!`);
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
        icon={User}
        title="AI HEADSHOT"
        subtitle="Professional studio-quality headshots generated in seconds"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload 4–10 selfie photos for best results</SectionLabel>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative rounded-lg border border-white/[0.08] p-1 bg-[#0a0a0a]">
                    <img src={img.preview} alt="" className="w-full h-20 object-cover rounded" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length < 10 && (
                  <label className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-white/[0.12] p-3 cursor-pointer bg-[#0a0a0a] hover:bg-[#111]">
                    <User size={16} className="text-[#444]" />
                    <span className="text-[10px] text-[#444]">Add</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div>
              <SectionLabel>Style Preset</SectionLabel>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                {STYLE_PRESETS.map((style) => (
                  <button
                    key={style}
                    onClick={() => setStylePreset(style)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                      stylePreset === style
                        ? 'bg-[#6366f1] text-white border border-[#6366f1]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Background</SectionLabel>
                <StudioDropdown options={BACKGROUNDS.map(o => ({ value: o, label: o.toUpperCase() }))} value={background} onChange={setBackground} />
              </div>
              <div>
                <SectionLabel>Attire</SectionLabel>
                <StudioDropdown options={ATTIRES.map(o => ({ value: o, label: o.toUpperCase() }))} value={attire} onChange={setAttire} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Expression</SectionLabel>
                <StudioDropdown options={EXPRESSIONS.map(o => ({ value: o, label: o.toUpperCase() }))} value={expression} onChange={setExpression} />
              </div>
              <div>
                <SectionLabel>Output Quantity</SectionLabel>
                <StudioDropdown options={OUTPUT_QUANTITIES.map(o => ({ value: o, label: o.toUpperCase() }))} value={outputQty} onChange={setOutputQty} />
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate Headshots
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={4} />
      </div>
    </div>
  );
}