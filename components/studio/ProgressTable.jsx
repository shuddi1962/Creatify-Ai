'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const TABS = ['All', 'Running', 'Queued', 'Completed', 'Failed'];

export default function ProgressTable({ items, onCancel, onRetry, onDelete }) {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? items : items.filter(i => i.status === filter.toLowerCase());

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === t ? 'bg-[#7C3AED] text-white' : 'bg-[#1a1a1a] text-[#888] hover:bg-[#222]'
            }`}
          >
            {t} {t !== 'All' && <span className="ml-1 text-[10px]">{items.filter(i => i.status === t.toLowerCase()).length}</span>}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#555] text-sm">No jobs in this category</div>
        )}
        {filtered.map(item => (
          <div key={item.id} className="bg-[#0D0D0D] rounded-xl border border-white/[0.08] p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{item.prompt || item.name || `Job ${item.id}`}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-[#555] uppercase tracking-wider">{item.type}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  item.status === 'running' ? 'bg-[#CCFF00]/20 text-[#CCFF00]' :
                  item.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                  'bg-[#1a1a1a] text-[#888]'
                }`}>{item.status}</span>
              </div>
              <div className="mt-2 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7C3AED] rounded-full transition-all"
                  style={{ width: `${item.progress || 0}%` }}
                />
              </div>
              <div className="text-[10px] text-[#555] mt-1">{item.completed || 0} / {item.total || 0} items</div>
            </div>
            <div className="flex items-center gap-2">
              {item.status === 'failed' && onRetry && (
                <button onClick={() => onRetry(item.id)} className="px-3 py-1.5 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-semibold hover:bg-[#7C3AED]/30">Retry</button>
              )}
              {item.status === 'running' && onCancel && (
                <button onClick={() => onCancel(item.id)} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30">Cancel</button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(item.id)} className="px-3 py-1.5 rounded-lg bg-white/5 text-[#888] text-xs hover:bg-white/10">Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
