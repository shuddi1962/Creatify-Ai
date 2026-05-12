import { saveGeneration } from '@/src/lib/storage'

async function proxyCall(provider, endpoint, data) {
  const res = await fetch('/api/v1/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, endpoint, method: 'POST', data }),
  })
  if (!res.ok) {
    const errBody = await res.text()
    let msg = errBody
    try { const j = JSON.parse(errBody); msg = j.error || j.detail || msg } catch {}
    throw { status: res.status, message: msg, provider }
  }
  return res.json()
}

export async function generateImage({ model, prompt, aspect_ratio, quality, style, image_url, strength, numImages = 1, provider }) {
  const fullPrompt = style && style !== 'Photorealistic' ? `${prompt}, ${style} style` : prompt
  const errors = []

  // Try each provider in priority order, starting with the model's preferred provider
  const providers = provider ? [provider, ...['muapi', 'openrouter', 'replicate'].filter(p => p !== provider)] : ['muapi', 'openrouter', 'replicate']

  for (const prov of providers) {
    try {
      if (prov === 'muapi') {
        const res = await fetch(`/api/v1/${model}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: fullPrompt, aspect_ratio: aspect_ratio || '1:1', quality: (quality || 'standard').toLowerCase() }),
        })
        if (res.status === 402) { errors.push('Muapi: insufficient credits'); continue }
        if (!res.ok) { errors.push(`Muapi: ${res.status}`); continue }
        const data = await res.json()
        const url = data.outputs?.[0] || data.url || data.output?.url
        if (url) return [{ id: `result-${Date.now()}`, url, prompt, type: 'image' }]
        errors.push('Muapi: no URL in response')
        continue
      }

      if (prov === 'openrouter') {
        const orModel = model.startsWith('or-') ? model.replace('or-', '') : model
        const response = await proxyCall('openrouter', '/chat/completions', {
          model: orModel.includes('/') ? orModel : `black-forest-labs/${orModel}`,
          messages: [{ role: 'user', content: [{ type: 'text', text: fullPrompt }] }],
          max_tokens: 1000,
        })
        const content = response?.choices?.[0]?.message?.content || ''
        const urlMatch = content.match(/https?:\/\/[^\s)}]+\.(png|jpg|jpeg|webp|gif)/i)
        if (urlMatch) return [{ id: `result-${Date.now()}`, url: urlMatch[0], prompt, type: 'image' }]
        errors.push('OpenRouter: no image URL in response')
        continue
      }

      if (prov === 'replicate') {
        const repModel = model.startsWith('rep-') ? model.replace('rep-', '').replace(/-/g, '/') : 'black-forest-labs/flux-schnell'
        const response = await proxyCall('replicate', '/predictions', {
          input: { prompt: fullPrompt, num_outputs: 1, num_inference_steps: 25 },
        })
        // Poll for result
        let result = response
        if (response.urls?.get) {
          for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 2000))
            const pollRes = await fetch(response.urls.get)
            result = await pollRes.json()
            if (result.status === 'succeeded') break
            if (result.status === 'failed') throw new Error('Replicate: generation failed')
          }
        }
        const url = result?.output?.[0] || result?.outputs?.[0] || result?.url
        if (url) return [{ id: `result-${Date.now()}`, url, prompt, type: 'image' }]
        errors.push('Replicate: no output')
        continue
      }
    } catch (e) {
      errors.push(`${prov}: ${e.message || e.status || 'failed'}`)
      continue
    }
  }

  throw new Error(`Generation failed: ${errors.join('; ')}`)
}

export async function getApiKey() {
  return null
}
