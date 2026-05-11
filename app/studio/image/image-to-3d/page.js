'use client';

import { useState } from 'react';
import { Image, Box } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const OUTPUT_TYPES = ['3D Render', 'Rotating Video', 'GLB File', 'OBJ File'];
const VIEWING_ANGLES = ['360 Spin', 'Front 3-4', 'Isometric', 'Custom'];
const MATERIALS = ['Realistic', 'Stylized', 'Clay', 'Metallic', 'Glass'];
const BACKGROUNDS = ['Transparent', 'Studio', 'Environment Map'];

export default function ImageTo3DPage() {
  const [sourceImage, setSourceImage] = useState(null);
  const [outputType, setOutputType] = useState('3D Render');
  const [viewAngle, setViewAngle] = useState('360 Spin');
  const [material, setMaterial] = useState('Realistic');
  const [background, setBackground] = useState('Transparent');
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
      toast.error('Please upload an image to convert');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      const isVideo = outputType === 'Rotating Video';
      setResults([{
        id: `result-${Date.now()}`,
        url: isVideo ? `https://picsum.photos/seed/${Date.now()}/800/600` : `https://picsum.photos/seed/${Date.now()}/1024/1024`,
        prompt: `${outputType} - ${viewAngle} - ${material}`,
        type: isVideo ? 'video' : 'image'
      }]);
      toast.success('3D generated successfully!');
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
        icon={Box}
        title="IMAGE TO 3D"
        subtitle="Convert any flat image into a 3D model or interactive render"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Image to Convert to 3D</SectionLabel>
              <UploadZone onFile={handleFile} preview={sourceImage} accept="image/*" label="Upload image" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Output Type</SectionLabel>
                <StudioDropdown options={OUTPUT_TYPES.map(o => ({ value: o, label: o.toUpperCase() }))} value={outputType} onChange={setOutputType} />
              </div>
              <div>
                <SectionLabel>Viewing Angle</SectionLabel>
                <StudioDropdown options={VIEWING_ANGLES.map(o => ({ value: o, label: o.toUpperCase() }))} value={viewAngle} onChange={setViewAngle} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Material</SectionLabel>
                <StudioDropdown options={MATERIALS.map(o => ({ value: o, label: o.toUpperCase() }))} value={material} onChange={setMaterial} />
              </div>
              <div>
                <SectionLabel>Background</SectionLabel>
                <StudioDropdown options={BACKGROUNDS.map(o => ({ value: o, label: o.toUpperCase() }))} value={background} onChange={setBackground} />
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate 3D
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}