'use client';

import { ChevronDown } from 'lucide-react';

const IMAGE_MODELS = [
  { id: 'gpt-image-2', name: 'GPT Image 2', badge: 'NEW' },
  { id: 'nano-banana-pro', name: 'Nano Banana Pro', badge: 'TOP' },
  { id: 'nano-banana', name: 'Nano Banana 2', badge: 'TOP' },
  { id: 'flux-dev', name: 'Flux Kontext', badge: null },
  { id: 'flux-dev-lora', name: 'Flux Dev Lora', badge: null },
  { id: 'seedream-5', name: 'Seedream 5.0', badge: null },
  { id: 'midjourney-v7', name: 'Midjourney v7', badge: 'TOP' },
  { id: 'ideogram-v3', name: 'Ideogram v3', badge: null },
  { id: 'gpt-image-1.5', name: 'GPT Image 1.5', badge: null },
  { id: 'sdxl', name: 'SDXL', badge: null },
];

const VIDEO_MODELS = [
  { id: 'seedance-2', name: 'Seedance 2.0', badge: 'TOP' },
  { id: 'kling-3', name: 'Kling 3.0', badge: 'TOP' },
  { id: 'sora-2', name: 'Sora 2', badge: 'NEW' },
  { id: 'veo-3', name: 'Veo 3.1', badge: 'NEW' },
  { id: 'wan-2.6', name: 'WAN 2.6', badge: null },
  { id: 'hailuo-02', name: 'MiniMax Hailuo 02', badge: null },
  { id: 'runway-gen3', name: 'Runway Gen-3', badge: null },
  { id: 'hunyuan-video', name: 'Hunyuan Video', badge: null },
  { id: 'grok-t2v', name: 'Grok T2V', badge: 'NEW' },
  { id: 'wan-2.1', name: 'Midjourney I2V', badge: null },
];

const AUDIO_MODELS = [
  { id: 'elevenlabs', name: 'ElevenLabs', badge: 'TOP' },
  { id: 'openai-tts', name: 'OpenAI TTS', badge: null },
  { id: 'muapi-voice', name: 'Muapi Voice', badge: null },
  { id: 'suno', name: 'Suno', badge: 'NEW' },
  { id: 'udio', name: 'Udio', badge: null },
];

const LIPSYNC_MODELS = [
  { id: 'infinite-talk', name: 'Infinite Talk', badge: 'TOP' },
  { id: 'ltx-2.3', name: 'LTX 2.3 Lipsync', badge: null },
  { id: 'ltx-2-19b', name: 'LTX 2 19B', badge: null },
  { id: 'sync-lipsync', name: 'Sync Lipsync', badge: null },
  { id: 'latentsync', name: 'LatentSync', badge: null },
  { id: 'veed-lipsync', name: 'Veed Lipsync', badge: null },
  { id: 'creatify-lipsync', name: 'Creatify Lipsync', badge: null },
];

export default function ModelSelector({ value, onChange, type = 'image' }) {
  const models = type === 'video' ? VIDEO_MODELS : type === 'audio' ? AUDIO_MODELS : type === 'lipsync' ? LIPSYNC_MODELS : IMAGE_MODELS;
  const selected = models.find(m => m.id === value) || models[0];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-white cursor-pointer hover:bg-[#222] transition-all"
      >
        {models.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
    </div>
  );
}
