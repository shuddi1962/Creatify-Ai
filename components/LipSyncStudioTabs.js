'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LIPSYNC_TABS = [
  { id: 'portrait', label: 'Portrait + Audio', desc: 'Animate any portrait photo with any audio file instantly', icon: '👤' },
  { id: 'video', label: 'Video + Audio', desc: 'Sync lips perfectly on any existing video with new audio', icon: '🎬' },
  { id: 'bulk', label: 'Bulk Lip Sync', desc: 'One character combined with 100 audio files = 100 videos', icon: '📚' },
  { id: 'avatar', label: 'Talking Avatar', desc: 'Build and save a persistent reusable talking avatar', icon: '🎭' },
  { id: 'dubbing', label: 'Multi-language Dub', desc: 'Dub any video into any language with AI voice sync', icon: '🌍' },
];

const MODELS = [
  { id: 'infinite-talk', name: 'Infinite Talk', provider: 'Creatify', badge: 'TOP' },
  { id: 'ltx-23', name: 'LTX 2.3 Lipsync', provider: 'Lightricks' },
  { id: 'ltx-19b', name: 'LTX 2 19B', provider: 'Lightricks' },
  { id: 'wan-22', name: 'Wan 2.2 Speech', provider: 'Swarma' },
  { id: 'sync-lipsync', name: 'Sync Lipsync', provider: 'Open Source' },
  { id: 'latentsync', name: 'LatentSync', provider: 'Open Source' },
  { id: 'veed', name: 'Veed Lipsync', provider: 'Veed' },
];

const AVATARS = [
  { id: 'avatar1', name: 'Sarah', gender: 'Female', style: 'Professional' },
  { id: 'avatar2', name: 'James', gender: 'Male', style: 'Casual' },
  { id: 'avatar3', name: 'Maria', gender: 'Female', style: 'News Anchor' },
  { id: 'avatar4', name: 'David', gender: 'Male', style: 'Tech' },
];

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Korean', 'Chinese', 'Hindi', 'Arabic', 'Russian'];

export default function LipSyncStudioTabs({ initialTab, apiKey, droppedFiles, onFilesHandled }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'portrait');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [generating, setGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('Spanish');

  const router = useRouter();

  const handleGenerate = () => {
    if (!uploadedImage && !uploadedVideo && !uploadedAudio) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedVideos([
        { id: 1, thumbnail: 'https://picsum.photos/320/180?random=20', duration: '15s' },
        { id: 2, thumbnail: 'https://picsum.photos/320/180?random=21', duration: '15s' },
      ]);
    }, 3500);
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (type === 'image') setUploadedImage(ev.target.result);
        else if (type === 'video') setUploadedVideo(ev.target.result);
        else setUploadedAudio(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPortrait = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Portrait Image</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-[#EC4899]/50 transition-colors cursor-pointer" onClick={() => document.getElementById('portrait-img')?.click()}>
            {uploadedImage ? (
              <div className="relative">
                <img src={uploadedImage} alt="Portrait" className="max-h-48 mx-auto rounded-lg" />
                <button onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }} className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white">✕</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span className="text-[#9CA3AF] text-sm">Upload portrait photo</span>
              </div>
            )}
            <input type="file" id="portrait-img" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Audio File</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-[#EC4899]/50 transition-colors cursor-pointer" onClick={() => document.getElementById('portrait-audio')?.click()}>
            {uploadedAudio ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EC4899]/20 flex items-center justify-center">🎵</div>
                <span className="text-white text-sm">audio.mp3</span>
                <button onClick={(e) => { e.stopPropagation(); setUploadedAudio(null); }} className="text-red-400">✕</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                <span className="text-[#9CA3AF] text-sm">Upload audio (MP3/WAV)</span>
              </div>
            )}
            <input type="file" id="portrait-audio" className="hidden" accept="audio/*" onChange={(e) => handleFileUpload(e, 'audio')} />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Model</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {MODELS.map((m) => (
            <button key={m.id} onClick={() => setSelectedModel(m.id)} className={`p-3 rounded-lg border text-left transition-all ${selectedModel === m.id ? 'bg-[#EC4899]/20 border-[#EC4899]/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <div className="text-sm font-medium text-white">{m.name}</div>
              <div className="text-[10px] text-[#9CA3AF]">{m.provider}</div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleGenerate} disabled={!uploadedImage || !uploadedAudio || generating} className="px-8 py-3 rounded-xl bg-[#EC4899] text-white font-bold hover:bg-[#DB2777] disabled:opacity-50 transition-all">
        {generating ? 'Generating...' : 'Generate Lip Sync'}
      </button>
    </div>
  );

  const renderVideo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Source Video</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
            {uploadedVideo ? (
              <div className="relative">
                <video src={uploadedVideo} className="max-h-48 mx-auto rounded-lg" />
                <button onClick={() => setUploadedVideo(null)} className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white">✕</button>
              </div>
            ) : (
              <span className="text-[#9CA3AF]">Upload video to lip sync</span>
            )}
            <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">New Audio</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
            {uploadedAudio ? <span className="text-white">audio.mp3</span> : <span className="text-[#9CA3AF]">Upload new audio</span>}
          </div>
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#EC4899] text-white font-bold hover:bg-[#DB2777] transition-all">
        Sync Lips to Video
      </button>
    </div>
  );

  const renderBulk = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Upload character image</span>
        </div>
        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
          <span className="text-[#9CA3AF]">Upload CSV with audio URLs</span>
        </div>
      </div>
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-sm font-medium text-white mb-2">CSV Format</h4>
        <code className="text-xs text-[#9CA3AF]">audio_url, script<br/>https://..., Hello world<br/>https://..., Another line</code>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#EC4899] text-white font-bold hover:bg-[#DB2777] transition-all">
        Start Bulk Lip Sync
      </button>
    </div>
  );

  const renderAvatar = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Select or Create Avatar</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {AVATARS.map((avatar) => (
            <button key={avatar.id} onClick={() => setSelectedAvatar(avatar.id)} className={`p-4 rounded-xl border text-center transition-all ${selectedAvatar === avatar.id ? 'bg-[#EC4899]/20 border-[#EC4899]/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EC4899]/30 to-[#EC4899]/10 mx-auto mb-2 flex items-center justify-center text-2xl">👤</div>
              <div className="text-sm font-medium text-white">{avatar.name}</div>
              <div className="text-[10px] text-[#9CA3AF]">{avatar.gender} • {avatar.style}</div>
            </button>
          ))}
          <button className="p-4 rounded-xl border border-dashed border-white/20 text-[#9CA3AF] hover:text-white hover:border-[#EC4899]/50">
            <div className="text-2xl mb-2">+</div>
            <div className="text-sm">Create New</div>
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Script</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter script for your avatar..." rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#EC4899]" />
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#EC4899] text-white font-bold hover:bg-[#DB2777] transition-all">
        Generate Avatar Video
      </button>
    </div>
  );

  const renderDubbing = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
        <span className="text-[#9CA3AF]">Upload video to dub</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Source Language</label>
          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">Auto Detect</div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Target Language</label>
          <div className="grid grid-cols-4 gap-2">
            {LANGUAGES.slice(0, 8).map((lang) => (
              <button key={lang} onClick={() => setTargetLanguage(lang)} className={`py-2 rounded-lg text-xs ${targetLanguage === lang ? 'bg-[#EC4899]/20 text-white border border-[#EC4899]/50' : 'bg-white/5 text-[#9CA3AF] border border-white/10'}`}>{lang}</button>
            ))}
          </div>
        </div>
      </div>
      <button className="px-8 py-3 rounded-xl bg-[#EC4899] text-white font-bold hover:bg-[#DB2777] transition-all">
        Generate Dub
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'portrait': return renderPortrait();
      case 'video': return renderVideo();
      case 'bulk': return renderBulk();
      case 'avatar': return renderAvatar();
      case 'dubbing': return renderDubbing();
      default: return renderPortrait();
    }
  };

  return (
    <div className="min-h-full bg-[#0A0F1E] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Lip Sync Studio</h1>
        <p className="text-[#9CA3AF]">Animate faces with audio — talking avatars, dubbing, and lip-sync videos</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {LIPSYNC_TABS.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); router.push(`/studio/lipsync/${tab.id}`); }} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#EC4899] text-white' : 'bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
        {renderContent()}
      </div>
    </div>
  );
}