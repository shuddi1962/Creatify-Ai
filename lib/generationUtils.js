export async function generateImage({ model, prompt, aspect_ratio, quality, style }) {
  const fullPrompt = style && style !== 'Photorealistic' ? `${prompt}, ${style} style` : prompt

  const res = await fetch(`/api/v1/${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: fullPrompt, aspect_ratio: aspect_ratio || '1:1', quality: (quality || 'standard').toLowerCase() }),
  })
  if (res.status === 402) throw new Error('Muapi: insufficient credits')
  if (!res.ok) throw new Error(`Muapi: ${res.status}`)

  const data = await res.json()
  const directUrl = data.outputs?.[0] || data.url || data.output?.url
  if (directUrl) return [{ id: `result-${Date.now()}`, url: directUrl, prompt, type: 'image' }]

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
        if (pollUrl) return [{ id: `result-${Date.now()}`, url: pollUrl, prompt, type: 'image' }]
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
