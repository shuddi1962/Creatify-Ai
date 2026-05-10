'use client';

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const VIDEO_LENGTH_OPTIONS = ['15s', '30s', '60s', '2min', '5min'];
const SHOTS_OPTIONS = ['3', '5', '8', '12'];
const STYLE_OPTIONS = ['Cinematic', 'Documentary', 'Commercial', 'Music Video', 'Short Film', 'Vlog'];

export default function SmartShotPage() {
  const [prompt, setPrompt] = useState('');
  const [videoLength, setVideoLength] = useState('30s');
  const [autoStoryboard, setAutoStoryboard] = useState(true);
  const [numShots, setNumShots] = useState('5');
  const [visualStyle, setVisualStyle] = useState('Cinematic');
  const [model, setModel] = useState('seedance-2');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [storyboard, setStoryboard] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your video concept');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Generating storyboard...');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const scenes = Array(parseInt(numShots)).fill(null).map((_, i) => ({
          scene: i + 1,
          prompt: `Scene ${i + 1}: ${prompt.substring(0, 50)}...`,
          duration: videoLength === '2min' ? '15s' : videoLength === '5min' ? '30s' : '5s',
          thumbnail: `https://picsum.photos/seed/${Date.now() + i}/320/180`
        }));
        setStoryboard(scenes);
        toast.success('Demo: Storyboard generated!');
      }
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFullVideo = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      setResults([{
        id: `demo-${Date.now()}`,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        prompt: prompt,
        type: 'video'
      }]);
      setStoryboard(null);
      toast.success('Full video generated!');
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
        title="SMART SHOT"
        subtitle="Describe your vision — AI plans the storyboard then generates each scene"
        badge="NEW"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Video Concept</SectionLabel>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your video concept in detail..."
                className="w-full h-40 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Video Length</SectionLabel>
                <PillSelector options={VIDEO_LENGTH_OPTIONS} value={videoLength} onChange={setVideoLength} />
              </div>
              <div>
                <SectionLabel>Number of Shots</SectionLabel>
                <PillSelector options={SHOTS_OPTIONS} value={numShots} onChange={setNumShots} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoStoryboard(!autoStoryboard)}
                className={`w-12 h-6 rounded-full transition-all ${
                  autoStoryboard ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoStoryboard ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
              <span className="text-sm text-[#888]">Auto-storyboard</span>
            </div>

            <div>
              <SectionLabel>Visual Style</SectionLabel>
              <PillSelector options={STYLE_OPTIONS} value={visualStyle} onChange={setVisualStyle} />
            </div>

            <div>
              <SectionLabel>Model</SectionLabel>
              <ModelSelector type="video" value={model} onChange={setModel} />
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Plan & Generate
          </GenerateButton>
        </div>

        {storyboard && (
          <div className="mt-8 bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Storyboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storyboard.map((scene) => (
                <div key={scene.scene} className="bg-[#0a0a0a] rounded-xl p-3 border border-white/[0.08]">
                  <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-2 overflow-hidden">
                    <img src={scene.thumbnail} alt={`Scene ${scene.scene}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-white">Scene {scene.scene}</span>
                    <span className="text-xs text-[#555]">{scene.duration}</span>
                  </div>
                  <p className="text-xs text-[#666] mt-1 line-clamp-2">{scene.prompt}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <GenerateButton onClick={handleGenerateFullVideo} loading={loading}>
                Generate Full Video
              </GenerateButton>
            </div>
          </div>
        )}

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}