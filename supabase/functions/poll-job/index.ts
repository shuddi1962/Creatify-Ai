import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { getSupabaseClient, getServiceClient } from '../_shared/supabase.ts';
import { getApiKey, pollMuapiResult } from '../_shared/muapi.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const supabase = getSupabaseClient(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { request_id } = await req.json();
    if (!request_id) {
      return new Response(JSON.stringify({ error: 'Missing request_id' }), { status: 400, headers: corsHeaders });
    }

    const apiKey = await getApiKey(supabase, user.id);
    const result = await pollMuapiResult(request_id, apiKey);

    const outputUrl = result.outputs?.[0] || result.url || result.output?.url;

    const serviceClient = getServiceClient();
    await serviceClient.from('pending_jobs')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('request_id', request_id)
      .eq('user_id', user.id);

    const generationType = result.type || 'image';
    const updateField = generationType === 'video' || generationType === 'i2v' || generationType === 'v2v'
      ? { video_url: outputUrl, status: 'completed' }
      : { image_url: outputUrl, status: 'completed' };

    await serviceClient.from('generations')
      .update({ ...updateField, updated_at: new Date().toISOString() })
      .eq('metadata->>request_id', request_id);

    return new Response(JSON.stringify({ ...result, url: outputUrl }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
