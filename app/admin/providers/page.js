'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/lib/AuthProvider';
import toast from 'react-hot-toast';

const DEFAULT_PROVIDERS = [
  { name: 'muapi', display_name: 'Muapi AI', base_url: 'https://api.muapi.ai', docs_url: 'https://muapi.ai/docs' },
  { name: 'kie-ai', display_name: 'Kie AI', base_url: 'https://api.kie.ai/v1', docs_url: 'https://kie.ai/docs' },
  { name: 'openrouter', display_name: 'OpenRouter', base_url: 'https://openrouter.ai/api/v1', docs_url: 'https://openrouter.ai/docs' },
  { name: 'elevenlabs', display_name: 'ElevenLabs', base_url: 'https://api.elevenlabs.io/v1', docs_url: 'https://elevenlabs.io/docs' },
  { name: 'tavily', display_name: 'Tavily AI', base_url: 'https://api.tavily.com', docs_url: 'https://tavily.com/docs' },
  { name: 'serpapi', display_name: 'SerpAPI (Google Trends)', base_url: 'https://serpapi.com', docs_url: 'https://serpapi.com/google-trends-api' },
];

export default function AdminProvidersPage() {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', display_name: '', base_url: '', docs_url: '' });

  const fetchProviders = async () => {
    const { data } = await supabase.from('api_providers').select('*').order('name');
    if (data) setProviders(data);
    setLoading(false);
  };

  useEffect(() => { fetchProviders(); }, []);

  const addProvider = async () => {
    const { error } = await supabase.from('api_providers').insert(form);
    if (error) { toast.error(error.message); return; }
    toast.success('Provider added');
    setShowAdd(false);
    setForm({ name: '', display_name: '', base_url: '', docs_url: '' });
    fetchProviders();
  };

  const toggleProvider = async (name, is_active) => {
    const { error } = await supabase.from('api_providers').update({ is_active }).eq('name', name);
    if (error) { toast.error(error.message); return; }
    toast.success(`Provider ${is_active ? 'enabled' : 'disabled'}`);
    fetchProviders();
  };

  const deleteProvider = async (name) => {
    const { error } = await supabase.from('api_providers').delete().eq('name', name);
    if (error) { toast.error(error.message); return; }
    toast.success('Provider removed');
    fetchProviders();
  };

  const addDefaults = async () => {
    for (const p of DEFAULT_PROVIDERS) {
      await supabase.from('api_providers').upsert(p, { onConflict: 'name' });
    }
    toast.success('Default providers added');
    fetchProviders();
  };

  if (loading) return <div className="text-[#9CA3AF] text-center py-12">Loading providers...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#F9FAFB]">API Providers</h2>
        <div className="flex gap-2">
          {providers.length === 0 && (
            <button onClick={addDefaults} className="px-4 py-2 text-sm font-medium bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30 rounded-lg hover:bg-[#7C3AED]/30">Add Defaults</button>
          )}
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 text-sm font-medium bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]">+ Add Provider</button>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <div className="bg-[#111827] border border-white/10 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Add API Provider</h3>
            <div className="space-y-3">
              <input placeholder="Provider name (e.g. kie-ai)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED]" />
              <input placeholder="Display name (e.g. Kie AI)" value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED]" />
              <input placeholder="Base URL (e.g. https://api.kie.ai/v1)" value={form.base_url} onChange={e => setForm(f => ({ ...f, base_url: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED]" />
              <input placeholder="Docs URL (optional)" value={form.docs_url} onChange={e => setForm(f => ({ ...f, docs_url: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED]" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 text-sm font-medium bg-white/5 border border-white/10 text-[#9CA3AF] rounded-lg hover:bg-white/10">Cancel</button>
              <button onClick={addProvider} className="flex-1 py-2 text-sm font-medium bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]">Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {providers.length === 0 ? (
          <div className="text-center py-16 text-[#9CA3AF]">
            <p className="text-sm">No providers configured yet</p>
            <p className="text-xs mt-2">Click "Add Defaults" to seed standard providers, or add them manually</p>
          </div>
        ) : providers.map(p => (
          <div key={p.name} className="bg-[rgba(17,24,39,0.8)] border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#F9FAFB]">{p.display_name}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {p.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-xs text-[#9CA3AF] mt-1 font-mono">{p.base_url}</div>
              <div className="text-xs text-[#6B7280] mt-0.5">ID: {p.name}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleProvider(p.name, !p.is_active)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${p.is_active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                {p.is_active ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => deleteProvider(p.name)}
                className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
