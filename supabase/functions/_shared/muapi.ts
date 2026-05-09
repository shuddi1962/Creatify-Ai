const MUAPI_BASE = 'https://api.muapi.ai';

export async function getApiKey(supabase: any, userId: string): Promise<string> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('encrypted_key')
    .eq('user_id', userId)
    .eq('provider', 'muapi')
    .eq('is_active', true)
    .single();

  if (error || !data) {
    throw new Error('No active Muapi API key found. Please add one in Settings.');
  }

  return data.encrypted_key;
}

export async function proxyToMuapi(
  path: string,
  method: string,
  apiKey: string,
  body?: ArrayBuffer | null,
  contentType?: string,
): Promise<Response> {
  const url = `${MUAPI_BASE}/api/v1/${path}`;
  const headers: Record<string, string> = {
    'x-api-key': apiKey,
  };
  if (contentType) headers['Content-Type'] = contentType;

  const response = await fetch(url, {
    method,
    headers,
    body: method !== 'GET' && body ? body : undefined,
  });

  return response;
}

export async function pollMuapiResult(
  requestId: string,
  apiKey: string,
  maxAttempts = 900,
  interval = 2000,
): Promise<any> {
  const pollUrl = `${MUAPI_BASE}/api/v1/predictions/${requestId}/result`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, interval));

    const response = await fetch(pollUrl, {
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    });

    if (!response.ok) {
      if (response.status >= 500) continue;
      const errText = await response.text();
      throw new Error(`Poll Failed: ${response.status} - ${errText.slice(0, 100)}`);
    }

    const data = await response.json();
    const status = data.status?.toLowerCase();

    if (status === 'completed' || status === 'succeeded' || status === 'success') {
      return data;
    }
    if (status === 'failed' || status === 'error') {
      throw new Error(`Generation failed: ${data.error || 'Unknown error'}`);
    }
  }

  throw new Error('Generation timed out after polling.');
}
