'use client';

import { useState } from 'react';
import { FileText, Play, Download, Edit } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const OUTPUT_FORMATS = ['SRT', 'VTT', 'ASS', 'TXT', 'JSON'];
const MAX_CHARS = ['32', '42', '56'];
const TIMESTAMP_OPTIONS = ['Word-level', 'Sentence-level', 'Paragraph-level'];
const LANGUAGES = ['Auto-detect', 'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Portuguese', 'Italian', 'Russian', 'Arabic'];

export default function SubtitlesPage() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [language, setLanguage] = useState('Auto-detect');
  const [outputFormat, setOutputFormat] = useState('SRT');
  const [maxChars, setMaxChars] = useState('42');
  const [speakerId, setSpeakerId] = useState(false);
  const [timestamps, setTimestamps] = useState('Sentence-level');
  const [burnSubtitles, setBurnSubtitles] = useState(false);
  const [fontSize, setFontSize] = useState('24');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [position, setPosition] = useState('Bottom');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [editableText, setEditableText] = useState('');

  const handleFileUpload = (f) => {
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setFilePreview(url);
    } else {
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      toast.error('Please upload an audio or video file');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockSubtitles = `1
00:00:01,000 --> 00:00:04,500
This is the first line of your subtitles.

2
00:00:05,000 --> 00:00:08,200
Here's another line of text.

3
00:00:09,000 --> 00:00:12,500
And this is the third subtitle line.`;
      setEditableText(mockSubtitles);
      setResults([{
        id: `demo-${Date.now()}`,
        format: outputFormat,
        text: mockSubtitles,
        url: '#'
      }]);
      toast.success('Subtitles generated!');
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
        title="AUDIO TO SUBTITLES"
        subtitle="Auto-transcribe any audio or video to accurate subtitle text"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div>
              <SectionLabel>Upload Audio or Video</SectionLabel>
              {filePreview ? (
                <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                  <video src={filePreview} controls className="w-full h-32 object-contain rounded-lg" />
                  <button
                    onClick={() => handleFileUpload(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/[0.12] p-8 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                  <div className="w-14 h-14 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                    <FileText size={28} className="text-[#666]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Upload audio or video</p>
                    <p className="text-xs text-[#555] mt-1">MP3, WAV, MP4, MOV...</p>
                  </div>
                  <input type="file" accept="audio/*,video/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} className="hidden" />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Language</SectionLabel>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div>
                <SectionLabel>Output Format</SectionLabel>
                <PillSelector options={OUTPUT_FORMATS} value={outputFormat} onChange={setOutputFormat} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Max Chars Per Line</SectionLabel>
                <PillSelector options={MAX_CHARS} value={maxChars} onChange={setMaxChars} />
              </div>
              <div>
                <SectionLabel>Timestamps</SectionLabel>
                <PillSelector options={TIMESTAMP_OPTIONS} value={timestamps} onChange={setTimestamps} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSpeakerId(!speakerId)}
                className={`w-12 h-6 rounded-full transition-all ${speakerId ? 'bg-[#7C3AED]' : 'bg-[#1a1a1a]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${speakerId ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-[#888]">Speaker identification</span>
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

            {burnSubtitles && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <SectionLabel>Font Size</SectionLabel>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                  >
                    <option>18</option>
                    <option>24</option>
                    <option>32</option>
                    <option>48</option>
                  </select>
                </div>
                <div>
                  <SectionLabel>Font Color</SectionLabel>
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-full h-10 rounded-xl bg-[#1a1a1a] border border-white/[0.08]"
                  />
                </div>
                <div>
                  <SectionLabel>Position</SectionLabel>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                  >
                    <option>Top</option>
                    <option>Bottom</option>
                    <option>Center</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Generate Subtitles
          </GenerateButton>
        </div>

        {results.length > 0 && (
          <div className="mt-8 bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
            <div className="flex justify-between items-center mb-4">
              <SectionLabel>Editable Subtitle Text</SectionLabel>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-[#1a1a1a] text-white rounded-lg text-xs font-medium border border-white/[0.08]">Preview</button>
                <button className="px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg text-xs font-medium">Download</button>
              </div>
            </div>
            <textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="w-full h-64 bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 text-white font-mono text-sm resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}