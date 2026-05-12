import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { t2iModels, i2iModels, t2vModels, i2vModels, v2vModels, lipsyncModels } from '@/packages/studio/src/models.js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Free models (no credit cost on Muapi)
const FREE_MODEL_IDS = new Set([
  'flux-schnell', 'sdxl-image', 'wan2.1-text-to-image', 'wan2.5-text-to-image',
  'wan2.1-image-to-video', 'wan2.2-image-to-video', 'wan2.5-image-to-video',
  'hunyuan-image-to-video', 'wan2.2-speech-to-video', 'sync-lipsync',
  'latent-sync', 'ai-background-remover', 'ai-image-extension',
]);

const MODEL_CATEGORIES = {
  'text-to-image': { models: t2iModels, type: 'image' },
  'image-to-image': { models: i2iModels, type: 'image' },
  'inpaint': { models: i2iModels, type: 'image' },
  'text-to-video': { models: t2vModels, type: 'video' },
  'image-to-video': { models: i2vModels, type: 'video' },
  'portrait': { models: lipsyncModels, type: 'lipsync' },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const plan = searchParams.get('plan') || 'free';

  try {
    const { data: activeKeys } = await supabase
      .from('admin_provider_keys')
      .select('provider')
      .eq('is_active', true);

    const activeProviders = new Set((activeKeys || []).map(k => k.provider));
    // Muapi is always available
    activeProviders.add('muapi');

    let allModels = [];

    // Map category to correct model list
    for (const [category, config] of Object.entries(MODEL_CATEGORIES)) {
      if (type && category !== type) continue;
      if (type === 'image' && !['text-to-image', 'image-to-image', 'inpaint'].includes(category)) continue;
      if (type === 'video' && !['text-to-image', 'image-to-video'].includes(category)) continue;

      for (const model of config.models) {
        if (plan === 'free' && !FREE_MODEL_IDS.has(model.id)) continue;
        allModels.push({
          id: model.id,
          name: model.name,
          endpoint: model.endpoint || model.id,
          provider: 'muapi',
          type: config.type,
          cost: FREE_MODEL_IDS.has(model.id) ? 'free' : 'paid',
          category,
        });
      }
    }

    return NextResponse.json({
      models: allModels,
      count: allModels.length,
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
