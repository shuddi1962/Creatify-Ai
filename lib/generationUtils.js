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
  const model = getModelByEndpoint(modelEndpoint)
  const inputs = model?.inputs || {}
  const payload = { prompt: params.prompt }

  const acceptsAR = !!inputs.aspect_ratio
  const acceptsWidth = !!inputs.width
  const acceptsHeight = !!inputs.height
  const acceptsQuality = !!inputs.quality
  const acceptsNum = !!inputs.num_images
  const acceptsResolution = !!inputs.resolution

  if (acceptsAR) {
    payload.aspect_ratio = params.aspect_ratio || '1:1'
  }
  if (acceptsWidth) {
    const [w] = dimensionsFromAR(params.aspect_ratio || '1:1')
    payload.width = w
  }
  if (acceptsHeight) {
    const [, h] = dimensionsFromAR(params.aspect_ratio || '1:1')
    payload.height = h
  }
  if (acceptsQuality) {
    const q = (params.quality || '').toLowerCase()
    payload.quality = q === 'hd' || q === '4k' || q === 'high' ? 'high' : 'basic'
  }
  if (acceptsResolution) {
    payload.resolution = '1080p'
  }
  if (acceptsNum) {
    payload.num_images = 1
  }

  return payload
}

export async function generateImage({ model, prompt, aspect_ratio, quality, style }) {
  const fullPrompt = style && style !== 'Photorealistic' ? `${prompt}, ${style} style` : prompt
  const payload = buildPayload(model, { prompt: fullPrompt, aspect_ratio, quality })

  const res = await fetch(`/api/v1/${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 402) throw new Error('Muapi: insufficient credits')
  if (!res.ok) throw new Error(`Muapi: ${res.status}`)

  const data = await res.json()
  const directUrl = data.outputs?.[0] || data.url || data.output?.url
  if (directUrl) {
    const result = [{ id: `result-${Date.now()}`, url: directUrl, prompt, type: 'image' }]
    saveGeneration({ url: directUrl, prompt, model }, 'image').catch(() => {})
    return result
  }

  const requestId = data.request_id || data.id
  if (requestId) {
    for (let attempt = 0; attempt < 60; attempt++) {
      await new Promise(r => setTimeout(r, 2000))
      const pollRes = await fetch(`/api/v1/predictions/${requestId}/result`)
      if (!pollRes.ok) continue
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
    }
    throw new Error('Muapi: polling timed out')
  }

  throw new Error('Muapi: no URL in response')
}
