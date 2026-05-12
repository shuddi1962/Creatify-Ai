'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import toast from 'react-hot-toast';

const PREDEFINED_PROVIDERS = [
  { name: 'muapi', display_name: 'Muapi AI', base_url: 'https://api.muapi.ai', docs: 'https://muapi.ai/docs', key_placeholder: 'Enter your Muapi API key (mk_...)', key_format: 'mk_' },
  { name: 'openrouter', display_name: 'OpenRouter', base_url: 'https://openrouter.ai/api/v1', docs: 'https://openrouter.ai/docs', key_placeholder: 'Enter your OpenRouter API key (sk-or-...)', key_format: 'sk-or-' },
  { name: 'kie-ai', display_name: 'Kie AI', base_url: 'https://api.kie.ai/v1', docs: 'https://kie.ai/docs', key_placeholder: 'Enter your Kie AI API key', key_format: '' },
  { name: 'elevenlabs', display_name: 'ElevenLabs', base_url: 'https://api.elevenlabs.io/v1', docs: 'https://elevenlabs.io/docs', key_placeholder: 'Enter your ElevenLabs API key', key_format: '' },
  { name: 'openai', display_name: 'OpenAI', base_url: 'https://api.openai.com/v1', docs: 'https://platform.openai.com/api-keys', key_placeholder: 'Enter your OpenAI API key (sk-...)', key_format: 'sk-' },
  { name: 'anthropic', display_name: 'Anthropic (Claude)', base_url: 'https://api.anthropic.com/v1', docs: 'https://console.anthropic.com/account/keys', key_placeholder: 'Enter your Anthropic API key (sk-ant-...)', key_format: 'sk-ant-' },
  { name: 'stability', display_name: 'Stability AI', base_url: 'https://api.stability.ai/v1', docs: 'https://platform.stability.ai/account/keys', key_placeholder: 'Enter your Stability AI API key', key_format: '' },
  { name: 'replicate', display_name: 'Replicate', base_url: 'https://api.replicate.com/v1', docs: 'https://replicate.com/account/api-tokens', key_placeholder: 'Enter your Replicate API token (r8_...)', key_format: 'r8_' },
  { name: 'deepseek', display_name: 'DeepSeek', base_url: 'https://api.deepseek.com/v1', docs: 'https://platform.deepseek.com/api_keys', key_placeholder: 'Enter your DeepSeek API key (sk-...)', key_format: 'sk-' },
  { name: 'mistral', display_name: 'Mistral AI', base_url: 'https://api.mistral.ai/v1', docs: 'https://console.mistral.ai/api-keys/', key_placeholder: 'Enter your Mistral API key', key_format: '' },
  { name: 'cohere', display_name: 'Cohere', base_url: 'https://api.cohere.ai/v1', docs: 'https://dashboard.cohere.com/api-keys', key_placeholder: 'Enter your Cohere API key', key_format: '' },
  { name: 'perplexity', display_name: 'Perplexity', base_url: 'https://api.perplexity.ai', docs: 'https://www.perplexity.ai/settings/api', key_placeholder: 'Enter your Perplexity API key (pplx-...)', key_format: 'pplx-' },
  { name: 'groq', display_name: 'Groq', base_url: 'https://api.groq.com/openai/v1', docs: 'https://console.groq.com/keys', key_placeholder: 'Enter your Groq API key (gsk_...)', key_format: 'gsk_' },
  { name: 'together', display_name: 'Together AI', base_url: 'https://api.together.xyz/v1', docs: 'https://api.together.xyz/settings/api-keys', key_placeholder: 'Enter your Together AI API key', key_format: '' },
  { name: 'fireworks', display_name: 'Fireworks AI', base_url: 'https://api.fireworks.ai/inference/v1', docs: 'https://fireworks.ai/api-keys', key_placeholder: 'Enter your Fireworks API key', key_format: '' },
  { name: 'tavily', display_name: 'Tavily AI', base_url: 'https://api.tavily.com', docs: 'https://tavily.com/docs', key_placeholder: 'Enter your Tavily API key (tvly-...)', key_format: 'tvly-' },
  { name: 'serpapi', display_name: 'SerpAPI (Google Trends)', base_url: 'https://serpapi.com', docs: 'https://serpapi.com/manage-api-key', key_placeholder: 'Enter your SerpAPI key', key_format: '' },
  { name: 'huggingface', display_name: 'HuggingFace', base_url: 'https://api-inference.huggingface.co', docs: 'https://huggingface.co/settings/tokens', key_placeholder: 'Enter your HuggingFace token (hf_...)', key_format: 'hf_' },
  { name: 'google-ai', display_name: 'Google AI (Gemini)', base_url: 'https://generativelanguage.googleapis.com/v1', docs: 'https://makersuite.google.com/app/apikey', key_placeholder: 'Enter your Google AI API key (AIza...)', key_format: 'AIza' },
  { name: 'lemonfox', display_name: 'LemonFox', base_url: 'https://api.lemonfox.ai/v1', docs: 'https://lemonfox.ai/docs', key_placeholder: 'Enter your LemonFox API key', key_format: '' },
];

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [keyLabel, setKeyLabel] = useState('default');

  const fetchProviders = async () => {
    const { data } = await supabase.from('api_providers').select('*').order('name');
    if (data) setProviders(data);
    setLoading(false);
  };

  useEffect(() => { fetchProviders(); }, []);

  const selectedDef = PREDEFINED_PROVIDERS.find(p => p.name === selectedProvider);

  const saveProviderWithKey = async () => {
    if (!selectedProvider) { toast.error('Select a provider'); return; }
    if (!apiKey.trim()) { toast.error('Enter an API key'); return; }

    const def = PREDEFINED_PROVIDERS.find(p => p.name === selectedProvider);
    if (!def) { toast.error('Invalid provider'); return; }

    // Upsert the provider
    await supabase.from('api_providers').upsert({
      name: def.name, display_name: def.display_name,
      base_url: def.base_url, docs_url: def.docs,
      supported_models: [],
    }, { onConflict: 'name' });

    // Save the API key
    const { error: keyError } = await supabase.from('admin_provider_keys').insert({
      provider: def.name, encrypted_key: apiKey, label: keyLabel,
    });
    if (keyError) { toast.error(keyError.message); return; }

    toast.success(`${def.display_name} configured with API key`);
    setShowAdd(false);
    setSelectedProvider('');
    setApiKey('');
    setKeyLabel('default');
    fetchProviders();
  };

  const toggleProvider = async (name, is_active) => {
    const { error } = await supabase.from('api_providers').update({ is_active }).eq('name', name);
    if (error) { toast.error(error.message); return; }
    toast.success(`Provider ${is_active ? 'enabled' : 'disabled'}`);
    fetchProviders();
  };

  const deleteKey = async (provider) => {
    const { error } = await supabase.from('admin_provider_keys').delete().eq('provider', provider);
    if (error) { toast.error(error.message); return; }
    toast.success('API key removed');
    fetchProviders();
  };

  const addDefaults = async () => {
    for (const p of PREDEFINED_PROVIDERS) {
      await supabase.from('api_providers').upsert({
        name: p.name, display_name: p.display_name,
        base_url: p.base_url, docs_url: p.docs,
      }, { onConflict: 'name' });
    }
    toast.success('20 default providers added');
    fetchProviders();
  };

  const availableProviders = PREDEFINED_PROVIDERS.filter(
    p => !providers.some(pp => pp.name === p.name)
  );

  if (loading) return <div className="text-[#9CA3AF] text-center py-12">Loading providers...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#F9FAFB]">API Providers</h2>
        <div className="flex gap-2">
          {providers.length < 5 && (
            <button onClick={addDefaults} className="px-4 py-2 text-sm font-medium bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30 rounded-lg hover:bg-[#7C3AED]/30">Add All Providers</button>
          )}
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 text-sm font-medium bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]">+ Add & Configure</button>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <div className="bg-[#111827] border border-white/10 rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Add Provider & API Key</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Provider</label>
                <select value={selectedProvider} onChange={e => { setSelectedProvider(e.target.value); setApiKey(''); }}
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED]">
                  <option value="">-- Select a provider --</option>
                  {PREDEFINED_PROVIDERS.map(p => (
                    <option key={p.name} value={p.name} disabled={providers.some(pp => pp.name === p.name)}>
                      {p.display_name} {providers.some(pp => pp.name === p.name) ? '(already added)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDef && (
                <>
                  <div className="bg-[#0A0F1E] rounded-xl p-3 border border-white/5 space-y-1">
                    <div className="text-xs text-[#9CA3AF]">Base URL: <span className="text-[#F9FAFB] font-mono">{selectedDef.base_url}</span></div>
                    {selectedDef.key_format && (
                      <div className="text-xs text-[#9CA3AF]">Key format: <span className="text-[#F9FAFB] font-mono">{selectedDef.key_format}***</span></div>
                    )}
                    <a href={selectedDef.docs} target="_blank" rel="noopener noreferrer" className="text-xs text-[#7C3AED] hover:underline block">
                      Get API key →
                    </a>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">API Key</label>
                    <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                      placeholder={selectedDef.key_placeholder}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED] font-mono" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Label</label>
                    <input value={keyLabel} onChange={e => setKeyLabel(e.target.value)}
                      placeholder="e.g. production, development"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED]" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-medium bg-white/5 border border-white/10 text-[#9CA3AF] rounded-lg hover:bg-white/10">Cancel</button>
                    <button onClick={saveProviderWithKey} className="flex-1 py-2.5 text-sm font-medium bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]">
                      Save {selectedDef.display_name}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {providers.length === 0 ? (
          <div className="text-center py-16 text-[#9CA3AF]">
            <p className="text-sm">No providers configured yet</p>
            <p className="text-xs mt-2">Click "Add All Providers" to seed 20 providers, or "Add & Configure" to add one by one</p>
          </div>
        ) : providers.map(p => (
          <div key={p.name} className="bg-[rgba(17,24,39,0.8)] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#F9FAFB]">{p.display_name || p.name}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-xs text-[#9CA3AF] mt-1 font-mono">{p.base_url}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleProvider(p.name, !p.is_active)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg ${p.is_active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                  {p.is_active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => deleteKey(p.name)}
                  className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">Remove Key</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
