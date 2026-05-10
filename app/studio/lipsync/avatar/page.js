'use client';

import { useState } from 'react';
import { User, Plus, Trash2, Play, Edit } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import ModelSelector from '@/components/studio/ModelSelector';
import GenerateButton from '@/components/studio/GenerateButton';
import ResultsGrid from '@/components/studio/ResultsGrid';
import SectionLabel from '@/components/studio/SectionLabel';
import PillSelector from '@/components/studio/PillSelector';

const PERSONALITY_OPTIONS = ['Professional', 'Friendly', 'Energetic', 'Calm', 'Authoritative'];
const BACKGROUND_OPTIONS = ['Transparent', 'White', 'Office', 'Custom'];

export default function AvatarPage() {
  const [step, setStep] = useState(1);
  const [avatarImages, setAvatarImages] = useState([]);
  const [avatarName, setAvatarName] = useState('');
  const [personality, setPersonality] = useState('Professional');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [scriptText, setScriptText] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [voice, setVoice] = useState('voice-1');
  const [background, setBackground] = useState('Transparent');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [savedAvatars, setSavedAvatars] = useState([
    { id: '1', name: 'Sarah', images: 3, personality: 'Professional' },
    { id: '2', name: 'Mike', images: 4, personality: 'Friendly' },
  ]);

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(f => URL.createObjectURL(f));
    setAvatarImages([...avatarImages, ...newImages]);
  };

  const handleCreateAvatar = async () => {
    if (avatarImages.length < 3) {
      toast.error('Please upload at least 3 portrait photos');
      return;
    }
    if (!avatarName.trim()) {
      toast.error('Please name your avatar');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSavedAvatars([...savedAvatars, { id: Date.now().toString(), name: avatarName, images: avatarImages.length, personality }]);
    toast.success('Avatar created!');
    setStep(2);
    setSelectedAvatar(avatarName);
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!selectedAvatar) {
      toast.error('Please select an avatar');
      return;
    }
    if (!scriptText && !audioFile) {
      toast.error('Please enter text or upload audio');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setResults([{
        id: `demo-${Date.now()}`,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        prompt: scriptText || 'Avatar video',
        type: 'video'
      }]);
      toast.success('Avatar video generated!');
    } catch (error) {
      toast.error(error.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = (id) => {
    setSavedAvatars(savedAvatars.filter(a => a.id !== id));
    toast.success('Avatar deleted');
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero 
        title="TALKING AVATAR"
        subtitle="Build and save a persistent reusable talking avatar"
      />
      
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setStep(1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${step === 1 ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}
          >
            Create Avatar
          </button>
          <button
            onClick={() => setStep(2)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${step === 2 ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}
          >
            Use Avatar
          </button>
        </div>

        {step === 1 && (
          <GenerationPanel>
            <div className="space-y-6">
              <div>
                <SectionLabel>Step 1: Upload 3-5 Portrait Photos</SectionLabel>
                <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-6 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                    <Plus size={24} className="text-[#666]" />
                  </div>
                  <p className="text-sm font-medium text-white">Add photos</p>
                  <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e.target.files)} className="hidden" />
                </label>
                {avatarImages.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {avatarImages.map((img, i) => (
                      <div key={i} className="relative w-20 h-20">
                        <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                        <button onClick={() => setAvatarImages(avatarImages.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white text-xs">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <SectionLabel>Avatar Name</SectionLabel>
                <input
                  type="text"
                  value={avatarName}
                  onChange={(e) => setAvatarName(e.target.value)}
                  placeholder="e.g., Sarah, Mike, Emma..."
                  className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-[#444]"
                />
              </div>

              <div>
                <SectionLabel>Personality</SectionLabel>
                <PillSelector options={PERSONALITY_OPTIONS} value={personality} onChange={setPersonality} />
              </div>

              <GenerateButton onClick={handleCreateAvatar} loading={loading}>
                Create Avatar
              </GenerateButton>
            </div>
          </GenerationPanel>
        )}

        {step === 2 && (
          <GenerationPanel>
            <div className="space-y-6">
              <div>
                <SectionLabel>Select Saved Avatar</SectionLabel>
                <select
                  value={selectedAvatar}
                  onChange={(e) => setSelectedAvatar(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                >
                  <option value="">Select an avatar...</option>
                  {savedAvatars.map(avatar => (
                    <option key={avatar.id} value={avatar.name}>{avatar.name} ({avatar.personality})</option>
                  ))}
                </select>
              </div>

              <div>
                <SectionLabel>Content</SectionLabel>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setAudioFile(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!audioFile ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => { setScriptText(''); setAudioFile('audio'); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${audioFile ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}
                  >
                    Audio
                  </button>
                </div>
                {audioFile ? (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.12] p-4 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] transition-all">
                    <div className="w-8 h-8 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                      <User size={16} className="text-[#666]" />
                    </div>
                    <p className="text-xs font-medium text-white">Upload audio</p>
                    <input type="file" accept="audio/*" className="hidden" />
                  </label>
                ) : (
                  <textarea
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    placeholder="Type your script here..."
                    className="w-full h-32 bg-[#1A1A1A] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <SectionLabel>Voice</SectionLabel>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white"
                  >
                    <option value="voice-1">Voice 1 - Male</option>
                    <option value="voice-2">Voice 2 - Female</option>
                    <option value="voice-3">Voice 3 - Neutral</option>
                  </select>
                </div>
                <div>
                  <SectionLabel>Background</SectionLabel>
                  <PillSelector options={BACKGROUND_OPTIONS} value={background} onChange={setBackground} />
                </div>
              </div>

              <GenerateButton onClick={handleGenerate} loading={loading}>
                Generate Avatar Video
              </GenerateButton>
            </div>
          </GenerationPanel>
        )}

        {savedAvatars.length > 0 && (
          <div className="mt-8">
            <SectionLabel>My Avatars</SectionLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {savedAvatars.map(avatar => (
                <div key={avatar.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4">
                  <div className="w-16 h-16 bg-[#1a1a1a] rounded-full mx-auto mb-2 flex items-center justify-center">
                    <User size={24} className="text-[#666]" />
                  </div>
                  <p className="text-sm font-medium text-white text-center">{avatar.name}</p>
                  <p className="text-xs text-[#555] text-center">{avatar.personality}</p>
                  <div className="flex gap-2 mt-3 justify-center">
                    <button onClick={() => { setStep(2); setSelectedAvatar(avatar.name); }} className="p-1.5 rounded bg-[#7C3AED] text-white text-xs">Use</button>
                    <button onClick={() => handleDeleteAvatar(avatar.id)} className="p-1.5 rounded bg-[#1a1a1a] text-[#888] text-xs border border-white/[0.08]">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ResultsGrid results={results} columns={1} />
      </div>
    </div>
  );
}