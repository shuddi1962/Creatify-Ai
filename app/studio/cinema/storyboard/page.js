'use client';

import { useState } from 'react';
import { Layout, Plus, FileText, Save, Download, Share2, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const SHOT_TYPES = ['Establishing', 'Wide', 'Medium', 'Close-Up', 'Extreme Close-Up', 'Two-Shot', 'Over-the-Shoulder', 'POV', 'Dutch Angle', 'Bird\'s Eye', 'Low Angle'];

export default function CinemaStoryboardPage() {
  const [scenes, setScenes] = useState([
    { id: 1, number: 1, thumbnail: null, shotType: 'Establishing', notes: 'Opening shot of the city skyline at dawn', duration: 5, status: 'done' },
    { id: 2, number: 2, thumbnail: null, shotType: 'Medium', notes: 'Main character walking through a crowded street', duration: 8, status: 'done' },
    { id: 3, number: 3, thumbnail: null, shotType: 'Close-Up', notes: 'Character finds the mysterious package', duration: 4, status: 'pending' },
  ]);
  const [totalDuration, setTotalDuration] = useState(17);

  const addScene = () => {
    const newScene = {
      id: Date.now(),
      number: scenes.length + 1,
      thumbnail: null,
      shotType: 'Medium',
      notes: '',
      duration: 5,
      status: 'pending',
    };
    setScenes([...scenes, newScene]);
    setTotalDuration(prev => prev + 5);
  };

  const updateScene = (id, field, value) => {
    setScenes(scenes => scenes.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, [field]: value };
      if (field === 'duration') {
        setTotalDuration(scenes.reduce((sum, sc) => sum + (sc.id === id ? parseInt(value) : sc.duration), 0));
      }
      return updated;
    }));
  };

  const deleteScene = (id) => {
    const remaining = scenes.filter(s => s.id !== id);
    setScenes(remaining.map((s, i) => ({ ...s, number: i + 1 })));
    setTotalDuration(remaining.reduce((sum, s) => sum + s.duration, 0));
  };

  const generateThumbnail = async (id) => {
    toast.success('Generating thumbnail...');
    await new Promise(r => setTimeout(r, 2000));
    setScenes(scenes => scenes.map(s => s.id === id ? { ...s, thumbnail: `https://picsum.photos/seed/scene${id}/320/180` } : s));
    toast.success('Thumbnail generated!');
  };

  const handleSave = () => toast.success('Storyboard saved');
  const handleExportPDF = () => toast.success('Exporting as PDF...');
  const handleExportImages = () => toast.success('Exporting images...');
  const handleSendToBulk = () => toast.success('Sent to Bulk Video Generator');

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <StudioHero icon={Layout} title="STORYBOARD BUILDER" subtitle="Plan and visualize your scenes before generating any video" />
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button onClick={addScene} className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl hover:bg-[#6D28D9] transition-all">
              <Plus size={16} /> New Scene
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm font-medium rounded-xl border border-white/[0.08] hover:bg-[#222] transition-all">
              <FileText size={16} /> Import Script
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#666]">Total: <span className="text-white font-semibold">{totalDuration}s</span></span>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm font-medium rounded-xl border border-white/[0.08] hover:bg-[#222] transition-all">
              <Save size={16} /> Save
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm font-medium rounded-xl border border-white/[0.08] hover:bg-[#222] transition-all">
              <Download size={16} /> Export PDF
            </button>
            <button onClick={handleExportImages} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-[#888] text-sm font-medium rounded-xl border border-white/[0.08] hover:bg-[#222] transition-all">
              <Download size={16} /> Export Images
            </button>
            <button onClick={handleSendToBulk} className="flex items-center gap-2 px-4 py-2 bg-[#CCFF00] text-black text-sm font-bold rounded-xl hover:bg-[#B8FF00] transition-all">
              <Share2 size={16} /> Send to Bulk Video
            </button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
          {scenes.map(scene => (
            <div key={scene.id} className="flex-shrink-0 w-64 bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="flex items-center gap-2 p-3 border-b border-white/[0.08]">
                <div className="w-6 h-6 bg-[#7C3AED] rounded-lg flex items-center justify-center text-xs font-bold text-white">{scene.number}</div>
                <div className="flex-1" />
                <GripVertical size={14} className="text-[#444] cursor-grab" />
              </div>
              <div className="relative">
                {scene.thumbnail ? (
                  <img src={scene.thumbnail} alt="" className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-xs text-[#444]">No thumbnail</span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button onClick={() => generateThumbnail(scene.id)} className="px-2 py-1 bg-black/60 rounded text-[10px] text-white hover:bg-black/80 transition-all">Generate</button>
                </div>
              </div>
              <div className="p-3 space-y-3">
                <div>
                  <label className="text-[10px] text-[#444] uppercase tracking-widest">Shot Type</label>
                  <select
                    value={scene.shotType}
                    onChange={e => updateScene(scene.id, 'shotType', e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white mt-1"
                  >
                    {SHOT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#444] uppercase tracking-widest">Scene Notes</label>
                  <textarea
                    value={scene.notes}
                    onChange={e => updateScene(scene.id, 'notes', e.target.value)}
                    placeholder="Describe this scene..."
                    className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white placeholder-[#444] resize-none h-16 mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-[#444] uppercase tracking-widest">Duration (s)</label>
                    <input
                      type="number"
                      value={scene.duration}
                      onChange={e => updateScene(scene.id, 'duration', e.target.value)}
                      min={1}
                      max={60}
                      className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white mt-1"
                    />
                  </div>
                  <button onClick={() => deleteScene(scene.id)} className="mt-4 p-2 rounded-lg hover:bg-red-500/20 text-[#888] hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addScene} className="flex-shrink-0 w-64 h-[340px] border-2 border-dashed border-white/[0.08] rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#7C3AED]/50 transition-all">
            <Plus size={24} className="text-[#444]" />
            <span className="text-xs text-[#444]">Add Scene</span>
          </button>
        </div>
      </div>
    </div>
  );
}