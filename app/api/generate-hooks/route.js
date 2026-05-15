import Anthropic from '@anthropic-ai/sdk'

export async function POST(req) {
  try {
    const { topic, niche, platform, tone, count, hookTypes } = await req.json()

    const typesStr = hookTypes?.join(', ') || 'various'

    const prompt = `You are an expert viral hook writer for social media.

Generate ${count || 10} viral hooks for ${platform || 'TikTok'} content about: "${topic}"
Niche: ${niche || 'General'}
Tone: ${tone || 'Casual'}
Hook types to include: ${typesStr}

Return ONLY a valid JSON array (no markdown, no code fences). Each object must have:
{ "hook": "the hook text", "type": "hook type name", "strength": number 1-5 }

Make each hook attention-grabbing, specific, and scroll-stopping.`

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json({
        hooks: [
          { hook: `What if everything you knew about ${topic} was wrong?`, type: 'Question Hook', strength: 4.8 },
          { hook: `This one ${topic} hack changed everything`, type: 'Bold Statement', strength: 4.6 },
          { hook: `97% of people fail at ${topic} — here's why`, type: 'Shocking Stat', strength: 4.5 },
          { hook: `I tried ${topic} for 30 days — here's what happened`, type: 'Story Hook', strength: 4.9 },
          { hook: `The ${topic} secret nobody talks about`, type: 'Teaser Hook', strength: 4.4 },
        ]
      })
    }

    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text
    const cleaned = text.replace(/```json|```/g, '').trim()

    try {
      const hooks = JSON.parse(cleaned)
      return Response.json({ hooks: Array.isArray(hooks) ? hooks : [] })
    } catch {
      return Response.json({ error: 'Failed to parse hooks' }, { status: 500 })
    }
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
