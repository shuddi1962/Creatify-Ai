import { supabase, getSession } from './supabase.js'
import { muapi } from './muapi.js'

let viteSupabaseUrl
try {
  viteSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
} catch {
  viteSupabaseUrl = null
}

const EDGE_FUNCTIONS_URL = viteSupabaseUrl
  ? `${viteSupabaseUrl}/functions/v1`
  : (process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
    : null)

function getEdgeFunctionUrl(name) {
  return EDGE_FUNCTIONS_URL ? `${EDGE_FUNCTIONS_URL}/${name}` : null
}

async function callEdgeFunction(name, options = {}) {
  const url = getEdgeFunctionUrl(name)
  if (!url) {
    return fallbackToDirect(name, options)
  }

  const session = await getSession()
  if (!session) throw new Error('Not authenticated')

  const response = await fetch(url, {
    method: options.method || 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Edge function error: ${response.status} - ${err.slice(0, 200)}`)
  }

  return response.json()
}

async function fallbackToDirect(name, options) {
  switch (name) {
    case 'proxy-api': {
      const key = localStorage.getItem('muapi_key')
      if (!key) throw new Error('API Key missing')
      const path = options.path || ''
      const method = options.method || 'POST'
      const body = options.body

      const url = `${muapi.baseUrl}/api/v1/${path}`
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
        },
        body: body ? JSON.stringify(body) : undefined,
      })
      return response.json()
    }
    case 'upload-file': {
      const key = localStorage.getItem('muapi_key')
      if (!key) throw new Error('API Key missing')
      return muapi.uploadFile(options.file)
    }
    default:
      throw new Error(`No fallback for edge function: ${name}`)
  }
}

export async function generateImage(params) {
  const edgeUrl = getEdgeFunctionUrl('proxy-api')
  if (edgeUrl) {
    return callEdgeFunction('proxy-api', {
      method: 'POST',
      path: `${params.endpoint || params.model}`,
      body: params,
    })
  }
  return muapi.generateImage(params)
}

export async function generateVideo(params) {
  const edgeUrl = getEdgeFunctionUrl('proxy-api')
  if (edgeUrl) {
    return callEdgeFunction('proxy-api', {
      method: 'POST',
      path: `${params.endpoint || params.model}`,
      body: params,
    })
  }
  return muapi.generateVideo(params)
}

export async function generateI2I(params) {
  const edgeUrl = getEdgeFunctionUrl('proxy-api')
  if (edgeUrl) {
    return callEdgeFunction('proxy-api', {
      method: 'POST',
      path: `${params.endpoint || params.model}`,
      body: params,
    })
  }
  return muapi.generateI2I(params)
}

export async function generateI2V(params) {
  const edgeUrl = getEdgeFunctionUrl('proxy-api')
  if (edgeUrl) {
    return callEdgeFunction('proxy-api', {
      method: 'POST',
      path: `${params.endpoint || params.model}`,
      body: params,
    })
  }
  return muapi.generateI2V(params)
}

export async function processV2V(params) {
  const edgeUrl = getEdgeFunctionUrl('proxy-api')
  if (edgeUrl) {
    return callEdgeFunction('proxy-api', {
      method: 'POST',
      path: `${params.endpoint || params.model}`,
      body: params,
    })
  }
  return muapi.processV2V(params)
}

export async function processLipSync(params) {
  const edgeUrl = getEdgeFunctionUrl('proxy-api')
  if (edgeUrl) {
    return callEdgeFunction('proxy-api', {
      method: 'POST',
      path: `${params.endpoint || params.model}`,
      body: params,
    })
  }
  return muapi.processLipSync(params)
}

export async function pollForResult(requestId) {
  const edgeUrl = getEdgeFunctionUrl('poll-job')
  if (edgeUrl) {
    return callEdgeFunction('poll-job', {
      body: { request_id: requestId },
    })
  }
  const key = localStorage.getItem('muapi_key')
  return muapi.pollForResult(requestId, key)
}

export async function uploadFile(file) {
  const edgeUrl = getEdgeFunctionUrl('upload-file')
  if (edgeUrl) {
    const session = await getSession()
    if (!session) throw new Error('Not authenticated')

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(edgeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Upload failed: ${response.status} - ${err.slice(0, 200)}`)
    }

    const data = await response.json()
    return data.url
  }
  return muapi.uploadFile(file)
}

export async function getGenerationHistory(type) {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) throw error
  return data || []
}

export async function saveGeneration(record) {
  const { data, error } = await supabase
    .from('generations')
    .insert(record)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPendingJobs(jobType) {
  let query = supabase
    .from('pending_jobs')
    .select('*')
    .in('status', ['pending', 'processing'])

  if (jobType) {
    query = query.eq('job_type', jobType)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getUploadHistory() {
  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data || []
}

export async function saveUpload(record) {
  const { data, error } = await supabase
    .from('uploads')
    .insert(record)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteUpload(id) {
  const { error } = await supabase
    .from('uploads')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function saveApiKey(encryptedKey) {
  const { data, error } = await supabase
    .from('api_keys')
    .upsert({
      provider: 'muapi',
      encrypted_key: encryptedKey,
      label: 'default',
      is_active: true,
    }, { onConflict: 'user_id, provider, label' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getApiKey() {
  const { data, error } = await supabase
    .from('api_keys')
    .select('encrypted_key')
    .eq('provider', 'muapi')
    .eq('is_active', true)
    .single()

  if (error) return null
  return data.encrypted_key
}
