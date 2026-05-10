'use client';

import { useState } from 'react';
import { Video, Languages, Subtitles } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic', 'Russian'];
const VOICE_STYLES = ['Match Original', 'Professional', 'Casual', 'Energetic'];
const LIP_SYNC_OPTIONS = ['None', 'Basic', 'Full Lipsync'];

export default function DubbingPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('Auto-detect');
  const [targetLanguages, setTargetLanguages] = useState(['Spanish']);
  const [voiceStyle, setVoiceStyle] = useState('Match Original');
  const [lipSync, setLipSync] = useState('Full Lipsync');
  const [generateSubtitles, setGenerateSubtitles] = useState(true);
  const [burnSubtitles, setBurnSubtitles] = useState(false);
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

  const toggleLanguage = (lang) => {
    if (targetLanguages.includes(lang)) {
      setTargetLanguages(targetLanguages.filter(l => l !== lang));
    } else {
      setTargetLanguages([...targetLanguages, lang]);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video to dub');
      return;
    }
    if (targetLanguages.length === 0) {
      toast.error('Please select at least one target language');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      setResults(targetLanguages.map(lang => ({
        id: `demo-${Date.now()}-${lang}`,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        prompt: `Dubbed to ${lang}`,
        type: 'video'
      })));
      toast.success(`Demo: Video dubbed to ${targetLanguages.join(', ')}!`);
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
        title="MULTI-LANGUAGE DUBBING"
        subtitle="Dub any video into any language with AI voice and lip sync"
        badge="NEW"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Video</SectionLabel>
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
                    <p className="text-sm font-medium text-white">Upload video to dub</p>
                    <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <SectionLabel>Source Language</SectionLabel>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
              >
                <option>Auto-detect</option>
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <SectionLabel>Target Languages (select multiple)</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      targetLanguages.includes(lang)
                        ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                        : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08] hover:bg-[#222]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              {targetLanguages.length > 0 && (
                <p className="text-xs text-[#555] mt-2">Selected: {targetLanguages.join(', ')}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Voice Style</SectionLabel>
                <PillSelector options={VOICE_STYLES} value={voiceStyle} onChange={setVoiceStyle} />
              </div>
              <div>
                <SectionLabel>Lip Sync</SectionLabel>
                <PillSelector options={LIP_SYNC_OPTIONS} value={lipSync} onChange={setLipSync} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGenerateSubtitles(!generateSubtitles)}
                  className={`w-12 h-6 rounded-full transition-all ${generateSubtitles ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${generateSubtitles ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-[#888]">Generate subtitles</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBurnSubtitles(!burnSubtitles)}
                  className={`w-12 h-6 rounded-full transition-all ${burnSubtitles ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${burnSubtitles ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-[#888]">Burn subtitles into video</span>
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading} disabled={targetLanguages.length === 0}>
            Start Dubbing ({targetLanguages.length} languages)
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}