import { NextResponse } from 'next/server';

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { niche, region, platforms, count = 12 } = body;

  const results = [];

  // Try to use admin-configured keys from the database
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let tavilyKey = process.env.TAVILY_API_KEY || '';
  let serpKey = process.env.SERPAPI_API_KEY || '';

  // Try fetching from Supabase admin_provider_keys if no env vars set
  if ((!tavilyKey || !serpKey) && supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/admin_provider_keys?select=provider,encrypted_key&is_active=eq.true`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
      });
      if (res.ok) {
        const keys = await res.json();
        for (const k of keys || []) {
          if (k.provider === 'tavily' && !tavilyKey) tavilyKey = k.encrypted_key;
          if (k.provider === 'serpapi' && !serpKey) serpKey = k.encrypted_key;
        }
      }
    } catch { /* db unavailable, use env fallback */ }
  }

  // Try Tavily API for real trend data
  if (tavilyKey) {
    try {
      const query = niche
        ? `trending ${niche} content ideas ${(platforms || ['TikTok'])[0]} social media`
        : `trending content ideas viral ${(platforms || ['TikTok'])[0]} ${region || 'worldwide'}`;

      const tavilyRes = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: tavilyKey, query,
          search_depth: 'advanced', max_results: Math.min(count, 20),
          include_answer: true,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (tavilyRes.ok) {
        const tavilyData = await tavilyRes.json();
        for (const r of (tavilyData.results || []).slice(0, count)) {
          results.push({
            niche: niche || 'general', platform: (platforms || ['TikTok'])[0],
            region: region || 'Global',
            hook: r.title || '',
            script_outline: r.content?.slice(0, 500) || '',
            virality_score: Math.floor(Math.random() * 30) + 70,
            trending_audio: '',
            hashtags: generateHashtags(niche || 'general'),
            source_url: r.url, source: 'tavily',
          });
        }
      }
    } catch { /* tavily fallback */ }
  }

  // Try Google Trends via SerpAPI
  if (serpKey && results.length < count) {
    try {
      const trendsRes = await fetch(
        `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(niche || 'trending')}&api_key=${serpKey}&data_type=TIMESERIES`,
        { signal: AbortSignal.timeout(10000) }
      );
      if (trendsRes.ok) {
        const trendsData = await trendsRes.json();
        const topics = trendsData?.interest_over_time?.timeline_data || [];
        for (const topic of topics.slice(0, count - results.length)) {
          results.push({
            niche: niche || 'trending', platform: (platforms || ['TikTok'])[0],
            region: region || 'Global',
            hook: `${topic.title || niche || 'Trend Topic'} — surging in interest`,
            script_outline: topic.values?.[0]?.extracted_value
              ? `This topic has ${topic.values[0].extracted_value} search interest. Create content around it now.`
              : `Trending topic in ${niche || 'general'} — create relevant content`,
            virality_score: topic.values?.[0]?.extracted_value
              ? Math.min(parseInt(topic.values[0].extracted_value), 99)
              : Math.floor(Math.random() * 40) + 60,
            trending_audio: '', hashtags: generateHashtags(niche || 'trending'),
            source: 'google-trends',
          });
        }
      }
    } catch { /* serpapi fallback */ }
  }

  // Fallback: generate diverse AI ideas based on niche
  if (results.length === 0) {
    const niches = niche ? [niche] : [
      'Fitness', 'Fashion', 'Finance', 'Food', 'Travel', 'Gaming', 'Beauty',
      'Tech', 'Crypto', 'Parenting', 'Pets', 'Comedy', 'Motivation', 'Education',
    ];
    const hooks = [
      'Stop doing this if you want results in {niche}',
      'The {niche} hack that changed everything for me',
      'Why everyone is switching to this {niche} method',
      'I tried this for 30 days — here\'s what happened',
      'The one thing nobody tells you about {niche}',
      'This {niche} tip will save you hours',
      'The truth about {niche} that no one talks about',
      'How I mastered {niche} in 7 days',
    ];
    for (let i = 0; i < Math.min(count, 12); i++) {
      const n = niches[i % niches.length];
      results.push({
        niche: n, platform: (platforms || ['TikTok', 'Instagram', 'YouTube'])[i % 3],
        region: region || 'Global',
        hook: hooks[i % hooks.length].replace('{niche}', n.toLowerCase()),
        script_outline: `Content strategy for ${n} audience focusing on trending topics and viral angles`,
        virality_score: Math.floor(Math.random() * 25) + 75,
        trending_audio: getAudioForNiche(n),
        hashtags: generateHashtags(n),
        source: 'ai-generated',
      });
    }
  }

  return NextResponse.json({ ideas: results, count: results.length, source: results[0]?.source || 'fallback' });
}

function generateHashtags(niche) {
  const n = niche?.toLowerCase().replace(/\s+/g, '') || 'content';
  return [`#${n}`, `#${n}tips`, '#viral', '#trending', '#fyp'];
}

function getAudioForNiche(niche) {
  const map = {
    Fitness: 'Energetic workout music',
    Fashion: 'Trendy pop', Food: 'Cooking beats',
    Travel: 'Wanderlust vibes', Gaming: 'Epic gaming soundtrack',
    Tech: 'Electronic futuristic', Comedy: 'Funny sound effects',
    Motivation: 'Inspirational speech', Education: 'Lo-fi study beats',
    Pets: 'Cute and playful', Beauty: 'Soft glam vibes',
    Finance: 'Professional podcast', Business: 'Corporate motivational',
  };
  return map[niche] || 'Trending viral sound';
}

export async function GET(request) {
  return NextResponse.json({ ideas: [], count: 0, source: 'use POST method' });
}
