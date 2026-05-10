'use client';

import { useState } from 'react';
import { Image, Mic, Circle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const FACE_DETECTION = ['Auto', 'Manual crop'];
const HEAD_MOVEMENT = ['Static', 'Natural Head Bob', 'Expressive'];
const EYE_BLINK = ['Natural', 'None', 'Intense'];
const OUTPUT_QUALITY = ['720p', '1080p'];

export default function PortraitPage() {
  const [portraitFile, setPortraitFile] = useState(null);
  const [portraitPreview, setPortraitPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [faceDetection, setFaceDetection] = useState('Auto');
  const [headMovement, setHeadMovement] = useState('Natural Head Bob');
  const [eyeBlink, setEyeBlink] = useState('Natural');
  const [model, setModel] = useState('infinite-talk');
  const [outputQuality, setOutputQuality] = useState('1080p');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handlePortraitUpload = (file) => {
    if (file) {
      setPortraitFile(file);
      setPortraitPreview(URL.createObjectURL(file));
    } else {
      setPortraitFile(null);
      setPortraitPreview(null);
    }
  };

  const handleAudioUpload = (file) => {
    if (file) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
    } else {
      setAudioFile(null);
      setAudioPreview(null);
    }
  };

  const handleGenerate = async () => {
    if (!portraitFile || !audioFile) {
      toast.error('Please upload both portrait and audio');
      return;
    }

    setLoading(true);
    try {
      const apiKey = localStorage.getItem('muapi_key');
      if (apiKey) {
        toast.success('Animating portrait!');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        setResults([{
          id: `demo-${Date.now()}`,
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          prompt: 'Talking portrait',
          type: 'video'
        }]);
        toast.success('Demo: Portrait animated!');
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
        title="LIP SYNC"
        subtitle="Animate any portrait photo with any audio file instantly"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <GenerationPanel>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Portrait Photo</SectionLabel>
                {portraitPreview ? (
                  <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a]">
                    <img src={portraitPreview} alt="Portrait" className="w-full h-40 object-cover rounded-lg" />
                    <button
                      onClick={() => handlePortraitUpload(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                      <Image size={20} className="text-[#666]" />
                    </div>
                    <p className="text-xs font-medium text-white">Upload portrait</p>
                    <input type="file" accept="image/*" onChange={(e) => handlePortraitUpload(e.target.files?.[0])} className="hidden" />
                  </label>
                )}
              </div>
              <div>
                <SectionLabel>Audio File</SectionLabel>
                {audioPreview || audioFile ? (
                  <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] p-2 bg-[#0a0a0a] h-40 flex items-center justify-center">
                    <div className="text-center">
                      <Mic size={24} className="text-[#666] mx-auto mb-2" />
                      <p className="text-xs text-white">{audioFile?.name || 'Audio loaded'}</p>
                      <button
                        onClick={() => handleAudioUpload(null)}
                        className="mt-2 px-2 py-1 bg-black/60 rounded text-xs text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <label className="flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-4 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                      <div className="w-8 h-8 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                        <Mic size={16} className="text-[#666]" />
                      </div>
                      <p className="text-xs font-medium text-white">Upload audio</p>
                      <input type="file" accept="audio/*" onChange={(e) => handleAudioUpload(e.target.files?.[0])} className="hidden" />
                    </label>
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-4 transition-all ${isRecording ? 'bg-red-500/20 border-red-500' : 'bg-[#0a0a0a] hover:bg-[#111]'}`}
                    >
                      <Circle size={16} className={`${isRecording ? 'text-red-500 animate-pulse' : 'text-[#666]'}`} />
                      <p className="text-xs font-medium text-white">{isRecording ? 'Recording...' : 'Record'}</p>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SectionLabel>Face Detection</SectionLabel>
                <PillSelector options={FACE_DETECTION} value={faceDetection} onChange={setFaceDetection} />
              </div>
              <div>
                <SectionLabel>Head Movement</SectionLabel>
                <PillSelector options={HEAD_MOVEMENT} value={headMovement} onChange={setHeadMovement} />
              </div>
              <div>
                <SectionLabel>Eye Blink</SectionLabel>
                <PillSelector options={EYE_BLINK} value={eyeBlink} onChange={setEyeBlink} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>Model</SectionLabel>
                <ModelSelector type="lipsync" value={model} onChange={setModel} />
              </div>
              <div>
                <SectionLabel>Output Quality</SectionLabel>
                <PillSelector options={OUTPUT_QUALITY} value={outputQuality} onChange={setOutputQuality} />
              </div>
            </div>
          </div>
        </GenerationPanel>

        <div className="mt-6 flex justify-end">
          <GenerateButton onClick={handleGenerate} loading={loading}>
            Animate Portrait
          </GenerateButton>
        </div>

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}