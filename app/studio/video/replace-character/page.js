'use client';

import { useState } from 'react';
import { Video, User, Image } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const METHOD_TABS = ['Upload New Character', 'Describe Character', 'Use Saved Character'];
const DETECTION_OPTIONS = ['Auto-detect', 'Manual selection'];

export default function ReplaceCharacterPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [method, setMethod] = useState('Upload New Character');
  const [characterFile, setCharacterFile] = useState(null);
  const [characterPreview, setCharacterPreview] = useState(null);
  const [characterDescription, setCharacterDescription] = useState('');
  const [detection, setDetection] = useState('Auto-detect');
  const [preserveClothing, setPreserveClothing] = useState(true);
  const [preserveExpression, setPreserveExpression] = useState(true);
  const [preservePose, setPreservePose] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleVideoUpload = (file) => {
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      setVideoFile(null);
      setVideoPreview(null);
    }
  };

  const handleCharacterUpload = (file) => {
    if (file) {
      setCharacterFile(file);
      setCharacterPreview(URL.createObjectURL(file));
    } else {
      setCharacterFile(null);
      setCharacterPreview(null);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a source video');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Character replacement started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: 'Character replaced',
          type: 'video'
        }]);
        toast.success('Demo: Character replaced!');
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
        title="REPLACE CHARACTER"
        subtitle="Swap out and replace characters inside any video clip"
        badge="NEW"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Source Video</SectionLabel>
              {videoPreview ? (
                <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                  <video src={videoPreview} controls className="w-full h-48 object-contain rounded-lg" />
                  <button
                    onClick={() => handleVideoUpload(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-8 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                  <div className="w-14 h-14 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                    <Video size={28} className="text-[#666]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Upload source video</p>
                    <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} className="hidden" />
                </label>
              )}
            </div>

            <div className="flex gap-2">
              {METHOD_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setMethod(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    method === tab ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {method === 'Upload New Character' && (
              <div>
                <SectionLabel>New Character Image</SectionLabel>
                {characterPreview ? (
                  <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a] w-40">
                    <img src={characterPreview} alt="Character" className="w-full h-40 object-cover rounded-lg" />
                    <button
                      onClick={() => handleCharacterUpload(null)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all w-40">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                      <Image size={20} className="text-[#666]" />
                    </div>
                    <p className="text-xs font-medium text-white">Upload photo</p>
                    <input type="file" accept="image/*" onChange={(e) => handleCharacterUpload(e.target.files?.[0])} className="hidden" />
                  </label>
                )}
              </div>
            )}

            {method === 'Describe Character' && (
              <div>
                <SectionLabel>Character Description</SectionLabel>
                <textarea
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  placeholder="Describe the new character (age, gender, appearance, style...)"
                  className="w-full h-24 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
                />
              </div>
            )}

            {method === 'Use Saved Character' && (
              <div>
                <SectionLabel>Saved Characters</SectionLabel>
                <select className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white">
                  <option>Select a saved character...</option>
                </select>
              </div>
            )}

            <div>
              <SectionLabel>Character Detection</SectionLabel>
              <StudioDropdown options={DETECTION_OPTIONS.map(o => ({ value: o, label: o.toUpperCase() }))} value={detection} onChange={setDetection} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreserveClothing(!preserveClothing)}
                  className={`w-12 h-6 rounded-full transition-all ${preserveClothing ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${preserveClothing ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-[#888]">Preserve clothing</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreserveExpression(!preserveExpression)}
                  className={`w-12 h-6 rounded-full transition-all ${preserveExpression ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${preserveExpression ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-[#888]">Preserve expression</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreservePose(!preservePose)}
                  className={`w-12 h-6 rounded-full transition-all ${preservePose ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${preservePose ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-[#888]">Preserve pose</span>
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Replace Character
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}