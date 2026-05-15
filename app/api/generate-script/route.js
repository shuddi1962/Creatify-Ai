import Anthropic from '@anthropic-ai/sdk'

export async function POST(req) {
  try {
    const { topic, hook, niche, platform, duration, style, tone, cta } = await req.json()

    const styleLabel = style?.replace(/_/g, ' ') || 'talking head'
    const wordCount = duration?.includes('s')
      ? parseInt(duration) * 2
      : parseInt(duration) * 120 || 200

    const prompt = `You are an expert social media scriptwriter.

Write a ${duration || '60s'} ${styleLabel} video script for ${platform || 'TikTok'} about: "${topic}"
Niche: ${niche || 'General'}
Tone: ${tone || 'Casual'}
${hook ? `Opening hook (use this): "${hook}"` : 'Write a strong opening hook'}
${cta ? `CTA: "${cta}"` : 'Write an appropriate call to action'}

Return ONLY a valid JSON object with these exact keys (no markdown, no code fences):
{
  "HOOK": "The opening 3-5 seconds that grabs attention",
  "INTRO": "Brief introduction (5-10 seconds)",
  "MAIN CONTENT": "The core value/message (bulk of the script)",
  "TRANSITION": "Bridge to the conclusion",
  "CTA": "The call to action closing"
}

Make it sound natural and conversational. Write approximately ${wordCount} words total.`

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json({
        script: {
          HOOK: hook || `Ever wondered about ${topic}? Here's the truth...`,
          INTRO: `Hey everyone! Today we're diving into ${topic}.`,
          'MAIN CONTENT': `Let me break this down. The first thing about ${topic} is...`,
          TRANSITION: `Now let me show you how to apply this.`,
          CTA: cta || 'Follow for more!',
        }
      })
    }

    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text
    try {
      const script = JSON.parse(text.replace(/```json|```/g, '').trim())
      return Response.json({ script })
    } catch {
      const lines = text.split('\n').filter(l => l.trim())
      return Response.json({
        script: {
          HOOK: lines[0] || '',
          INTRO: lines[1] || '',
          'MAIN CONTENT': lines.slice(2, -2).join('\n') || text,
          TRANSITION: lines[lines.length - 2] || '',
          CTA: cta || 'Follow for more content like this!',
        }
      })
    }
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
