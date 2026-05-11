'use client';

import { useState } from 'react';
import { Image, ShoppingBag } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';
import * as muapi from '@/packages/studio/src/muapi';

const PLACEMENT_STYLES = ['Natural', 'Floating', 'Shadow', 'Reflection'];
const BG_STYLES = ['Studio', 'Lifestyle', 'Nature', 'Urban', 'Abstract', 'Custom'];

export default function ProductPlacementPage() {
  const [productImage, setProductImage] = useState(null);
  const [sceneImage, setSceneImage] = useState(null);
  const [scenePrompt, setScenePrompt] = useState('');
  const [placementStyle, setPlacementStyle] = useState('Natural');
  const [productScale, setProductScale] = useState(50);
  const [bgStyle, setBgStyle] = useState('Lifestyle');
  const [customBg, setCustomBg] = useState(null);
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleProductFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProductImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setProductImage(null);
    }
  };

  const handleSceneFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSceneImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSceneImage(null);
    }
  };

  const handleCustomBg = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCustomBg(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setCustomBg(null);
    }
  };

  const handleGenerate = async () => {
    if (!productImage) {
      toast.error('Please upload a product image');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      const fullPrompt = `${scenePrompt || 'Product in scene'}, ${placementStyle} placement, ${bgStyle} background, ${productScale}% scale`;
      if (apiKey) {
        const response = await muapi.generateI2I(apiKey, {
          model,
          prompt: fullPrompt,
          image_url: productImage,
          strength: 0.6,
        });
        setResults([{
          id: `result-${Date.now()}`,
          url: response.url,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Product placed successfully!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: `https://picsum.photos/seed/${Date.now()}/1024/768`,
          prompt: fullPrompt,
          type: 'image'
        }]);
        toast.success('Demo: Product placed!');
      }
    } catch (error) {
      toast.error(error.message || 'Placement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        icon={ShoppingBag}
        title="PRODUCT PLACEMENT"
        subtitle="Place your product into any scene or environment naturally"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Product Image</SectionLabel>
                <UploadZone onFile={handleProductFile} preview={productImage} accept="image/*" label="Upload product" />
              </div>
              <div>
                <SectionLabel>Scene / Background (Optional)</SectionLabel>
                <UploadZone onFile={handleSceneFile} preview={sceneImage} accept="image/*" label="Upload scene" />
              </div>
            </div>

            <div>
              <SectionLabel>Scene Prompt</SectionLabel>
              <textarea
                value={scenePrompt}
                onChange={(e) => setScenePrompt(e.target.value)}
                placeholder="Describe the scene or leave empty for AI to generate..."
                className="w-full h-20 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Placement Style</SectionLabel>
                <StudioDropdown options={PLACEMENT_STYLES} value={placementStyle} onChange={setPlacementStyle} label="PLACEMENT STYLE" />
              </div>
              <div>
                <SectionLabel>Product Scale</SectionLabel>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={productScale}
                    onChange={(e) => setProductScale(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                  />
                  <span className="text-sm text-white w-12">{productScale}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Background Style</SectionLabel>
                <StudioDropdown options={BG_STYLES} value={bgStyle} onChange={setBgStyle} label="BACKGROUND" />
                {bgStyle === 'Custom' && (
                  <div className="mt-3">
                    <UploadZone onFile={handleCustomBg} preview={customBg} accept="image/*" label="Custom background" />
                  </div>
                )}
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
            Place Product
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}
