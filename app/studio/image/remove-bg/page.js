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
import PillSelector from '@/components/studio/PillSelector';

const BG_OPTIONS = ['Transparent', 'Solid Color', 'Custom Background'];
const REFINEMENT_TABS = ['Auto', 'Hair Detail', 'Product', 'Portrait'];
const OUTPUT_FORMATS = ['PNG', 'JPEG'];

export default function RemoveBgPage() {
  const [images, setImages] = useState([]);
  const [bgType, setBgType] = useState('Transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [customBg, setCustomBg] = useState(null);
  const [refinement, setRefinement] = useState('Auto');
  const [outputFormat, setOutputFormat] = useState('PNG');
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

  const handleBgType = (type) => {
    setBgType(type);
    if (type === 'Transparent') setCustomBg(null);
  };

  const handleCustomBg = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCustomBg(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResults(images.map((img, i) => ({
        id: `result-${Date.now()}-${i}`,
        url: `https://picsum.photos/seed/${Date.now() + i}/800/800?grayscale`,
        prompt: 'Background removed',
        type: 'image'
      })));
      toast.success('Background removed successfully!');
    } catch (error) {
      toast.error(error.message || 'Background removal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        icon={Image}
        title="REMOVE BACKGROUND"
        subtitle="Clean, instant AI background removal — transparent or custom"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Images (Multiple)</SectionLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-1 bg-[#0a0a0a]">
                    <img src={img.preview} alt="" className="w-full h-24 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length < 10 && (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-4 cursor-pointer bg-[#0a0a0a] hover:bg-[#111]">
                    <Image size={20} className="text-[#444]" />
                    <span className="text-xs text-[#444]">Add more</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div>
              <SectionLabel>Background Replacement</SectionLabel>
              <PillSelector options={BG_OPTIONS} value={bgType} onChange={handleBgType} />
              {bgType === 'Solid Color' && (
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="bg-[#1A1A1A] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm w-24"
                  />
                </div>
              )}
              {bgType === 'Custom Background' && (
                <div className="mt-3">
                  <UploadZone onFile={handleCustomBg} preview={customBg} accept="image/*" label="Upload background" />
                </div>
              )}
            </div>

            <div>
              <SectionLabel>Refinement</SectionLabel>
              <PillSelector options={REFINEMENT_TABS} value={refinement} onChange={setRefinement} />
            </div>

            <div>
              <SectionLabel>Output Format</SectionLabel>
              <PillSelector options={OUTPUT_FORMATS} value={outputFormat} onChange={setOutputFormat} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Remove Background
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}