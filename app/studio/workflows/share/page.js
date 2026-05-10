'use client';

import { useState } from 'react';
import { Share2, Globe, Lock, Eye } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StudioHero from '@/components/studio/StudioHero';

const VISIBILITY = ['Public', 'Unlisted', 'Private'];
const MY_PUBLISHED = [
  { id: 1, name: 'Instant Headshot Studio', visibility: 'Public', forks: 42, rating: 4.8 },
  { id: 2, name: 'Viral Reels Maker', visibility: 'Unlisted', forks: 18, rating: 4.7 },
];

export default function SharePage() {
  const [workflow, setWorkflow] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [published, setPublished] = useState(MY_PUBLISHED);

  const publish = () => {
    if (!workflow || !title) { toast.error('Fill in all fields'); return; }
    setPublished([...published, { id: Date.now(), name: title, visibility, forks: 0, rating: 0 }]);
    toast.success('Workflow published!');
    setTitle(''); setDesc('');
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <StudioHero icon={Share2} title="SHARE YOUR WORKFLOW" subtitle="Publish your workflow pipeline for others to use and fork" />
      <div className="max-w-[900px] mx-auto px-4">
        <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6 mb-8">
          <h3 className="text-white font-bold mb-4">Publish a Workflow</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Select Workflow</label>
              <select value={workflow} onChange={e => setWorkflow(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none">
                <option value="">Choose a workflow...</option>
                <option>Image to Cinematic Video</option>
                <option>Product Showcase Pipeline</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your workflow a name" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe what this workflow does..." className="w-full h-20 bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] resize-none focus:outline-none" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-2 block">Visibility</label>
              <div className="flex gap-3">
                {VISIBILITY.map(v => (
                  <button key={v} onClick={() => setVisibility(v)} className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${visibility === v ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>
                    {v === 'Public' && <Globe size={14} />}
                    {v === 'Unlisted' && <Eye size={14} />}
                    {v === 'Private' && <Lock size={14} />}
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={publish} className="mt-6 w-full px-6 py-3 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00] transition-all">Publish Workflow</button>
        </div>

        {published.length > 0 && (
          <div>
            <h3 className="text-white font-bold mb-4">My Published Workflows</h3>
            <div className="space-y-3">
              {published.map(wf => (
                <div key={wf.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">{wf.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-[#555]">{wf.forks} forks</span>
                      <span className="text-[10px] text-[#F59E0B]">★ {wf.rating}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#1a1a1a] text-[#555] rounded">{wf.visibility}</span>
                    </div>
                  </div>
                  <button onClick={() => toast.success('Link copied!')} className="px-4 py-2 bg-[#1a1a1a] text-[#888] text-xs rounded-lg hover:text-white transition-all">Copy Link</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}