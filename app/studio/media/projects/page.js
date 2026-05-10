'use client';

import { useState } from 'react';
import { FolderOpen, Plus, MoreHorizontal } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const PROJECTS = [
  { id: 1, name: 'Product Campaign', count: 24, preview: ['https://picsum.photos/seed/p1/100/100', 'https://picsum.photos/seed/p2/100/100', 'https://picsum.photos/seed/p3/100/100'], updated: '2 hours ago' },
  { id: 2, name: 'Social Media Pack', count: 18, preview: ['https://picsum.photos/seed/s1/100/100', 'https://picsum.photos/seed/s2/100/100'], updated: '1 day ago' },
  { id: 3, name: 'Brand Assets', count: 12, preview: ['https://picsum.photos/seed/b1/100/100'], updated: '3 days ago' },
  { id: 4, name: 'Client Work', count: 36, preview: ['https://picsum.photos/seed/c1/100/100', 'https://picsum.photos/seed/c2/100/100', 'https://picsum.photos/seed/c3/100/100', 'https://picsum.photos/seed/c4/100/100'], updated: '1 week ago' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(PROJECTS);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');

  const createProject = () => {
    if (!newName.trim()) { toast.error('Enter a project name'); return; }
    setProjects([{ id: Date.now(), name: newName, count: 0, preview: [], updated: 'Just now' }, ...projects]);
    setNewName('');
    setShowNew(false);
    toast.success('Project created!');
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-bold text-2xl">My Projects</h1>
            <p className="text-[#666] text-sm mt-1">Organize your creations into named project folders</p>
          </div>
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-black font-bold text-sm rounded-xl hover:bg-[#B8FF00] transition-all"><Plus size={16} /> New Project</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
          {projects.map(proj => (
            <div key={proj.id} className="bg-[#111111] rounded-xl border border-white/[0.08] p-5 cursor-pointer hover:border-[#333] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-[#CCFF00]"><FolderOpen size={20} /></div>
                  <div>
                    <h3 className="text-white font-semibold">{proj.name}</h3>
                    <p className="text-[#555] text-xs">{proj.count} items · {proj.updated}</p>
                  </div>
                </div>
                <button className="p-1.5 text-[#444] hover:text-white opacity-0 group-hover:opacity-100 transition-all"><MoreHorizontal size={16} /></button>
              </div>
              {proj.preview.length > 0 && (
                <div className="flex -space-x-2">
                  {proj.preview.map((src, i) => <img key={i} src={src} className="w-8 h-8 rounded-lg border-2 border-[#111]" alt="" />)}
                  {proj.count > proj.preview.length && <div className="w-8 h-8 rounded-lg border-2 border-[#111] bg-[#1a1a1a] flex items-center justify-center text-[#555] text-xs">+{proj.count - proj.preview.length}</div>}
                </div>
              )}
            </div>
          ))}
        </div>

        {showNew && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowNew(false)}>
            <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h3 className="text-white font-bold mb-4">New Project</h3>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Project name" className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setShowNew(false)} className="flex-1 px-4 py-2.5 bg-[#1a1a1a] text-[#888] font-semibold rounded-xl hover:text-white">Cancel</button>
                <button onClick={createProject} className="flex-1 px-4 py-2.5 bg-[#CCFF00] text-black font-bold rounded-xl hover:bg-[#B8FF00]">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}