'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const FLAGGED = [
  { id: 1, type: 'Image', user: 'user_3821', reason: 'NSFW content detected', date: '2026-05-11' },
  { id: 2, type: 'Video', user: 'user_4910', reason: 'Copyright violation', date: '2026-05-10' },
  { id: 3, type: 'Prompt', user: 'user_1743', reason: 'Hate speech', date: '2026-05-09' },
  { id: 4, type: 'Image', user: 'user_6652', reason: 'Violence/gore', date: '2026-05-08' },
];

export default function AdminContent() {
  const [keywords, setKeywords] = useState(['nsfw', 'gore', 'violence', 'hate speech', 'drugs']);
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      toast.success(`Keyword "${newKeyword.trim()}" added`);
      setNewKeyword('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#F9FAFB]">Content Moderation</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 p-6">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Flagged Content</h3>
          <div className="space-y-3">
            {FLAGGED.map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-[#7C3AED]/20 text-[#7C3AED] font-medium">{f.type}</span>
                  <div>
                    <p className="text-sm text-[#F9FAFB] font-medium">{f.user}</p>
                    <p className="text-xs text-[#9CA3AF]">{f.reason}</p>
                  </div>
                  <span className="text-xs text-[#6B7280]">{f.date}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toast.success('Content approved')} className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all">Approve</button>
                  <button onClick={() => toast.success('Content deleted')} className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 p-6">
          <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Blocked Keywords</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add keyword..."
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addKeyword()}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED]"
            />
            <button onClick={addKeyword} className="px-3 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map(k => (
              <span key={k} className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/20 flex items-center gap-2">
                {k}
                <button onClick={() => { setKeywords(keywords.filter(x => x !== k)); toast.success(`"${k}" removed`); }} className="text-red-300 hover:text-red-200">&times;</button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
