'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import toast from 'react-hot-toast';

const PROVIDER_DEFS = [
  { name: 'muapi', display_name: 'Muapi AI', base_url: 'https://api.muapi.ai', get_key_url: 'https://muapi.ai', key_placeholder: 'Paste your Muapi API key (starts with mk_)', key_format: 'mk_', description: 'Primary generation provider — powers all image, video, lipsync, and AI model inference.' },
  { name: 'openrouter', display_name: 'OpenRouter', base_url: 'https://openrouter.ai/api/v1', get_key_url: 'https://openrouter.ai/keys', key_placeholder: 'Paste your OpenRouter API key (starts with sk-or-)', key_format: 'sk-or-', description: 'Unified access to 200+ LLMs (GPT-4, Claude, Gemini, Llama). Used for agent conversations and script generation.' },
  { name: 'kie-ai', display_name: 'Kie AI', base_url: 'https://api.kie.ai/v1', get_key_url: 'https://kie.ai', key_placeholder: 'Paste your Kie AI API key', key_format: '', description: 'Alternative AI model provider for image and video generation.' },
  { name: 'openai', display_name: 'OpenAI', base_url: 'https://api.openai.com/v1', get_key_url: 'https://platform.openai.com/api-keys', key_placeholder: 'Paste your OpenAI API key (starts with sk-)', key_format: 'sk-', description: 'GPT-4o, DALL-E 3, Whisper. Powers AI chat agents and image generation.' },
  { name: 'anthropic', display_name: 'Anthropic (Claude)', base_url: 'https://api.anthropic.com/v1', get_key_url: 'https://console.anthropic.com/settings/keys', key_placeholder: 'Paste your Anthropic API key (starts with sk-ant-)', key_format: 'sk-ant-', description: 'Claude 3.5 models for agent conversations and advanced reasoning.' },
  { name: 'elevenlabs', display_name: 'ElevenLabs', base_url: 'https://api.elevenlabs.io/v1', get_key_url: 'https://elevenlabs.io/app/settings/api-keys', key_placeholder: 'Paste your ElevenLabs API key', key_format: '', description: 'Text-to-speech and voice cloning. Powers voiceover generation and dubbing.' },
  { name: 'stability', display_name: 'Stability AI', base_url: 'https://api.stability.ai/v1', get_key_url: 'https://platform.stability.ai/account/keys', key_placeholder: 'Paste your Stability AI API key', key_format: '', description: 'Stable Diffusion models for image generation and editing.' },
  { name: 'replicate', display_name: 'Replicate', base_url: 'https://api.replicate.com/v1', get_key_url: 'https://replicate.com/account/api-tokens', key_placeholder: 'Paste your Replicate API token (starts with r8_)', key_format: 'r8_', description: 'Cloud platform for open-source models. Access to Flux, music generation, and community models.' },
  { name: 'deepseek', display_name: 'DeepSeek', base_url: 'https://api.deepseek.com/v1', get_key_url: 'https://platform.deepseek.com/api_keys', key_placeholder: 'Paste your DeepSeek API key (starts with sk-)', key_format: 'sk-', description: 'Powerful open-source LLMs (V3, R1). Cost-effective alternative for AI conversations.' },
  { name: 'mistral', display_name: 'Mistral AI', base_url: 'https://api.mistral.ai/v1', get_key_url: 'https://console.mistral.ai/api-keys/', key_placeholder: 'Paste your Mistral API key', key_format: '', description: 'Fast and efficient LLMs for agent tasks and content generation.' },
  { name: 'cohere', display_name: 'Cohere', base_url: 'https://api.cohere.ai/v1', get_key_url: 'https://dashboard.cohere.com/api-keys', key_placeholder: 'Paste your Cohere API key', key_format: '', description: 'Enterprise LLMs with RAG capabilities for content search.' },
  { name: 'perplexity', display_name: 'Perplexity', base_url: 'https://api.perplexity.ai', get_key_url: 'https://www.perplexity.ai/settings/api', key_placeholder: 'Paste your Perplexity API key (starts with pplx-)', key_format: 'pplx-', description: 'Real-time web search + LLM. Powers competitor analyzer and trend research.' },
  { name: 'groq', display_name: 'Groq', base_url: 'https://api.groq.com/openai/v1', get_key_url: 'https://console.groq.com/keys', key_placeholder: 'Paste your Groq API key (starts with gsk_)', key_format: 'gsk_', description: 'Ultra-fast inference for open-source LLMs. Used for real-time agent responses.' },
  { name: 'together', display_name: 'Together AI', base_url: 'https://api.together.xyz/v1', get_key_url: 'https://api.together.xyz/settings/api-keys', key_placeholder: 'Paste your Together AI API key', key_format: '', description: 'Cloud platform for open-source models. Alternative providers.' },
  { name: 'fireworks', display_name: 'Fireworks AI', base_url: 'https://api.fireworks.ai/inference/v1', get_key_url: 'https://fireworks.ai/api-keys', key_placeholder: 'Paste your Fireworks API key', key_format: '', description: 'Fast inference for open-source LLMs with prompt caching.' },
  { name: 'tavily', display_name: 'Tavily AI', base_url: 'https://api.tavily.com', get_key_url: 'https://app.tavily.com/home', key_placeholder: 'Paste your Tavily API key (starts with tvly-)', key_format: 'tvly-', description: 'AI web search API. Powers Content Ideas & Trends — fetches real trending topics.' },
  { name: 'serpapi', display_name: 'SerpAPI (Google Trends)', base_url: 'https://serpapi.com', get_key_url: 'https://serpapi.com/manage-api-key', key_placeholder: 'Paste your SerpAPI key', key_format: '', description: 'Google Search & Trends API. Provides Google Trends data for content ideas.' },
  { name: 'huggingface', display_name: 'HuggingFace', base_url: 'https://api-inference.huggingface.co', get_key_url: 'https://huggingface.co/settings/tokens', key_placeholder: 'Paste your HuggingFace token (starts with hf_)', key_format: 'hf_', description: 'Access to 50,000+ open-source AI models for various tasks.' },
  { name: 'google-ai', display_name: 'Google AI (Gemini)', base_url: 'https://generativelanguage.googleapis.com/v1', get_key_url: 'https://aistudio.google.com/app/apikey', key_placeholder: 'Paste your Google AI API key (starts with AIza)', key_format: 'AIza', description: 'Gemini 2.0 models for multi-modal AI features.' },
  { name: 'lemonfox', display_name: 'LemonFox', base_url: 'https://api.lemonfox.ai/v1', get_key_url: 'https://lemonfox.ai/docs', key_placeholder: 'Paste your LemonFox API key', key_format: '', description: 'Fast TTS and STT API. Alternative for voiceover generation.' },
];

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [keyLabel, setKeyLabel] = useState('default');

  const fetchAll = async () => {
    const [provRes, keysRes] = await Promise.all([
      supabase.from('api_providers').select('*').order('name'),
      supabase.from('admin_provider_keys').select('*').order('provider'),
    ]);
    if (provRes.data) setProviders(provRes.data);
    if (keysRes.data) setKeys(keysRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const selectedDef = PROVIDER_DEFS.find(p => p.name === selectedProvider);
  const hasKey = (name) => keys.some(k => k.provider === name && k.is_active);

  const saveProviderWithKey = async () => {
    if (!selectedProvider) { toast.error('Select a provider'); return; }
    if (!apiKey.trim()) { toast.error('Enter an API key'); return; }
    const def = PROVIDER_DEFS.find(p => p.name === selectedProvider);
    if (!def) { toast.error('Invalid provider'); return; }

    const { error } = await supabase.from('admin_provider_keys').insert({
      provider: def.name, encrypted_key: apiKey, label: keyLabel,
    });
    if (error) { toast.error(error.message); return; }

    toast.success(`${def.display_name} configured with API key`);
    setShowAdd(false);
    setSelectedProvider('');
    setApiKey('');
    setKeyLabel('default');
    fetchAll();
  };

  const toggleDefault = async (name, is_default) => {
    if (is_default) {
      // Unset all defaults first, then set this one
      await supabase.from('admin_provider_keys').update({ is_default: false }).neq('provider', 'none');
    }
    const { error } = await supabase.from('admin_provider_keys').update({ is_default }).eq('provider', name);
    if (error) { toast.error(error.message); return; }
    fetchAll();
  };

  const toggleActive = async (id, is_active) => {
    const { error } = await supabase.from('admin_provider_keys').update({ is_active }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success(is_active ? 'Key enabled' : 'Key disabled');
    fetchAll();
  };

  const deleteKey = async (id, provider) => {
    const { error } = await supabase.from('admin_provider_keys').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Key removed');
    fetchAll();
  };

  if (loading) return <div className="text-[#9CA3AF] text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#F9FAFB]">API Providers</h2>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 text-sm font-medium bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]">+ Add API Key</button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <div className="bg-[#111827] border border-white/10 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-[#F9FAFB] mb-4">Add API Key</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Provider</label>
                <select value={selectedProvider} onChange={e => { setSelectedProvider(e.target.value); setApiKey(''); }}
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED]">
                  <option value="">-- Select a provider --</option>
                  {PROVIDER_DEFS.map(p => (
                    <option key={p.name} value={p.name}>
                      {p.display_name} {hasKey(p.name) ? '(key exists)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDef && (
                <>
                  <div className="bg-[#0A0F1E] rounded-xl p-3 border border-white/5 space-y-2">
                    <p className="text-xs text-[#9CA3AF] leading-relaxed">{selectedDef.description}</p>
                    <div className="text-xs text-[#9CA3AF]">
                      Endpoint: <span className="text-[#F9FAFB] font-mono">{selectedDef.base_url}</span>
                    </div>
                    {selectedDef.key_format && (
                      <div className="text-xs text-[#9CA3AF]">
                        Key format: <span className="text-[#F9FAFB] font-mono">{selectedDef.key_format}***</span>
                      </div>
                    )}
                    <a href={selectedDef.get_key_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#7C3AED] hover:underline font-medium block">
                      Create API key at {selectedDef.display_name} →
                    </a>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">API Key</label>
                    <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                      placeholder={selectedDef.key_placeholder}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0F1E] border border-white/10 text-[#F9FAFB] outline-none focus:border-[#7C3AED] font-mono" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-medium bg-white/5 border border-white/10 text-[#9CA3AF] rounded-lg hover:bg-white/10">Cancel</button>
                    <button onClick={saveProviderWithKey} className="flex-1 py-2.5 text-sm font-medium bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]">
                      Save {selectedDef.display_name} Key
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {PROVIDER_DEFS.map(def => {
          const dbProvider = providers.find(p => p.name === def.name);
          const providerKeys = keys.filter(k => k.provider === def.name);
          const isActive = providerKeys.some(k => k.is_active);
          const isDefault = providerKeys.some(k => k.is_default);
          const firstKey = providerKeys[0];

          return (
            <div key={def.name} className="bg-[rgba(17,24,39,0.8)] border border-white/10 rounded-xl overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#F9FAFB]">{def.display_name}</span>
                    {isDefault && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#7C3AED]/20 text-[#7C3AED]">DEFAULT</span>
                    )}
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {isActive ? 'Active' : 'No Key'}
                    </span>
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-0.5 truncate">{def.description}</div>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  {firstKey && (
                    <>
                      <button onClick={() => toggleDefault(def.name, !isDefault)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg ${isDefault ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : 'bg-white/5 text-[#9CA3AF] hover:bg-white/10'}`}>
                        {isDefault ? 'Default' : 'Set Default'}
                      </button>
                      <button onClick={() => toggleActive(firstKey.id, !firstKey.is_active)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg ${firstKey.is_active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                        {firstKey.is_active ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => deleteKey(firstKey.id, def.name)}
                        className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">Remove</button>
                    </>
                  )}
                  {!firstKey && (
                    <button onClick={() => { setSelectedProvider(def.name); setShowAdd(true); }}
                      className="px-3 py-1.5 text-xs font-medium bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]">Add Key</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
