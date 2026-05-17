import { saveGeneration } from '@/src/lib/storage'

function dimensionsFromAR(ar) {
  switch (ar) {
    case '1:1': return [1024, 1024]
    case '16:9': return [1280, 720]
    case '9:16': return [720, 1280]
    case '4:3': return [1152, 864]
    case '3:4': return [864, 1152]
    case '3:2': return [1216, 832]
    case '2:3': return [832, 1216]
    case '21:9': return [1536, 640]
    case '5:4': return [1152, 896]
    case '4:5': return [896, 1152]
    default: return [1024, 1024]
  }
}

function buildPayload(modelEndpoint, params) {
  const [w, h] = dimensionsFromAR(params.aspect_ratio || '1:1')
  const payload = { prompt: params.prompt, width: w, height: h, aspect_ratio: params.aspect_ratio || '1:1' }

  const q = (params.quality || '').toLowerCase()
  const qualityMap = { '720p': 'medium', '1080p': 'high', '480p': 'low', '360p': 'low', '2k': 'high', '4k': 'high', '1k': 'medium', 'hd': 'high', 'standard': 'medium' }
  if (qualityMap[q]) payload.quality = qualityMap[q]
  else if (q === 'high' || q === 'medium' || q === 'low') payload.quality = q

  return payload
}

const PROXY_BASE = '/api/api/v1'

async function apiPost(model, payload, timeoutMs = 60000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${PROXY_BASE}/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (res.status === 402) throw new Error('Muapi: insufficient credits')
    if (!res.ok) {
      let body = ''
      try { body = await res.text() } catch {}
      throw new Error(`Muapi: ${res.status}${body ? ' - ' + body.slice(0, 200) : ''}`)
    }
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

async function pollMuapi(requestId, maxAttempts, interval = 2000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(r => setTimeout(r, interval))
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 15000)
      try {
        const res = await fetch(`${PROXY_BASE}/predictions/${requestId}/result`, {
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        })
        if (!res.ok) {
          if (res.status >= 500) continue
          const text = await res.text().catch(() => '')
          throw new Error(`Muapi: poll ${res.status}${text ? ' - ' + text.slice(0, 100) : ''}`)
        }
        const data = await res.json()
        const status = (data.status || '').toLowerCase()
        if (status === 'completed' || status === 'succeeded' || status === 'success') return data
        if (status === 'failed' || status === 'error') throw new Error(`Muapi: generation failed - ${data.error || 'unknown'}`)
      } finally {
        clearTimeout(timer)
      }
    } catch (e) {
      if (attempt >= maxAttempts - 1) throw e
    }
  }
  throw new Error('Muapi: polling timed out')
}

export async function generateImage({ model, prompt, aspect_ratio, quality, style, numImages, negative_prompt }) {
  const fullPrompt = style && style !== 'Photorealistic' ? `${prompt}, ${style} style` : prompt
  const payload = buildPayload(model, { prompt: fullPrompt, aspect_ratio, quality })
  if (numImages && numImages > 1) payload.num_images = numImages
  if (negative_prompt) payload.negative_prompt = negative_prompt

  const data = await apiPost(model, payload)
  const directUrl = data.outputs?.[0] || data.url || data.output?.url
  if (directUrl) {
    const result = [{ id: `result-${Date.now()}`, url: directUrl, prompt, type: 'image' }]
    saveGeneration({ url: directUrl, prompt, model }, 'image').catch(() => {})
    return result
  }

  const requestId = data.request_id || data.id
  if (requestId) {
    const pollData = await pollMuapi(requestId, 60)
    const pollUrl = pollData.outputs?.[0] || pollData.url || pollData.output?.url
    if (pollUrl) {
      const result = [{ id: `result-${Date.now()}`, url: pollUrl, prompt, type: 'image' }]
      saveGeneration({ url: pollUrl, prompt, model }, 'image').catch(() => {})
      return result
    }
    throw new Error('Muapi: no URL in poll result')
  }

  throw new Error('Muapi: no URL in response')
}

const VALID_DURATIONS = [6, 8, 10, 12, 14, 16, 18, 20]

export async function generateVideo({ model, prompt, aspect_ratio, duration, quality, image_url }) {
  const payload = { prompt: prompt || 'Generate video' }
  if (aspect_ratio) payload.aspect_ratio = aspect_ratio
  if (duration) {
    const d = parseInt(duration)
    payload.duration = VALID_DURATIONS.includes(d) ? d : 10
  }
  if (quality) payload.quality = ({ '720p': 'medium', '1080p': 'high', '480p': 'low', '360p': 'low', '2k': 'high', '4k': 'high', '1k': 'medium' })[quality.toLowerCase()] || quality.toLowerCase()
  if (image_url) payload.image_url = image_url
  payload.width = 1280; payload.height = 720

  const data = await apiPost(model, payload)
  const directUrl = data.outputs?.[0] || data.url || data.output?.url
  if (directUrl) {
    const result = [{ id: `result-${Date.now()}`, url: directUrl, prompt, type: 'video', model }]
    saveGeneration({ url: directUrl, prompt, model, video_url: directUrl }, 'video').catch(() => {})
    return result
  }

  const requestId = data.request_id || data.id
  if (requestId) {
    const pollData = await pollMuapi(requestId, 300)
    const pollUrl = pollData.outputs?.[0] || pollData.url || pollData.output?.url
    if (pollUrl) {
      const result = [{ id: `result-${Date.now()}`, url: pollUrl, prompt, type: 'video', model }]
      saveGeneration({ url: pollUrl, prompt, model, video_url: pollUrl }, 'video').catch(() => {})
      return result
    }
    throw new Error('Muapi: no URL in poll result')
  }

  throw new Error('Muapi: no URL in response')
}
