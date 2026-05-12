import { NextResponse } from 'next/server';

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { hook, niche, platform = 'TikTok', duration = '60s' } = body;
  if (!hook) return NextResponse.json({ error: 'Missing hook' }, { status: 400 });

  const secs = parseInt(duration) || 60;
  const wordCount = Math.floor(secs * 2.5);

  const script = `[HOOK]\n${hook}\n\n[INTRO - ${Math.floor(secs * 0.15)}s]\nHey everyone! Today I'm going to share something that completely changed my perspective on ${niche || 'this topic'}.\n\n[BODY - ${Math.floor(secs * 0.6)}s]\nHere's the thing most people don't realize about ${niche || 'this'}:\n• Point 1: The biggest mistake is overcomplicating it\n• Point 2: Focus on what actually works, not what looks good\n• Point 3: Consistency beats intensity every single time\n\nLet me break this down with a personal example. When I first started with ${niche || 'this'}, I made all the wrong moves. But after ${Math.floor(Math.random() * 12) + 3} months of trial and error, I discovered a simple framework that changed everything.\n\n[CTA - ${Math.floor(secs * 0.25)}s]\nIf you found this helpful, save this video and follow for more ${niche || 'content'} tips. Drop a comment if you've tried this approach — I'd love to hear about your experience!\n\n[Hashtags]\n#${(niche || 'content').toLowerCase().replace(/\s+/g, '')} #tips #growth #${platform.toLowerCase()}`;

  return NextResponse.json({
    script,
    stats: { duration: secs, words: script.split(/\s+/).length, estimated_read_time: `${Math.ceil(wordCount / 150)} min` },
    hook,
    niche: niche || 'general',
    platform,
  });
}
