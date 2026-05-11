'use client';

import { useState } from 'react';
import { Upload, Video } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import StudioDropdown from '@/components/StudioDropdown';

const EDIT_MODES = ['Replace Content', 'Change Style', 'Remove Object', 'Add Object'];

export default function EditVideoPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [frameStart, setFrameStart] = useState(0);
  const [frameEnd, setFrameEnd] = useState(100);
  const [editPrompt, setEditPrompt] = useState('');
  const [editMode, setEditMode] = useState('Replace Content');
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

  const handleGenerate = async () => {
    if (!videoFile) {
      toast.error('Please upload a video to edit');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Video editing started!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: editPrompt,
          type: 'video'
        }]);
        toast.success('Demo: Video edited!');
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
        title="EDIT VIDEO"
        subtitle="Inpaint and regenerate specific regions of any video with AI"
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
                    <p className="text-sm font-medium text-white">Upload video to edit</p>
                    <p className="text-xs text-[#555] mt-1">Drag & drop or click to browse</p>
                  </div>
                  <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} className="hidden" />
                </label>
              )}
            </div>

            {videoPreview && (
              <div>
                <SectionLabel>Frame Range</SectionLabel>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-[#555]">Start</label>
                    <input
                      type="number"
                      value={frameStart}
                      onChange={(e) => setFrameStart(parseInt(e.target.value))}
                      className="w-full mt-1 bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-[#555]">End</label>
                    <input
                      type="number"
                      value={frameEnd}
                      onChange={(e) => setFrameEnd(parseInt(e.target.value))}
                      className="w-full mt-1 bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <SectionLabel>Edit Prompt</SectionLabel>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Describe what to put in the selected region..."
                className="w-full h-24 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <SectionLabel>Edit Mode</SectionLabel>
              <StudioDropdown options={EDIT_MODES} value={editMode} onChange={setEditMode} />
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/[0.08]">
              <SectionLabel>Canvas Mask</SectionLabel>
              <div className="h-32 bg-[#0a0a0a] rounded-lg flex items-center justify-center">
                <p className="text-xs text-[#555]">Draw mask on video area to edit</p>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 bg-[#6366f1] text-white rounded-lg text-xs font-medium">Brush</button>
                <button className="px-3 py-1.5 bg-[#1a1a1a] text-[#888] rounded-lg text-xs font-medium border border-white/[0.08]">Eraser</button>
                <button className="px-3 py-1.5 bg-[#1a1a1a] text-[#888] rounded-lg text-xs font-medium border border-white/[0.08]">Clear</button>
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Apply Edit
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}