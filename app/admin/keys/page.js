'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/lib/AuthProvider';
import toast from 'react-hot-toast';

export default function AdminKeysPage() {
  const { user } = useAuth();
  const [keys, setKeys] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ provider: 'muapi', encrypted_key: '', label: 'default' });

  const fetchKeys = async () => {
    const { data } = await supabase.from('admin_provider_keys').select('*').order('provider');
    if (data) setKeys(data);
    const { data: prods } = await supabase.from('api_providers').select('name, display_name').eq('is_active', true);
    if (prods) setProviders(prods);
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

  const addKey = async () => {
    if (!form.encrypted_key.trim()) { toast.error('Enter an API key'); return; }
    const { error } = await supabase.from('admin_provider_keys').insert(form);
    if (error) { toast.error(error.message); return; }
    toast.success('API key saved');
    setShowAdd(false);
    setForm({ provider: 'muapi', encrypted_key: '', label: 'default' });
    fetchKeys();
  };

  const deleteKey = async (id) => {
    const { error } = await supabase.from('admin_provider_keys').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Key deleted');
    fetchKeys();
  };

  if (loading) return <div className="text-[#9CA3AF] text-center py-12">Loading keys...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#F9FAFB]">API Keys Management</h2>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 text-sm font-medium bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]">+ Add Key</button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <div className="bg-[#111827] border border-white/10 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Add API Key</h3>
            <div className="space-y-3">
              <select value={form.provider} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none">
                {providers.map(p => <option key={p.name} value={p.name}>{p.display_name} ({p.name})</option>)}
                {providers.length === 0 && <option value="muapi">Muapi AI (default)</option>}
              </select>
              <input placeholder="API Key" value={form.encrypted_key} onChange={e => setForm(f => ({ ...f, encrypted_key: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED] font-mono" />
              <input placeholder="Label (e.g. production)" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED]" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 text-sm font-medium bg-white/5 border border-white/10 text-[#9CA3AF] rounded-lg hover:bg-white/10">Cancel</button>
              <button onClick={addKey} className="flex-1 py-2 text-sm font-medium bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]">Save Key</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {keys.length === 0 ? (
          <div className="text-center py-16 text-[#9CA3AF]">
            <p className="text-sm">No API keys configured</p>
            <p className="text-xs mt-2">Add API keys for each provider (Muapi, Kie AI, OpenRouter, etc.)</p>
          </div>
        ) : keys.map(k => (
          <div key={k.id} className="bg-[rgba(17,24,39,0.8)] border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#F9FAFB] capitalize">{k.provider}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${k.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {k.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-[#6B7280]">{k.label}</span>
              </div>
              <div className="text-xs text-[#9CA3AF] mt-1 font-mono">
                {k.encrypted_key?.slice(0, 12)}••••••••••••••••
              </div>
              <div className="text-xs text-[#6B7280] mt-0.5">Added {new Date(k.created_at).toLocaleDateString()}</div>
            </div>
            <button onClick={() => deleteKey(k.id)}
              className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
