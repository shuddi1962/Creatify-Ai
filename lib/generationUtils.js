import { saveGeneration } from '@/src/lib/storage'

// Get the shared Muapi key from the server
export async function getApiKey(provider = 'muapi') {
  if (typeof window === 'undefined') return null
  const localKey = localStorage.getItem('muapi_key')
  if (localKey) return localKey
  try {
    const res = await fetch(`/api/v1/shared-key?provider=${provider}`)
    const data = await res.json()
    return data.key || null
  } catch {
    return null
  }
}

// Generate image through the local proxy (avoids CORS issues)
// The middleware rewrites /api/v1/{endpoint} to https://api.muapi.ai/api/v1/{endpoint}
// and adds the x-api-key header from the shared key
export async function generateImage({ model, prompt, aspect_ratio, quality, style, image_url, strength, numImages = 1 }) {
  const fullPrompt = style && style !== 'Photorealistic' ? `${prompt}, ${style} style` : prompt
  const promises = Array(numImages).fill(null).map(() =>
    fetch(`/api/v1/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: fullPrompt,
        aspect_ratio: aspect_ratio || '1:1',
        quality: (quality || 'standard').toLowerCase(),
        image_url: image_url || null,
        strength: strength != null ? strength / 100 : undefined,
      }),
    }).then(r => {
      if (!r.ok) throw new Error(`API error: ${r.status} ${r.statusText}`)
      return r.json()
    })
  )
  const responses = await Promise.all(promises)
  return responses.map((r, i) => ({
    id: `result-${Date.now()}-${i}`,
    url: r.outputs?.[0] || r.url || r.output?.url,
    prompt,
    type: 'image',
  }))
}

export async function generateI2I({ model, prompt, image_url, strength, aspect_ratio, style }) {
  const fullPrompt = style && style !== 'Photorealistic' ? `${prompt}, ${style} style` : prompt
  const response = await fetch(`/api/v1/${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: fullPrompt,
      image_url: image_url,
      strength: (strength || 60) / 100,
      aspect_ratio: aspect_ratio || '1:1',
    }),
  })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  const data = await response.json()
  const url = data.outputs?.[0] || data.url || data.output?.url
  if (!url) throw new Error('No image URL in response')
  return [{ id: `result-${Date.now()}`, url, prompt, type: 'image' }]
}

export async function generateVideo({ model, prompt, aspect_ratio, duration, quality, image_url }) {
  const body = {
    prompt,
    aspect_ratio: aspect_ratio || '16:9',
    duration: parseInt(duration) || 5,
    quality: (quality || '720p').toLowerCase(),
  }
  if (image_url) body.image_url = image_url

  const response = await fetch(`/api/v1/${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  const data = await response.json()
  const url = data.outputs?.[0] || data.url || data.output?.url
  if (!url) throw new Error('No video URL in response')
  return [{ id: `result-${Date.now()}`, url, prompt, type: 'video' }]
}

export async function generateLipSync({ image_url, video_url, audio_url, model, prompt }) {
  const body = { audio_url }
  if (image_url) body.image_url = image_url
  if (video_url) body.video_url = video_url
  if (prompt) body.prompt = prompt

  const response = await fetch(`/api/v1/${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  const data = await response.json()
  const url = data.outputs?.[0] || data.url || data.output?.url
  if (!url) throw new Error('No video URL in response')
  return [{ id: `result-${Date.now()}`, url, prompt, type: 'video' }]
}

export const DEMO_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4'
export const DEMO_AUDIO_URL = 'https://www.w3schools.com/html/movie.mp3'
