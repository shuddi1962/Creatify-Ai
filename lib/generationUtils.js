import * as muapi from '@/packages/studio/src/muapi'
import { saveGeneration, savePendingJob, removePendingJob } from '@/src/lib/storage'

let cachedDbKey = null

export async function getApiKey(provider = 'muapi') {
  if (typeof window === 'undefined') return null
  // Check localStorage first (user-provided key)
  const localKey = localStorage.getItem('muapi_key')
  if (localKey) return localKey
  // Check database for admin-configured shared key (cached)
  if (cachedDbKey) return cachedDbKey
  try {
    const res = await fetch(`/api/v1/shared-key?provider=${provider}`)
    if (res.ok) {
      const data = await res.json()
      if (data.key) {
        cachedDbKey = data.key
        return cachedDbKey
      }
    }
  } catch { /* server unavailable */ }
  return null
}

export async function generateImage({ model, prompt, aspect_ratio, quality, style, image_url, strength, numImages = 1, onRequestId }) {
  const apiKey = await getApiKey()
  if (apiKey) {
    const fullPrompt = style && style !== 'Photorealistic' ? `${prompt}, ${style} style` : prompt
    const promises = Array(numImages).fill(null).map((_, i) =>
      muapi.generateImage(apiKey, {
        model,
        prompt: fullPrompt,
        aspect_ratio: aspect_ratio || '1:1',
        quality: (quality || 'standard').toLowerCase(),
        image_url: image_url || null,
        strength: strength != null ? strength / 100 : undefined,
        onRequestId,
      })
    )
    const responses = await Promise.all(promises)
    const items = responses.map((r, i) => ({
      id: `result-${Date.now()}-${i}`, url: r.url, prompt, type: 'image'
    }))
    await saveGeneration(items[0], 'image')
    return items
  }
  await new Promise(resolve => setTimeout(resolve, 2000))
  return Array(numImages).fill(null).map((_, i) => ({
    id: `demo-${Date.now()}-${i}`,
    url: `https://picsum.photos/seed/${Date.now() + i}/1024/1024`,
    prompt, type: 'image'
  }))
}

export async function generateI2I({ model, prompt, image_url, strength, aspect_ratio, style }) {
  const apiKey = await getApiKey()
  if (apiKey && image_url) {
    const response = await muapi.generateI2I(apiKey, {
      model,
      prompt: style && style !== 'Photorealistic' ? `${prompt}, ${style} style` : prompt,
      image_url,
      strength: (strength || 60) / 100,
      aspect_ratio: aspect_ratio || '1:1',
    })
    const item = { id: `result-${Date.now()}`, url: response.url, prompt, type: 'image' }
    await saveGeneration(item, 'image')
    return [item]
  }
  await new Promise(resolve => setTimeout(resolve, 2000))
  return [{ id: `demo-${Date.now()}`, url: `https://picsum.photos/seed/${Date.now()}/1024/1024`, prompt, type: 'image' }]
}

export async function generateVideo({ model, prompt, aspect_ratio, duration, quality, image_url, onRequestId }) {
  const apiKey = await getApiKey()
  if (apiKey) {
    const params = { model, prompt, aspect_ratio: aspect_ratio || '16:9', duration: parseInt(duration) || 5, quality: (quality || '720p').toLowerCase(), onRequestId }
    if (image_url) params.image_url = image_url
    const response = await muapi.generateVideo(apiKey, params)
    const item = { id: `result-${Date.now()}`, url: response.url, prompt, type: 'video' }
    await saveGeneration(item, 'video')
    return [item]
  }
  await new Promise(resolve => setTimeout(resolve, 3000))
  return [{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt, type: 'video' }]
}

export async function generateI2V({ model, prompt, image_url, aspect_ratio, duration, quality }) {
  const apiKey = await getApiKey()
  if (apiKey && image_url) {
    const response = await muapi.generateI2V(apiKey, {
      model, prompt: prompt || 'Animate this image',
      image_url, aspect_ratio: aspect_ratio || '16:9',
      duration: parseInt(duration) || 5, quality: (quality || '720p').toLowerCase(),
    })
    const item = { id: `result-${Date.now()}`, url: response.url, prompt, type: 'video' }
    await saveGeneration(item, 'video')
    return [item]
  }
  await new Promise(resolve => setTimeout(resolve, 3000))
  return [{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt, type: 'video' }]
}

export async function generateLipSync({ image_url, video_url, audio_url, model, prompt }) {
  const apiKey = await getApiKey()
  if (apiKey && ((image_url && audio_url) || (video_url && audio_url))) {
    const response = await muapi.processLipSync(apiKey, { model, image_url, video_url, audio_url, prompt })
    const item = { id: `result-${Date.now()}`, url: response.url, prompt, type: 'video' }
    await saveGeneration(item, 'video')
    return [item]
  }
  await new Promise(resolve => setTimeout(resolve, 3000))
  return [{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt, type: 'video' }]
}

export async function generateV2V({ model, video_url, image_url, prompt }) {
  const apiKey = await getApiKey()
  if (apiKey && video_url) {
    const response = await muapi.processV2V(apiKey, { model, video_url, image_url, prompt })
    const item = { id: `result-${Date.now()}`, url: response.url, prompt, type: 'video' }
    await saveGeneration(item, 'video')
    return [item]
  }
  await new Promise(resolve => setTimeout(resolve, 3000))
  return [{ id: `demo-${Date.now()}`, url: 'https://www.w3schools.com/html/mov_bbb.mp4', prompt, type: 'video' }]
}

export async function uploadFile(file) {
  const apiKey = await getApiKey()
  if (!apiKey) return null
  return await muapi.uploadFile(apiKey, file)
}

export const DEMO_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4'
export const DEMO_AUDIO_URL = 'https://www.w3schools.com/html/movie.mp3'
