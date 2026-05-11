'use client';

import { useState } from 'react';
import { Image } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const SCALE_OPTIONS = ['2x', '4x', '8x'];
const ENHANCEMENT_MODES = ['Standard', 'Face Enhancement', 'Detail Boost', 'Noise Reduction'];
const OUTPUT_FORMATS = ['PNG', 'JPEG', 'WEBP'];

export default function UpscalePage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [scale, setScale] = useState('4x');
  const [enhancementMode, setEnhancementMode] = useState('Standard');
  const [outputFormat, setOutputFormat] = useState('PNG');
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
      toast.error('Please upload an image to upscale');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      const newWidth = scale === '2x' ? 2048 : scale === '4x' ? 4096 : 8192;
      setResults([{
        id: `result-${Date.now()}`,
        url: `https://picsum.photos/seed/${Date.now()}/${newWidth}/${newWidth}`,
        prompt: `${scale} upscale - ${enhancementMode}`,
        type: 'image'
      }]);
      toast.success('Image upscaled successfully!');
    } catch (error) {
      toast.error(error.message || 'Upscale failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        icon={Image}
        title="IMAGE UPSCALE"
        subtitle="Enhance resolution to 2x, 4x, or 8x crystal clarity with AI"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Image to Upscale</SectionLabel>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload image to upscale" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SectionLabel>Scale</SectionLabel>
                <StudioDropdown options={SCALE_OPTIONS.map(o => ({ value: o, label: o.toUpperCase() }))} value={scale} onChange={setScale} />
              </div>
              <div>
                <SectionLabel>Enhancement Mode</SectionLabel>
                <StudioDropdown options={ENHANCEMENT_MODES.map(o => ({ value: o, label: o.toUpperCase() }))} value={enhancementMode} onChange={setEnhancementMode} />
              </div>
              <div>
                <SectionLabel>Output Format</SectionLabel>
                <StudioDropdown options={OUTPUT_FORMATS.map(o => ({ value: o, label: o.toUpperCase() }))} value={outputFormat} onChange={setOutputFormat} />
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Upscale Image
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}