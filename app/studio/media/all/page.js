'use client';

import { useState } from 'react';
import { FolderOpen, Download, Share2, Trash2, Grid, List, Search, Image, Video, Music } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const SAMPLE_ASSETS = [
  { id: 1, type: 'image', url: 'https://picsum.photos/seed/a1/400/300', name: 'hero-banner.png', model: 'Flux', date: 'May 10', size: '2.4 MB' },
  { id: 2, type: 'video', url: 'https://picsum.photos/seed/a2/400/225', name: 'product-reel.mp4', model: 'Seedance', date: 'May 9', size: '18.7 MB' },
  { id: 3, type: 'image', url: 'https://picsum.photos/seed/a3/400/300', name: 'thumbnail-1.png', model: 'Flux', date: 'May 8', size: '1.2 MB' },
  { id: 4, type: 'audio', name: 'voiceover-1.mp3', model: 'ElevenLabs', date: 'May 8', size: '4.1 MB' },
  { id: 5, type: 'image', url: 'https://picsum.photos/seed/a5/400/300', name: 'social-post.png', model: 'Flux', date: 'May 7', size: '980 KB' },
  { id: 6, type: 'video', url: 'https://picsum.photos/seed/a6/400/225', name: 'ad-clip.mp4', model: 'Kling', date: 'May 6', size: '24.3 MB' },
  { id: 7, type: 'image', url: 'https://picsum.photos/seed/a7/400/300', name: 'headshot.png', model: 'Realistic', date: 'May 5', size: '1.8 MB' },
  { id: 8, type: 'image', url: 'https://picsum.photos/seed/a8/400/300', name: 'product-shot.png', model: 'Flux', date: 'May 4', size: '2.1 MB' },
];

const TYPE_FILTERS = ['All', 'Images', 'Videos', 'Audio'];
const SORTS = ['Newest', 'Oldest', 'Name', 'Size'];

export default function MediaAllPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest');
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState([]);
  const [assets] = useState(SAMPLE_ASSETS);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === assets.length ? [] : assets.map(a => a.id));

  const filtered = assets.filter(a => {
    if (typeFilter !== 'All' && a.type !== typeFilter.slice(0, -1).toLowerCase()) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (id) => toast.success('Asset deleted');
  const handleDownload = (url) => toast.success('Download started');
  const handleBulkDelete = () => { setSelected([]); toast.success('Selected assets deleted'); };
  const handleBulkDownload = () => toast.success('Downloading selected assets');

  return (
    <div className="min-h-screen bg-[#000000] pb-12">
      <Toaster position="top-center" />
      <div className="max-w-[900px] mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-bold text-2xl">Media Library</h1>
            <p className="text-[#666] text-sm mt-1">Search and filter all your generated creative assets</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}><Grid size={16} /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888]'}`}><List size={16} /></button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..." className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#444] focus:outline-none focus:border-[#7C3AED]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {TYPE_FILTERS.map(f => (
              <button key={f} onClick={() => setTypeFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${typeFilter === f ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{f}</button>
            ))}
            {SORTS.map(s => (
              <button key={s} onClick={() => setSort(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${sort === s ? 'bg-[#333] text-white' : 'bg-[#1a1a1a] text-[#888] border border-white/[0.08]'}`}>{s}</button>
            ))}
          </div>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-[#7C3AED]/10 rounded-xl">
            <span className="text-white text-sm font-semibold">{selected.length} selected</span>
            <button onClick={handleBulkDownload} className="px-3 py-1.5 bg-[#1a1a1a] text-white text-xs rounded-lg hover:bg-[#222] flex items-center gap-1"><Download size={12} /> Download</button>
            <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-red-500/20 text-red-500 text-xs rounded-lg hover:bg-red-500/30 flex items-center gap-1"><Trash2 size={12} /> Delete</button>
            <button onClick={() => setSelected([])} className="ml-auto text-[#888] text-xs">Clear</button>
          </div>
        )}

        {view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-8">
            {filtered.map(asset => (
              <div key={asset.id} className={`bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden group relative cursor-pointer ${selected.includes(asset.id) ? 'ring-2 ring-[#CCFF00]' : ''}`} onClick={() => toggleSelect(asset.id)}>
                <div className="aspect-square bg-[#1a1a1a] relative">
                  {asset.url ? <img src={asset.url} className="w-full h-full object-cover" alt="" /> : (
                    <div className="w-full h-full flex items-center justify-center">
                      {asset.type === 'video' ? <Video size={24} className="text-[#444]" /> : asset.type === 'audio' ? <Music size={24} className="text-[#444]" /> : <Image size={24} className="text-[#444]" />}
                    </div>
                  )}
                  {selected.includes(asset.id) && <div className="absolute top-2 left-2 w-5 h-5 bg-[#CCFF00] rounded-full flex items-center justify-center"><span className="text-black text-xs font-bold">✓</span></div>}
                </div>
                <div className="p-2">
                  <p className="text-white text-xs truncate">{asset.name}</p>
                  <p className="text-[#555] text-[10px]">{asset.date} · {asset.size}</p>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleDownload(asset.url); }} className="p-2 bg-white rounded-full text-black hover:bg-[#DDD]"><Download size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); toast.success('Sharing...'); }} className="p-2 bg-white rounded-full text-black hover:bg-[#DDD]"><Share2 size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] rounded-xl border border-white/[0.08] overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="p-3 text-left"><input type="checkbox" checked={selected.length === filtered.length} onChange={toggleAll} className="w-4 h-4" /></th>
                  <th className="p-3 text-left text-[10px] font-semibold text-[#444] uppercase">Name</th>
                  <th className="p-3 text-left text-[10px] font-semibold text-[#444] uppercase">Type</th>
                  <th className="p-3 text-left text-[10px] font-semibold text-[#444] uppercase">Model</th>
                  <th className="p-3 text-left text-[10px] font-semibold text-[#444] uppercase">Size</th>
                  <th className="p-3 text-left text-[10px] font-semibold text-[#444] uppercase">Date</th>
                  <th className="p-3 text-left text-[10px] font-semibold text-[#444] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(asset => (
                  <tr key={asset.id} className="border-b border-white/[0.04]">
                    <td className="p-3"><input type="checkbox" checked={selected.includes(asset.id)} onChange={() => toggleSelect(asset.id)} className="w-4 h-4" /></td>
                    <td className="p-3 text-white text-sm flex items-center gap-2">
                      {asset.url && <img src={asset.url} className="w-8 h-8 rounded object-cover" alt="" />}
                      {asset.name}
                    </td>
                    <td className="p-3"><span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/20 text-[#7C3AED] rounded uppercase">{asset.type}</span></td>
                    <td className="p-3 text-[#555] text-xs">{asset.model}</td>
                    <td className="p-3 text-[#555] text-xs">{asset.size}</td>
                    <td className="p-3 text-[#555] text-xs">{asset.date}</td>
                    <td className="p-3"><div className="flex gap-1"><button className="p-1.5 text-[#888] hover:text-white"><Download size={14} /></button><button className="p-1.5 text-[#888] hover:text-red-500"><Trash2 size={14} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}