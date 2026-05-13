import { getModelByEndpoint } from '@/packages/studio/src/models'
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
  payload.quality = q === 'hd' || q === '4k' || q === 'high' ? 'high' : 'medium'

  return payload
}

function fetchWithTimeout(url, options, ms = 30000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms)),
  ])
}

export async function generateImage({ model, prompt, aspect_ratio, quality, style }) {
  const fullPrompt = style && style !== 'Photorealistic' ? `${prompt}, ${style} style` : prompt
  const payload = buildPayload(model, { prompt: fullPrompt, aspect_ratio, quality })

  const res = await fetchWithTimeout(`/api/v1/${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 402) throw new Error('Muapi: insufficient credits')
  if (!res.ok) {
    let body = ''
    try { body = await res.text() } catch {}
    throw new Error(`Muapi: ${res.status}${body ? ' - ' + body.slice(0, 200) : ''}`)
  }

  const data = await res.json()
  const directUrl = data.outputs?.[0] || data.url || data.output?.url
  if (directUrl) {
    const result = [{ id: `result-${Date.now()}`, url: directUrl, prompt, type: 'image' }]
    saveGeneration({ url: directUrl, prompt, model }, 'image').catch(() => {})
    return result
  }

  const requestId = data.request_id || data.id
  if (requestId) {
    let fails = 0
    for (let attempt = 0; attempt < 60; attempt++) {
      await new Promise(r => setTimeout(r, 2000))
      try {
        const pollRes = await fetchWithTimeout(`/api/v1/predictions/${requestId}/result`, {}, 10000)
        if (!pollRes.ok) { fails++; if (fails > 5) throw new Error('Muapi: poll failed too many times'); continue }
        fails = 0
        const pollData = await pollRes.json()
        const status = (pollData.status || '').toLowerCase()
        if (status === 'completed' || status === 'succeeded' || status === 'success') {
          const pollUrl = pollData.outputs?.[0] || pollData.url || pollData.output?.url
          if (pollUrl) {
            const result = [{ id: `result-${Date.now()}`, url: pollUrl, prompt, type: 'image' }]
            saveGeneration({ url: pollUrl, prompt, model }, 'image').catch(() => {})
            return result
          }
          throw new Error('Muapi: no URL in poll result')
        }
        if (status === 'failed' || status === 'error') {
          throw new Error(`Muapi: generation failed - ${pollData.error || 'unknown'}`)
        }
      } catch (e) {
        fails++
        if (fails > 5) throw e
      }
    }
    throw new Error('Muapi: polling timed out')
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
  if (quality) payload.quality = quality.toLowerCase()
  if (image_url) payload.image_url = image_url
  payload.width = 1280; payload.height = 720

  const res = await fetchWithTimeout(`/api/v1/${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 402) throw new Error('Muapi: insufficient credits')
  if (!res.ok) {
    let body = ''
    try { body = await res.text() } catch {}
    throw new Error(`Muapi: ${res.status}${body ? ' - ' + body.slice(0, 200) : ''}`)
  }

  const data = await res.json()
  const directUrl = data.outputs?.[0] || data.url || data.output?.url
  if (directUrl) {
    const result = [{ id: `result-${Date.now()}`, url: directUrl, prompt, type: 'video', model }]
    saveGeneration({ url: directUrl, prompt, model, video_url: directUrl }, 'video').catch(() => {})
    return result
  }

  const requestId = data.request_id || data.id
  if (requestId) {
    let fails = 0
    for (let attempt = 0; attempt < 300; attempt++) {
      await new Promise(r => setTimeout(r, 2000))
      try {
        const pollRes = await fetchWithTimeout(`/api/v1/predictions/${requestId}/result`, {}, 15000)
        if (!pollRes.ok) { fails++; if (fails > 10) throw new Error('Muapi: poll failed'); continue }
        fails = 0
        const pollData = await pollRes.json()
        const status = (pollData.status || '').toLowerCase()
        if (status === 'completed' || status === 'succeeded' || status === 'success') {
          const pollUrl = pollData.outputs?.[0] || pollData.url || pollData.output?.url
          if (pollUrl) {
            const result = [{ id: `result-${Date.now()}`, url: pollUrl, prompt, type: 'video', model }]
            saveGeneration({ url: pollUrl, prompt, model, video_url: pollUrl }, 'video').catch(() => {})
            return result
          }
          throw new Error('Muapi: no URL in poll result')
        }
        if (status === 'failed' || status === 'error') {
          throw new Error(`Muapi: generation failed - ${pollData.error || 'unknown'}`)
        }
      } catch (e) {
        fails++
        if (fails > 10) throw e
      }
    }
    throw new Error('Muapi: polling timed out')
  }

  throw new Error('Muapi: no URL in response')
}
