'use client';

import { useState } from 'react';
import { Globe, Save } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import UploadZone from '@/components/studio/UploadZone';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';

const TIMES = ['Morning', 'Golden Hour', 'Midday', 'Afternoon', 'Dusk', 'Night'];
const WEATHERS = ['Clear', 'Cloudy', 'Rainy', 'Foggy', 'Stormy', 'Snow'];
const SETTINGS = ['Urban', 'Natural', 'Interior', 'Fantasy', 'Sci-Fi', 'Historical'];
const MOODS = ['Cinematic', 'Natural', 'Dramatic', 'Soft', 'High Contrast', 'Moody'];

export default function CreateWorldPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [refImage, setRefImage] = useState(null);
  const [refPreview, setRefPreview] = useState(null);
  const [time, setTime] = useState('Golden Hour');
  const [weather, setWeather] = useState('Clear');
  const [setting, setSetting] = useState('Urban');
  const [mood, setMood] = useState('Cinematic');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleRefUpload = (file) => { setRefImage(file); setRefPreview(URL.createObjectURL(file)); };

  const generatePreview = () => {
    if (!name.trim()) { toast.error('Enter a world name'); return; }
    setLoading(true);
    setTimeout(() => { setPreview('https://picsum.photos/seed/world/800/450'); setLoading(false); toast.success('Preview generated!'); }, 2500);
  };

  const saveWorld = () => { toast.success('World saved!'); };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Globe} title="CREATE A WORLD" subtitle="Save a scene, location, or environment as a reusable preset" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SectionLabel>World Name</SectionLabel>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sunset Beach, Cyberpunk Alley" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
              </div>
              <div>
                <SectionLabel>Reference Image (Optional)</SectionLabel>
                <UploadZone onFile={handleRefUpload} accept="image/*" label="Upload reference" preview={refPreview} icon={Globe} />
              </div>
            </div>
            <div>
              <SectionLabel>Description</SectionLabel>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this world in detail..." className="w-full h-20 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <SectionLabel>Time of Day</SectionLabel>
                <div className="space-y-1">
                  {TIMES.map(t => (
                    <button key={t} onClick={() => setTime(t)} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${time === t ? 'bg-[#7C3AED] text-white' : 'text-[#666] hover:bg-[#1a1a1a]'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Weather</SectionLabel>
                <div className="space-y-1">
                  {WEATHERS.map(w => (
                    <button key={w} onClick={() => setWeather(w)} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${weather === w ? 'bg-[#7C3AED] text-white' : 'text-[#666] hover:bg-[#1a1a1a]'}`}>{w}</button>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Setting Type</SectionLabel>
                <div className="space-y-1">
                  {SETTINGS.map(s => (
                    <button key={s} onClick={() => setSetting(s)} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${setting === s ? 'bg-[#7C3AED] text-white' : 'text-[#666] hover:bg-[#1a1a1a]'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Lighting Mood</SectionLabel>
                <div className="space-y-1">
                  {MOODS.map(m => (
                    <button key={m} onClick={() => setMood(m)} className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mood === m ? 'bg-[#7C3AED] text-white' : 'text-[#666] hover:bg-[#1a1a1a]'}`}>{m}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end gap-3">
          <button onClick={generatePreview} disabled={loading || !name.trim()} className="px-5 py-2.5 bg-[#1a1a1a] text-[#888] font-semibold rounded-xl hover:text-white disabled:opacity-50 transition-all">Generate Preview</button>
          <button onClick={saveWorld} className="px-5 py-2.5 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] transition-all flex items-center gap-2"><Save size={16} /> Save World</button>
        </div>
        {preview && (
          <div className="bg-[#111111] rounded-2xl border border-white/[0.08] overflow-hidden">
            <img src={preview} className="w-full aspect-video object-cover" alt="" />
            <div className="p-4 flex justify-end">
              <button onClick={saveWorld} className="px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] transition-all">Save to Library</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}