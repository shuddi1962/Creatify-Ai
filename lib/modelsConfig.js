// Curated Muapi models for frontend displays
// Loaded from the actual Muapi model definitions

const MODEL_META = {
  'flux-schnell': { cost: 'free', quality: 'HD', badge: null },
  'sdxl-image': { cost: 'free', quality: 'HD', badge: null },
  'wan2.1-text-to-image': { cost: 'free', quality: 'HD', badge: 'NEW' },
  'wan2.5-text-to-image': { cost: 'free', quality: 'HD', badge: 'NEW' },
  'gpt-image-2': { cost: 'paid', quality: '4K', badge: 'NEW' },
  'midjourney-v7-text-to-image': { cost: 'paid', quality: '4K', badge: 'TOP' },
  'nano-banana-2': { cost: 'paid', quality: 'HD', badge: null },
  'seedream-5.0': { cost: 'paid', quality: 'HD', badge: null },
  'ideogram-v3-t2i': { cost: 'paid', quality: 'HD', badge: null },
  'bytedance-seedream-v4.5': { cost: 'paid', quality: '4K', badge: 'NEW' },
  'flux-2-dev': { cost: 'paid', quality: 'HD', badge: 'NEW' },
  'flux-2-pro': { cost: 'paid', quality: '4K', badge: 'NEW' },
  'flux-kontext-dev-t2i': { cost: 'paid', quality: 'HD', badge: null },
  'grok-imagine-text-to-image': { cost: 'paid', quality: 'HD', badge: null },
  'google-imagen4': { cost: 'paid', quality: '4K', badge: null },
  'google-imagen4-ultra': { cost: 'paid', quality: '4K', badge: 'TOP' },
  'kling-o1-text-to-image': { cost: 'paid', quality: 'HD', badge: 'NEW' },
  'hunyuan-image-3.0': { cost: 'free', quality: 'HD', badge: null },
  'qwen-image': { cost: 'free', quality: 'HD', badge: null },
  'gpt4o-text-to-image': { cost: 'paid', quality: 'HD', badge: null },
  'wan2.6-text-to-image': { cost: 'free', quality: 'HD', badge: 'NEW' },
  'z-image-base': { cost: 'free', quality: 'HD', badge: null },
  'nano-banana-pro': { cost: 'paid', quality: '4K', badge: 'TOP' },
  'flux-2-klein-9b': { cost: 'free', quality: 'HD', badge: 'NEW' },
  'minimax-image-01': { cost: 'paid', quality: 'HD', badge: null },
};

export function getModels(type = 'image', plan = 'free') {
  let list = [...(type === 'image' ? IMAGE_MODELS : type === 'video' ? VIDEO_MODELS : LIPSYNC_MODELS)];

  if (plan === 'free') {
    list = list.filter(m => getModelCost(m.id) === 'free');
  }

  return list;
}

export function getModelCost(id) {
  return MODEL_META[id]?.cost || 'paid';
}

export function getModelQuality(id) {
  return MODEL_META[id]?.quality || 'HD';
}

export function getModelBadge(id) {
  return MODEL_META[id]?.badge || null;
}

export const IMAGE_MODELS = [
  // Muapi models (needs credits - works when Muapi has balance)
  { id: 'flux-schnell-image', name: 'Flux Schnell', provider: 'muapi', cost: 'free', endpoint: 'flux-schnell-image' },
  { id: 'sdxl-image', name: 'SDXL', provider: 'muapi', cost: 'free', endpoint: 'sdxl-image' },
  { id: 'hunyuan-image-3.0', name: 'Hunyuan 3.0', provider: 'muapi', cost: 'free', endpoint: 'hunyuan-image-3.0' },
  { id: 'wan2.6-text-to-image', name: 'WAN 2.6', provider: 'muapi', cost: 'free', endpoint: 'wan2.6-text-to-image' },
  { id: 'qwen-image', name: 'Qwen', provider: 'muapi', cost: 'free', endpoint: 'qwen-image' },
  { id: 'gpt-image-2', name: 'GPT Image 2', provider: 'muapi', cost: 'paid', endpoint: 'gpt-image-2-text-to-image' },
  { id: 'midjourney-v7-text-to-image', name: 'Midjourney v7', provider: 'muapi', cost: 'paid', endpoint: 'midjourney-v7-text-to-image' },
  { id: 'nano-banana-2', name: 'Nano Banana 2', provider: 'muapi', cost: 'paid', endpoint: 'nano-banana-2' },
  { id: 'seedream-5.0', name: 'Seedream 5.0', provider: 'muapi', cost: 'paid', endpoint: 'seedream-5.0' },
  { id: 'flux-2-pro', name: 'Flux 2 Pro', provider: 'muapi', cost: 'paid', endpoint: 'flux-2-pro' },
];

export const VIDEO_MODELS = [
  { id: 'wan2.1-image-to-video', name: 'WAN 2.1', endpoint: 'wan2.1-image-to-video' },
  { id: 'wan2.2-image-to-video', name: 'WAN 2.2', endpoint: 'wan2.2-image-to-video' },
  { id: 'wan2.5-image-to-video', name: 'WAN 2.5', endpoint: 'wan2.5-image-to-video' },
  { id: 'wan2.6-image-to-video', name: 'WAN 2.6', endpoint: 'wan2.6-image-to-video' },
  { id: 'hunyuan-image-to-video', name: 'Hunyuan Video', endpoint: 'hunyuan-image-to-video' },
  { id: 'kling-v2.1-standard-i2v', name: 'Kling 2.1 Std', endpoint: 'kling-v2.1-standard-i2v' },
  { id: 'kling-v2.1-pro-i2v', name: 'Kling 2.1 Pro', endpoint: 'kling-v2.1-pro-i2v' },
  { id: 'kling-v3.0-standard-image-to-video', name: 'Kling 3.0 Std', endpoint: 'kling-v3.0-standard-image-to-video' },
  { id: 'kling-v3.0-pro-image-to-video', name: 'Kling 3.0 Pro', endpoint: 'kling-v3.0-pro-image-to-video' },
  { id: 'seedance-pro-i2v', name: 'Seedance Pro', endpoint: 'seedance-pro-i2v' },
  { id: 'seedance-v2.0-i2v', name: 'Seedance 2.0', endpoint: 'seedance-v2.0-i2v' },
  { id: 'veo3-image-to-video', name: 'Veo 3', endpoint: 'veo3-image-to-video' },
  { id: 'veo3.1-image-to-video', name: 'Veo 3.1', endpoint: 'veo3.1-image-to-video' },
  { id: 'minimax-hailuo-02-standard-i2v', name: 'MiniMax Standard', endpoint: 'minimax-hailuo-02-standard-i2v' },
  { id: 'minimax-hailuo-02-pro-i2v', name: 'MiniMax Pro', endpoint: 'minimax-hailuo-02-pro-i2v' },
  { id: 'openai-sora-2-image-to-video', name: 'Sora 2', endpoint: 'openai-sora-2-image-to-video' },
  { id: 'runway-image-to-video', name: 'Runway Gen-3', endpoint: 'runway-image-to-video' },
  { id: 'midjourney-v7-image-to-video', name: 'Midjourney I2V', endpoint: 'midjourney-v7-image-to-video' },
  { id: 'ltx-2-fast-image-to-video', name: 'LTX 2 Fast', endpoint: 'ltx-2-fast-image-to-video' },
  { id: 'pixverse-v5-i2v', name: 'Pixverse v5', endpoint: 'pixverse-v5-i2v' },
  { id: 'vidu-v2.0-i2v', name: 'Vidu v2.0', endpoint: 'vidu-v2.0-i2v' },
];

export const LIPSYNC_MODELS = [
  { id: 'infinitetalk-image-to-video', name: 'Infinite Talk', endpoint: 'infinitetalk-image-to-video' },
  { id: 'wan2.2-speech-to-video', name: 'WAN 2.2 Speech', endpoint: 'wan2.2-speech-to-video' },
  { id: 'sync-lipsync', name: 'Sync Lipsync', endpoint: 'sync-lipsync' },
  { id: 'latent-sync', name: 'LatentSync', endpoint: 'latentsync-video' },
  { id: 'creatify-lipsync', name: 'Creatify Lipsync', endpoint: 'creatify-lipsync' },
  { id: 'ltx-2.3-lipsync', name: 'LTX 2.3 Lipsync', endpoint: 'ltx-2.3-lipsync' },
  { id: 'ltx-2-19b-lipsync', name: 'LTX 2 19B', endpoint: 'ltx-2-19b-lipsync' },
  { id: 'veed-lipsync', name: 'Veed Lipsync', endpoint: 'veed-lipsync' },
];
