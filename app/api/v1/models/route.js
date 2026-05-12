import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const PROVIDER_MODELS = {
  muapi: {
    image: [
      { id: 'gpt-image-2', name: 'GPT Image 2', provider: 'muapi', type: 'image', cost: 'paid', quality: '4K', badge: 'NEW' },
      { id: 'nano-banana-pro', name: 'Nano Banana Pro', provider: 'muapi', type: 'image', cost: 'paid', quality: '4K', badge: 'TOP' },
      { id: 'seedream-5', name: 'Seedream 5.0', provider: 'muapi', type: 'image', cost: 'paid', quality: 'HD' },
      { id: 'flux', name: 'Flux', provider: 'muapi', type: 'image', cost: 'free', quality: 'HD' },
      { id: 'flux-kontext', name: 'Flux Kontext', provider: 'muapi', type: 'image', cost: 'paid', quality: 'HD' },
      { id: 'midjourney-v7', name: 'Midjourney v7', provider: 'muapi', type: 'image', cost: 'paid', quality: '4K', badge: 'TOP' },
      { id: 'ideogram-v3', name: 'Ideogram v3', provider: 'muapi', type: 'image', cost: 'paid', quality: 'HD' },
      { id: 'sdxl', name: 'SDXL', provider: 'muapi', type: 'image', cost: 'free', quality: 'HD' },
      { id: 'dalle', name: 'DALL-E', provider: 'muapi', type: 'image', cost: 'paid', quality: 'HD' },
    ],
    video: [
      { id: 'seedance-2', name: 'Seedance 2.0', provider: 'muapi', type: 'video', cost: 'paid', quality: 'HD', badge: 'TOP' },
      { id: 'kling-3', name: 'Kling 3.0', provider: 'muapi', type: 'video', cost: 'paid', quality: 'HD', badge: 'TOP' },
      { id: 'sora-2', name: 'Sora 2', provider: 'muapi', type: 'video', cost: 'paid', quality: 'HD', badge: 'NEW' },
      { id: 'veo-3', name: 'Veo 3.1', provider: 'muapi', type: 'video', cost: 'paid', quality: '4K', badge: 'NEW' },
      { id: 'wan-2-6', name: 'WAN 2.6', provider: 'muapi', type: 'video', cost: 'free', quality: 'HD' },
      { id: 'runway-gen3', name: 'Runway Gen-3', provider: 'muapi', type: 'video', cost: 'paid', quality: 'HD' },
      { id: 'hunyuan', name: 'Hunyuan Video', provider: 'muapi', type: 'video', cost: 'free', quality: 'HD' },
    ],
    lipsync: [
      { id: 'infinite-talk', name: 'Infinite Talk', provider: 'muapi', type: 'lipsync', cost: 'paid', quality: 'HD', badge: 'TOP' },
      { id: 'ltx-23', name: 'LTX 2.3 Lipsync', provider: 'muapi', type: 'lipsync', cost: 'paid', quality: 'HD' },
      { id: 'wan-22', name: 'Wan 2.2 Speech', provider: 'muapi', type: 'lipsync', cost: 'free', quality: 'HD' },
    ],
  },
  openai: {
    image: [
      { id: 'dall-e-3', name: 'DALL-E 3', provider: 'openai', type: 'image', cost: 'paid', quality: 'HD' },
    ],
  },
  stability: {
    image: [
      { id: 'stable-diffusion-3', name: 'Stable Diffusion 3', provider: 'stability', type: 'image', cost: 'paid', quality: 'HD' },
      { id: 'sd-xl', name: 'SDXL', provider: 'stability', type: 'image', cost: 'free', quality: 'HD' },
    ],
  },
  replicate: {
    image: [
      { id: 'flux-schnell', name: 'Flux Schnell', provider: 'replicate', type: 'image', cost: 'free', quality: 'HD' },
      { id: 'flux-pro', name: 'Flux Pro', provider: 'replicate', type: 'image', cost: 'paid', quality: '4K' },
    ],
    video: [
      { id: 'stable-video', name: 'Stable Video', provider: 'replicate', type: 'video', cost: 'free', quality: 'HD' },
    ],
  },
};

const CATEGORIES = [
  { id: 'text-to-image', type: 'image', label: 'Text to Image' },
  { id: 'image-to-image', type: 'image', label: 'Image to Image' },
  { id: 'inpaint', type: 'image', label: 'Inpaint & Edit' },
  { id: 'upscale', type: 'image', label: 'Upscale' },
  { id: 'remove-bg', type: 'image', label: 'Remove Background' },
  { id: 'multi-view', type: 'image', label: 'Multi-View' },
  { id: 'text-to-video', type: 'video', label: 'Text to Video' },
  { id: 'image-to-video', type: 'video', label: 'Image to Video' },
  { id: 'portrait', type: 'lipsync', label: 'Portrait + Audio' },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'image', 'video', 'lipsync', or null for all
  const plan = searchParams.get('plan') || 'free'; // 'free' or 'paid'

  try {
    // Get active providers from database
    const { data: activeKeys } = await supabase
      .from('admin_provider_keys')
      .select('provider')
      .eq('is_active', true);

    const activeProviders = new Set((activeKeys || []).map(k => k.provider));

    // Build model list based on active providers
    let models = [];
    for (const [provider, categories] of Object.entries(PROVIDER_MODELS)) {
      if (!activeProviders.has(provider) && provider !== 'muapi') continue;
      // Muapi is always available (primary provider)
      
      for (const [modelType, modelList] of Object.entries(categories)) {
        if (type && modelType !== type) continue;
        
        for (const model of modelList) {
          // If plan is 'free', only return free models
          if (plan === 'free' && model.cost !== 'free') continue;
          models.push(model);
        }
      }
    }

    return NextResponse.json({
      models,
      count: models.length,
      plan,
      active_providers: Array.from(activeProviders),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  return GET(request);
}
