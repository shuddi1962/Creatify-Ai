'use client';

import { useState } from 'react';
import { Image, Smile } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const MEME_TYPES = ['Classic top-bottom text', 'Modern overlay', 'Reaction', 'Deep Fried', 'Wholesome', 'Dank'];
const FONTS = ['Impact', 'Arial Black', 'Comic Sans', 'Helvetica Bold', 'Custom'];
const TEXT_COLORS = ['White', 'Black', 'Yellow', 'Custom'];

export default function MemePage() {
  const [memeType, setMemeType] = useState('Classic top-bottom text');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [font, setFont] = useState('Impact');
  const [textColor, setTextColor] = useState('White');
  const [customColor, setCustomColor] = useState('#ffffff');
  const [textOutline, setTextOutline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setUploadedImage(null);
    }
  };

  const handleGenerate = async () => {
    const isClassic = memeType === 'Classic top-bottom text';
    if (!uploadedImage && !prompt.trim() && (!topText.trim() && !bottomText.trim())) {
      toast.error('Please upload an image or enter text/prompt');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResults([{
        id: `result-${Date.now()}`,
        url: `https://picsum.photos/seed/${Date.now()}/800/800`,
        prompt: isClassic ? `${topText} / ${bottomText}` : prompt,
        type: 'image'
      }]);
      toast.success('Meme generated!');
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
        icon={Smile}
        title="MEME GENERATOR"
        subtitle="Create viral AI memes from a simple text prompt"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Meme Type</SectionLabel>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {MEME_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setMemeType(type)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      memeType === type
                        ? 'bg-[#6366f1] text-white border border-[#6366f1]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Upload Image (Optional)</SectionLabel>
                <UploadZone onFile={handleFile} preview={uploadedImage} accept="image/*" label="Upload image" />
              </div>
              {memeType === 'Classic top-bottom text' ? (
                <div className="space-y-3">
                  <div>
                    <SectionLabel>Top Text</SectionLabel>
                    <input
                      type="text"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                      placeholder="TOP TEXT"
                      className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#6366f1]"
                    />
                  </div>
                  <div>
                    <SectionLabel>Bottom Text</SectionLabel>
                    <input
                      type="text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                      placeholder="BOTTOM TEXT"
                      className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#6366f1]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <SectionLabel>Prompt</SectionLabel>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your meme concept..."
                    className="w-full h-32 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SectionLabel>Font</SectionLabel>
                <StudioDropdown options={FONTS.map(o => ({ value: o, label: o.toUpperCase() }))} value={font} onChange={setFont} />
              </div>
              <div>
                <SectionLabel>Text Color</SectionLabel>
                <StudioDropdown options={TEXT_COLORS.map(o => ({ value: o, label: o.toUpperCase() }))} value={textColor} onChange={setTextColor} />
                {textColor === 'Custom' && (
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="mt-2 w-10 h-10 rounded-lg cursor-pointer"
                  />
                )}
              </div>
              <div className="flex items-center gap-3">
                <SectionLabel>Text Outline</SectionLabel>
                <button
                  onClick={() => setTextOutline(!textOutline)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    textOutline ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    textOutline ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate Meme
          </GenerateButton>
        </div>

        <ResultsGrid results={results} />
      </div>
    </div>
  );
}