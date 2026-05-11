'use client';

import { useState } from 'react';
import { Image } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const SUBJECT_TYPES = ['Person', 'Product', 'Object', 'Architecture', 'Character'];
const ANGLES = [
  'Front', 'Front-Left', 'Left', 'Back-Left', 'Back', 'Back-Right', 'Right', 'Front-Right', 'Top'
];
const BG_STYLES = ['Transparent', 'White Studio', 'Gradient', 'Custom prompt'];

export default function MultiViewPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [subjectType, setSubjectType] = useState('Product');
  const [selectedAngles, setSelectedAngles] = useState(['Front', 'Left', 'Right']);
  const [bgStyle, setBgStyle] = useState('White Studio');
  const [customPrompt, setCustomPrompt] = useState('');
  const [model, setModel] = useState('flux');
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

  const toggleAngle = (angle) => {
    setSelectedAngles(prev => 
      prev.includes(angle) ? prev.filter(a => a !== angle) : [...prev, angle]
    );
  };

  const handleGenerate = async () => {
    if (!sourceImage) {
      toast.error('Please upload a subject image');
      return;
    }

    if (selectedAngles.length === 0) {
      toast.error('Please select at least one angle');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setResults(selectedAngles.map((angle, i) => ({
        id: `result-${Date.now()}-${i}`,
        url: `https://picsum.photos/seed/${Date.now() + i}/800/800`,
        prompt: `${angle} view - ${subjectType}`,
        type: 'image'
      })));
      toast.success(`${selectedAngles.length} angles generated!`);
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
        icon={Image}
        title="MULTI-VIEW"
        subtitle="Generate 9 camera angles from one single image automatically"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Subject Image</SectionLabel>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload subject image" />
            </div>

            <div>
              <SectionLabel>Subject Type</SectionLabel>
              <StudioDropdown options={SUBJECT_TYPES.map(o => ({ value: o, label: o.toUpperCase() }))} value={subjectType} onChange={setSubjectType} />
            </div>

            <div>
              <SectionLabel>Select Angles (3x3 grid)</SectionLabel>
              <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mt-3">
                {ANGLES.map((angle) => (
                  <button
                    key={angle}
                    onClick={() => toggleAngle(angle)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      selectedAngles.includes(angle)
                        ? 'bg-[#6366f1] text-white border border-[#6366f1]'
                        : 'bg-[#1a1a1a] text-[#666] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {selectedAngles.includes(angle) && '✓ '}{angle}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Background Style</SectionLabel>
              <StudioDropdown options={BG_STYLES.map(o => ({ value: o, label: o.toUpperCase() }))} value={bgStyle} onChange={setBgStyle} />
              {bgStyle === 'Custom prompt' && (
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe background..."
                  className="mt-3 w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#6366f1]"
                />
              )}
            </div>

            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector type="image" value={model} onChange={setModel} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate All Angles
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={3} />
      </div>
    </div>
  );
}