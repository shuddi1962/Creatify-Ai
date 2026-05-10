'use client';

import { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';
import GenerationPanel from '@/components/studio/GenerationPanel';
import SectionLabel from '@/components/studio/SectionLabel';
import GenerateButton from '@/components/studio/GenerateButton';
import UploadZone from '@/components/studio/UploadZone';

const SAMPLE_CHARACTERS = [
  { id: 1, name: 'Sarah', avatar: 'https://picsum.photos/seed/s1/100' },
  { id: 2, name: 'The Explorer', avatar: 'https://picsum.photos/seed/s2/100' },
  { id: 3, name: 'Mia', avatar: 'https://picsum.photos/seed/s3/100' },
  { id: 4, name: 'Cyber Cop', avatar: 'https://picsum.photos/seed/s4/100' },
];
const POSITIONS = ['Left', 'Center', 'Right'];
const SIZES = ['Small', 'Medium', 'Large'];

export default function MultiCharacterPage() {
  const [scenePrompt, setScenePrompt] = useState('');
  const [characters, setCharacters] = useState([
    { id: 1, charId: null, position: 'Left', size: 'Medium' },
    { id: 2, charId: null, position: 'Right', size: 'Medium' },
  ]);
  const [bgType, setBgType] = useState('prompt');
  const [bgPrompt, setBgPrompt] = useState('');
  const [bgImage, setBgImage] = useState(null);
  const [bgPreview, setBgImagePreview] = useState(null);
  const [interaction, setInteraction] = useState('');
  const [loading, setLoading] = useState(false);

  const updateChar = (id, field, value) => setCharacters(characters.map(c => c.id === id ? { ...c, [field]: value } : c));
  const addChar = () => { if (characters.length < 4) setCharacters([...characters, { id: Date.now(), charId: null, position: 'Center', size: 'Medium' }]); };
  const removeChar = (id) => { if (characters.length > 1) setCharacters(characters.filter(c => c.id !== id)); };

  const handleBgUpload = (file) => { setBgImage(file); setBgImagePreview(URL.createObjectURL(file)); };

  const generate = () => {
    if (characters.every(c => !c.charId)) { toast.error('Select at least one character'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Scene generated!'); }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Users} badge="NEW" title="MULTI-CHARACTER SCENE" subtitle="Place multiple different characters together in one scene" />
      <div className="max-w-[900px] mx-auto px-4 space-y-6">
        <GenerationPanel>
          <div className="space-y-5">
            <div>
              <SectionLabel>Scene Prompt</SectionLabel>
              <textarea value={scenePrompt} onChange={e => setScenePrompt(e.target.value)} placeholder="e.g. Two friends having coffee at a trendy cafe, warm sunlight, cinematic lighting" className="w-full h-20 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]" />
            </div>

            <div>
              <SectionLabel>Characters (up to 4)</SectionLabel>
              <div className="space-y-3">
                {characters.map((char, idx) => (
                  <div key={char.id} className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-4 flex items-center gap-3">
                    <span className="text-[10px] text-[#444] font-bold w-6">#{idx + 1}</span>
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      <div>
                        <label className="text-[9px] text-[#444] uppercase">Character</label>
                        <select onChange={e => updateChar(char.id, 'charId', e.target.value || null)} value={char.charId || ''} className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none mt-1">
                          <option value="">Select...</option>
                          {SAMPLE_CHARACTERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-[#444] uppercase">Position</label>
                        <select onChange={e => updateChar(char.id, 'position', e.target.value)} value={char.position} className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none mt-1">
                          {POSITIONS.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-[#444] uppercase">Size</label>
                        <select onChange={e => updateChar(char.id, 'size', e.target.value)} value={char.size} className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none mt-1">
                          {SIZES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    {characters.length > 1 && <button onClick={() => removeChar(char.id)} className="p-1 text-[#444] hover:text-red-500 transition-all"><X size={14} /></button>}
                  </div>
                ))}
              </div>
              {characters.length < 4 && (
                <button onClick={addChar} className="w-full mt-2 px-4 py-2 border-2 border-dashed border-white/[0.08] rounded-xl text-[#444] text-sm hover:text-[#CCFF00] hover:border-[#CCFF00]/50 transition-all flex items-center justify-center gap-2"><Plus size={14} /> Add Another Character</button>
              )}
            </div>

            <div>
              <SectionLabel>Background</SectionLabel>
              <div className="flex gap-2 mb-3">
                {['prompt', 'upload', 'worlds'].map(t => (
                  <button key={t} onClick={() => setBgType(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${bgType === t ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
              </div>
              {bgType === 'prompt' && <textarea value={bgPrompt} onChange={e => setBgPrompt(e.target.value)} placeholder="Describe the background scene..." className="w-full h-20 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none" />}
              {bgType === 'upload' && <UploadZone onFile={handleBgUpload} accept="image/*" label="Upload background image" preview={bgPreview} icon={Upload} />}
              {bgType === 'worlds' && <select className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-[#888] focus:outline-none"><option>Select a saved world...</option><option>Sunset Beach</option><option>City Rooftop</option></select>}
            </div>

            <div>
              <SectionLabel>Interaction Prompt</SectionLabel>
              <textarea value={interaction} onChange={e => setInteraction(e.target.value)} placeholder="e.g. Characters are laughing, making eye contact, leaning toward each other" className="w-full h-20 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 text-white placeholder-[#444] resize-none focus:outline-none focus:border-[#7C3AED]" />
            </div>
          </div>
        </GenerationPanel>
        <div className="flex justify-end">
          <GenerateButton onClick={generate} loading={loading}>Generate Scene</GenerateButton>
        </div>
      </div>
    </div>
  );
}