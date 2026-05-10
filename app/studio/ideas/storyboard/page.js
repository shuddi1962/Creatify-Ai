'use client';

import { useState } from 'react';
import { Layout, ChevronRight, ChevronLeft, Play, Save } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

export default function StoryboardPage() {
  const [step, setStep] = useState(1);
  const [script, setScript] = useState('');
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateStoryboard = () => {
    if (!script.trim()) { toast.error('Enter or paste a script'); return; }
    setLoading(true);
    setTimeout(() => {
      setScenes([
        { id: 1, scene: 'Opening shot - establishing the setting', duration: '3s', camera: 'Wide angle', action: 'Subject walks into frame', visuals: 'Morning light through window' },
        { id: 2, scene: 'Hook moment - direct to camera', duration: '5s', camera: 'Medium close-up', action: 'Eye contact, confident tone', visuals: 'Neutral background, clean lighting' },
        { id: 3, scene: 'Main content - demonstration', duration: '20s', camera: 'POV / over shoulder', action: 'Hands showing the process', visuals: 'Product/material in focus' },
        { id: 4, scene: 'Key insight callout', duration: '4s', camera: 'Close-up', action: 'Pointing at visual element', visuals: 'Text overlay on screen' },
        { id: 5, scene: 'CTA and outro', duration: '8s', camera: 'Medium shot', action: 'Clear call to action, friendly tone', visuals: 'Subscribe button visible' },
      ]);
      setLoading(false);
      toast.success('Storyboard generated!');
    }, 3000);
  };

  const updateScene = (id, field, value) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSendToBulk = () => toast.success('Sent to bulk video generator!');

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Layout} badge="NEW" title="STORYBOARD PIPELINE" subtitle="Script to storyboard to bulk video generation in one click" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-[#CCFF00] text-black' : 'bg-[#1a1a1a] text-[#444]'}`}>{s}</div>
              <span className={`text-xs font-semibold ${step >= s ? 'text-white' : 'text-[#444]'}`}>
                {s === 1 ? 'Script' : s === 2 ? 'Storyboard' : 'Generate'}
              </span>
              {s < 3 && <ChevronRight size={14} className="text-[#444]" />}
            </div>
          ))}
        </div>

        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6">
          {step === 1 && (
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Step 1: Enter Your Script</h3>
              <textarea value={script} onChange={e => setScript(e.target.value)} placeholder="Paste your script here or generate one using the Script Generator..." className="w-full h-64 bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]" />
              <div className="mt-4 flex gap-3">
                <button onClick={() => toast.success('Loading saved scripts...')} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm rounded-lg hover:text-white transition-all">Use Saved Script</button>
                <button onClick={() => { setStep(2); handleGenerateStoryboard(); }} disabled={!script.trim()} className="ml-auto px-6 py-2.5 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 transition-all flex items-center gap-2">
                  Generate Storyboard <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Step 2: Edit Your Storyboard</h3>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#333] border-t-[#CCFF00] rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {scenes.map((scene, idx) => (
                    <div key={scene.id} className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 bg-[#7C3AED] text-white text-xs font-bold rounded-full flex items-center justify-center">{idx + 1}</span>
                        <span className="text-white font-semibold text-sm">Scene {idx + 1}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[10px] text-[#444] uppercase">Scene</label>
                          <input value={scene.scene} onChange={e => updateScene(scene.id, 'scene', e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none mt-1" />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#444] uppercase">Duration</label>
                          <input value={scene.duration} onChange={e => updateScene(scene.id, 'duration', e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none mt-1" />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#444] uppercase">Camera</label>
                          <input value={scene.camera} onChange={e => updateScene(scene.id, 'camera', e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none mt-1" />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#444] uppercase">Action</label>
                          <input value={scene.action} onChange={e => updateScene(scene.id, 'action', e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none mt-1" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="text-[10px] text-[#444] uppercase">Visuals</label>
                        <input value={scene.visuals} onChange={e => updateScene(scene.id, 'visuals', e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex justify-between">
                <button onClick={() => setStep(1)} className="px-4 py-2.5 bg-[#1a1a1a] text-[#888] rounded-xl hover:text-white flex items-center gap-2"><ChevronLeft size={16} /> Back</button>
                <button onClick={() => setStep(3)} disabled={scenes.length === 0} className="px-6 py-2.5 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] disabled:opacity-50 transition-all">Proceed to Generate</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Step 3: Generate All Videos</h3>
              <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-6 text-center">
                <Play size={40} className="text-[#CCFF00] mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">{scenes.length} scenes ready to generate</p>
                <p className="text-[#666] text-sm mb-6">All scenes will be generated in parallel using your selected model</p>
                <button onClick={handleSendToBulk} className="px-8 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] transition-all">Send All Scenes to Bulk Video Generator</button>
              </div>
              <div className="mt-4 flex justify-between">
                <button onClick={() => setStep(2)} className="px-4 py-2.5 bg-[#1a1a1a] text-[#888] rounded-xl hover:text-white flex items-center gap-2"><ChevronLeft size={16} /> Edit Storyboard</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}