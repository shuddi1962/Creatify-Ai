'use client';

import { useState } from 'react';

const TABS = [
  { id: 'all', label: 'All Assets' },
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
  { id: 'projects', label: 'Projects' },
  { id: 'storage', label: 'Storage Quota' },
  { id: 'drive', label: 'Google Drive' },
  { id: 'dropbox', label: 'Dropbox' },
  { id: 'download', label: 'Bulk Download' },
];

const SAMPLE_ASSETS = [
  { type: 'image', name: 'Sunset landscape', date: '2 days ago', size: '2.4 MB' },
  { type: 'video', name: 'Product showcase', date: '5 days ago', size: '45 MB' },
  { type: 'audio', name: 'Voiceover narration', date: '1 week ago', size: '3.1 MB' },
  { type: 'image', name: 'Character portrait', date: '1 week ago', size: '1.8 MB' },
  { type: 'video', name: 'TikTok compilation', date: '2 weeks ago', size: '120 MB' },
  { type: 'image', name: 'Product shot', date: '3 days ago', size: '3.2 MB' },
  { type: 'video', name: 'Tutorial clip', date: '1 day ago', size: '28 MB' },
  { type: 'audio', name: 'Background music', date: '4 days ago', size: '5.7 MB' },
];

export default function MediaLibraryStudio({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'all');

  const renderDriveDropbox = (service) => {
    const isDrive = service === 'drive';
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <div className={`w-12 h-12 rounded-xl ${isDrive ? 'bg-yellow-500/10' : 'bg-blue-500/10'} flex items-center justify-center`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDrive ? '#FBBF24' : '#3B82F6'} strokeWidth="1.5">
              {isDrive ? <><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></> : <><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></>}
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-[#F9FAFB]">{isDrive ? 'Google Drive' : 'Dropbox'}</h4>
            <p className="text-xs text-[#9CA3AF]">{isDrive ? 'Auto-sync all outputs to Google Drive' : 'Auto-sync all outputs to Dropbox'}</p>
          </div>
        </div>
        <div className="p-8 rounded-xl bg-white/[0.03] border border-white/5 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">{isDrive ? <><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></> : <><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></>}</svg>
          </div>
          <p className="text-sm font-medium text-[#F9FAFB] mb-1">Not Connected</p>
          <p className="text-xs text-[#9CA3AF] mb-4">Connect your {isDrive ? 'Google Drive' : 'Dropbox'} to auto-sync assets</p>
          <button className={`px-6 py-2 rounded-lg text-white text-xs font-bold hover:opacity-90 transition-all ${isDrive ? 'bg-yellow-500' : 'bg-blue-500'}`}>
            Connect {isDrive ? 'Google Drive' : 'Dropbox'}
          </button>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider">Sync Settings</h4>
          {[
            { label: 'Auto-upload new assets', desc: 'Automatically sync new creations' },
            { label: 'Sync subfolders by type', desc: 'Organize into Images, Videos, Audio folders' },
            { label: 'Two-way sync', desc: 'Changes in {0} reflect in Media Library'.replace('{0}', isDrive ? 'Drive' : 'Dropbox') },
          ].map((opt, i) => (
            <label key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7C3AED] focus:ring-[#7C3AED]" />
              <div className="flex-1">
                <span className="text-sm text-[#F9FAFB]">{opt.label}</span>
                <p className="text-xs text-[#9CA3AF]">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderBulkDownload = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Bulk Download</h4>
          <p className="text-xs text-[#9CA3AF]">Select multiple assets and download as a ZIP file</p>
        </div>
      </div>
      <div className="space-y-2">
        {SAMPLE_ASSETS.map((asset, i) => (
          <label key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all">
            <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7C3AED] focus:ring-[#7C3AED]" />
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${asset.type === 'image' ? 'bg-[#7C3AED]/20' : asset.type === 'video' ? 'bg-pink-500/20' : 'bg-green-500/20'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={asset.type === 'image' ? '#7C3AED' : asset.type === 'video' ? '#EC4899' : '#10B981'} strokeWidth="2">
                {asset.type === 'image' ? <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></> : asset.type === 'video' ? <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></> : <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>}
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-sm text-[#F9FAFB]">{asset.name}</span>
              <span className="text-xs text-[#9CA3AF] ml-2">{asset.size}</span>
            </div>
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <span className="text-xs text-[#9CA3AF]">0 assets selected</span>
        <button className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all disabled:opacity-50" disabled>Download ZIP</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#0A0F1E] overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Media Library</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Organize, store, and manage all your creative assets</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30' : 'text-[#9CA3AF] hover:text-[#F9FAFB] border border-transparent'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab !== 'storage' && activeTab !== 'drive' && activeTab !== 'dropbox' && activeTab !== 'download' && (
            <button className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload
            </button>
          )}
        </div>

        {activeTab === 'storage' && (
          <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)]">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#F9FAFB] mb-1">Storage Quota</h3>
              <p className="text-xs text-[#9CA3AF]">Track your storage usage across all asset types</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#F9FAFB]">Total Storage</span>
                  <span className="text-sm font-bold text-[#F9FAFB]">2.4 GB / 10 GB</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#7C3AED]" style={{ width: '24%' }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Images', used: '1.2 GB', pct: 30, color: 'bg-[#7C3AED]' },
                  { label: 'Videos', used: '850 MB', pct: 45, color: 'bg-pink-500' },
                  { label: 'Audio', used: '350 MB', pct: 15, color: 'bg-green-500' },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="h-1.5 rounded-full bg-white/5 mb-2 overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                    <div className="text-xs font-medium text-[#F9FAFB]">{s.label}</div>
                    <div className="text-[10px] text-[#9CA3AF]">{s.used}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drive' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)]">{renderDriveDropbox('drive')}</div>}
        {activeTab === 'dropbox' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)]">{renderDriveDropbox('dropbox')}</div>}
        {activeTab === 'download' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)]">{renderBulkDownload()}</div>}

        {!['storage', 'drive', 'dropbox', 'download'].includes(activeTab) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_ASSETS.map((asset, i) => (
              <div key={i} className="p-4 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 hover:bg-[rgba(17,24,39,0.95)] transition-all cursor-pointer group">
                <div className={`w-full aspect-video rounded-lg mb-3 flex items-center justify-center ${
                  asset.type === 'image' ? 'bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20' :
                  asset.type === 'video' ? 'bg-gradient-to-br from-[#EC4899]/20 to-[#F59E0B]/20' :
                  'bg-gradient-to-br from-[#10B981]/20 to-[#3B82F6]/20'
                }`}>
                  {asset.type === 'image' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                  {asset.type === 'video' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
                  {asset.type === 'audio' && <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>}
                </div>
                <h4 className="text-sm font-medium text-[#F9FAFB] truncate">{asset.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-[#9CA3AF]">{asset.date}</span>
                  <span className="text-xs text-[#6B7280]">{asset.size}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
