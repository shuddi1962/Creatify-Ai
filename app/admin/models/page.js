'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const MODELS_DATA = [
  { id: 1, name: 'Flux Pro', provider: 'Black Forest Labs', type: 'Image', cost: 5, enabled: true },
  { id: 2, name: 'GPT Image 2', provider: 'OpenAI', type: 'Image', cost: 8, enabled: true },
  { id: 3, name: 'Seedance 2', provider: 'Seedance', type: 'Video', cost: 15, enabled: true },
  { id: 4, name: 'Kling 3', provider: 'Kuaishou', type: 'Video', cost: 12, enabled: false },
  { id: 5, name: 'Midjourney v7', provider: 'Midjourney', type: 'Image', cost: 10, enabled: true },
];

export default function AdminModels() {
  const [models, setModels] = useState(MODELS_DATA);

  const toggleModel = (id) => {
    setModels(models.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
    toast.success(`Model updated`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F9FAFB]">Models</h2>
          <p className="text-sm text-[#9CA3AF]">Manage AI models and credit costs</p>
        </div>
      </div>

      <div className="rounded-xl bg-[rgba(17,24,39,0.8)] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[#9CA3AF] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Provider</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Credit Cost</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map(m => (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                <td className="px-4 py-3 text-[#F9FAFB] font-medium">{m.name}</td>
                <td className="px-4 py-3 text-[#9CA3AF]">{m.provider}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-[#06B6D4]/20 text-[#06B6D4]">{m.type}</span>
                </td>
                <td className="px-4 py-3 text-[#F9FAFB]">{m.cost} credits</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{m.enabled ? 'Enabled' : 'Disabled'}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => toggleModel(m.id)} className={`px-2 py-1 rounded text-xs transition-all ${m.enabled ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                      {m.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => toast.success(`Editing cost for ${m.name}...`)} className="px-2 py-1 rounded text-xs bg-[#7C3AED]/20 text-[#7C3AED] hover:bg-[#7C3AED]/30 transition-all">Edit Cost</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
