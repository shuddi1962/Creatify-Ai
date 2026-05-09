import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { getSupabaseClient, getServiceClient } from '../_shared/supabase.ts';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const supabase = getSupabaseClient(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400, headers: corsHeaders });
    }

    const ext = file.name.split('.').pop() || 'bin';
    const fileName = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500, headers: corsHeaders });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    const serviceClient = getServiceClient();
    await serviceClient.from('uploads').insert({
      user_id: user.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: fileName,
      public_url: publicUrl,
    });

    return new Response(JSON.stringify({ url: publicUrl }), {
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
