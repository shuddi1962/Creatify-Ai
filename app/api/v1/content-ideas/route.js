import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function generateHashtags(niche) {
  const n = niche?.toLowerCase().replace(/\s+/g, '') || 'content';
  return [`#${n}`, `#${n}tips`, '#viral', '#trending', '#fyp'];
}

async function fetchKeysFromDB() {
  if (!SUPABASE_URL || !SERVICE_KEY) return {};
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data } = await supabase
      .from('admin_provider_keys')
      .select('provider, encrypted_key')
      .in('provider', ['tavily', 'serpapi'])
      .eq('is_active', true);
    const keys = {};
    for (const k of data || []) keys[k.provider] = k.encrypted_key;
    return keys;
  } catch { return {}; }
}

function getAudioForNiche(niche) {
  const map = {
    Fitness: 'Energetic workout music', Fashion: 'Trendy pop',
    Food: 'Cooking beats', Travel: 'Wanderlust vibes',
    Gaming: 'Epic gaming soundtrack', Tech: 'Electronic futuristic',
    Comedy: 'Funny sound effects', Motivation: 'Inspirational speech',
    Education: 'Lo-fi study beats', Pets: 'Cute and playful',
    Beauty: 'Soft glam vibes', Finance: 'Professional podcast',
    Business: 'Corporate motivational',
  };
  return map[niche] || 'Trending viral sound';
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { niche, region, platforms, count = 12 } = body;
  const results = [];

  const dbKeys = await fetchKeysFromDB();
  const tavilyKey = process.env.TAVILY_API_KEY || dbKeys.tavily || '';
  const serpKey = process.env.SERPAPI_API_KEY || dbKeys.serpapi || '';

  if (!tavilyKey && !serpKey) {
    return NextResponse.json({ ideas: [], count: 0, source: 'none' }, { status: 200 });
  }

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
            niche: niche || 'general',
            platform: (platforms || ['TikTok'])[0],
            region: region || 'Global',
            hook: r.title || '',
            script_outline: r.content?.slice(0, 500) || '',
            virality_score: Math.floor(Math.random() * 30) + 70,
            trending_audio: '',
            hashtags: generateHashtags(niche || 'general'),
            source_url: r.url,
            source: 'tavily',
          });
        }
      }
    } catch { /* tavily fallback */ }
  }

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
            niche: niche || 'trending',
            platform: (platforms || ['TikTok'])[0],
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

  if (results.length === 0) {
    return NextResponse.json({ ideas: [], count: 0, source: 'none' }, { status: 200 });
  }

  return NextResponse.json({ ideas: results, count: results.length, source: results[0]?.source || 'none' });
}

export async function GET() {
  return NextResponse.json({ ideas: [], count: 0, message: 'Use POST method with niche, region, and platforms' });
}
