import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { getSupabaseClient, getServiceClient } from '../_shared/supabase.ts';
import { getApiKey, proxyToMuapi } from '../_shared/muapi.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const supabase = getSupabaseClient(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/proxy-api\//, '');
    const search = url.search;

    const fullPath = `${path}${search}`;
    const apiKey = await getApiKey(supabase, user.id);
    const body = req.method !== 'GET' ? await req.arrayBuffer() : null;
    const contentType = req.headers.get('Content-Type') || undefined;

    const muapiResponse = await proxyToMuapi(fullPath, req.method, apiKey, body, contentType);
    const data = await muapiResponse.json();

    const serviceClient = getServiceClient();
    if (req.method === 'POST' && data.request_id) {
      const model = path.split('/')[0];
      const generationType = path.includes('video') || path.includes('i2v') || path.includes('v2v') || path.includes('lipsync') ? 'video' : 'image';

      await serviceClient.from('generations').insert({
        user_id: user.id,
        type: generationType,
        model,
        prompt: url.searchParams.get('prompt') || '',
        status: 'processing',
        metadata: { request_id: data.request_id, path },
      });

      await serviceClient.from('pending_jobs').insert({
        user_id: user.id,
        request_id: data.request_id,
        job_type: generationType,
        model,
        params: { path, prompt: url.searchParams.get('prompt') || '' },
        status: 'processing',
      });
    }

    return new Response(JSON.stringify(data), {
      status: muapiResponse.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
