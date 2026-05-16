import { supabase, getSession } from './supabase.js'

let _useLocal = null

async function useLocal() {
  if (_useLocal !== null) return _useLocal
  const session = await getSession()
  _useLocal = !session
  return _useLocal
}

export function resetStorageMode() {
  _useLocal = null
}

export async function getAPIKey() {
  if (await useLocal()) {
    return localStorage.getItem('muapi_key')
  }
  const { data, error } = await supabase
    .from('api_keys')
    .select('encrypted_key')
    .eq('provider', 'muapi')
    .eq('is_active', true)
    .single()
  if (error || !data) return localStorage.getItem('muapi_key')
  return data.encrypted_key
}

export async function saveAPIKey(key) {
  localStorage.setItem('muapi_key', key)
  if (!(await useLocal())) {
    await supabase.from('api_keys').upsert({
      provider: 'muapi',
      encrypted_key: key,
      label: 'default',
      is_active: true,
    }, { onConflict: 'user_id, provider, label' })
  }
}

export async function getGenerations(type) {
  if (await useLocal()) {
    const key = type === 'video' ? 'video_history' : 'muapi_history'
    try {
      return JSON.parse(localStorage.getItem(key) || '[]')
    } catch { return [] }
  }
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(30)
  if (error) throw error
  return data || []
}

export async function saveGeneration(entry, type) {
  const key = type === 'video' ? 'video_history' : 'muapi_history'
  const history = JSON.parse(localStorage.getItem(key) || '[]')
  history.unshift({ ...entry, type, created_at: new Date().toISOString() })
  localStorage.setItem(key, JSON.stringify(history.slice(0, 50)))

  if (!(await useLocal())) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await supabase.from('generations').insert({
        user_id: session?.user?.id || null,
        type,
        model: entry.model || '',
        prompt: entry.prompt || '',
        image_url: entry.image_url || entry.url || null,
        video_url: entry.video_url || null,
        status: 'completed',
      })
    } catch {}
  }
}

export async function getUploads() {
  if (await useLocal()) {
    try {
      return JSON.parse(localStorage.getItem('muapi_uploads') || '[]')
    } catch { return [] }
  }
  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data || []
}

export async function saveUpload(entry) {
  if (await useLocal()) {
    const history = JSON.parse(localStorage.getItem('muapi_uploads') || '[]')
    history.unshift(entry)
    localStorage.setItem('muapi_uploads', JSON.stringify(history.slice(0, 20)))
    return
  }
  await supabase.from('uploads').insert({
    file_name: entry.name || '',
    file_type: entry.type || '',
    file_size: entry.size || 0,
    storage_path: entry.storagePath || '',
    public_url: entry.uploadedUrl || entry.url || '',
    thumbnail_url: entry.thumbnail || null,
  })
}

export async function getPendingJobs(studioType) {
  if (await useLocal()) {
    try {
      const all = JSON.parse(localStorage.getItem('muapi_pending_jobs') || '[]')
      return studioType ? all.filter(j => j.studioType === studioType) : all
    } catch { return [] }
  }
  let query = supabase.from('pending_jobs').select('*').in('status', ['pending', 'processing'])
  if (studioType) query = query.eq('job_type', studioType)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function savePendingJob(job) {
  if (await useLocal()) {
    const jobs = JSON.parse(localStorage.getItem('muapi_pending_jobs') || '[]')
      .filter(j => j.requestId !== job.requestId)
    jobs.push(job)
    localStorage.setItem('muapi_pending_jobs', JSON.stringify(jobs))
    return
  }
  await supabase.from('pending_jobs').upsert({
    request_id: job.requestId,
    job_type: job.studioType || 'image',
    model: job.model || '',
    params: job,
    status: 'processing',
  }, { onConflict: 'request_id' })
}

export async function removePendingJob(requestId) {
  if (await useLocal()) {
    const jobs = JSON.parse(localStorage.getItem('muapi_pending_jobs') || '[]')
      .filter(j => j.requestId !== requestId)
    localStorage.setItem('muapi_pending_jobs', JSON.stringify(jobs))
    return
  }
  await supabase.from('pending_jobs').delete().eq('request_id', requestId)
}
