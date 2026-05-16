import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getPlatformLabels() {
  return {
    tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube',
    linkedin: 'LinkedIn', twitter: 'Twitter/X', pinterest: 'Pinterest',
    facebook: 'Facebook',
  };
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const niche = searchParams.get('niche') || '';
  const platform = searchParams.get('platform') || '';
  const region = searchParams.get('region') || '';
  const limit = parseInt(searchParams.get('limit') || '15');

  const dbKeys = await fetchKeysFromDB();
  const tavilyKey = process.env.TAVILY_API_KEY || dbKeys.tavily || '';
  const serpKey = process.env.SERPAPI_API_KEY || dbKeys.serpapi || '';

  const platformLabels = getPlatformLabels();
  const trends = [];

  if (tavilyKey) {
    try {
      const queryParts = [];
      if (niche) queryParts.push(niche);
      if (platform && platform !== 'all') queryParts.push(`${platformLabels[platform] || platform} social media`);
      if (region) queryParts.push(region);
      queryParts.push('trending');
      const query = queryParts.join(' ');

      const tavilyRes = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: 'advanced',
          max_results: Math.min(limit, 20),
          include_answer: true,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (tavilyRes.ok) {
        const data = await tavilyRes.json();
        for (const r of (data.results || []).slice(0, limit)) {
          trends.push({
            id: `tavily-${trends.length + 1}`,
            title: r.title || 'Trending topic',
            hook: r.content?.slice(0, 200) || `Trending ${niche || 'content'} idea`,
            niche: niche || 'General',
            platform: platform && platform !== 'all' ? (platformLabels[platform] || platform) : ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter/X', 'Pinterest', 'Facebook'][Math.floor(Math.random() * 7)],
            region: region || 'Global',
            viralityScore: Math.floor(Math.random() * 25) + 75,
            trendingAudio: '',
            hashtags: [`#${(niche || 'trending').toLowerCase().replace(/\s+/g, '')}`, '#viral', '#trending', '#fyp'],
            contentAngle: 'Trending topic',
            estimatedViews: `${(Math.floor(Math.random() * 5) + 1)}.${Math.floor(Math.random() * 9)}M avg`,
            timeInTrend: `${Math.floor(Math.random() * 7) + 1} days`,
            source_url: r.url,
            source: 'tavily',
          });
        }
      }
    } catch { /* tavily fallback to serpapi */ }
  }

  if (serpKey && trends.length < limit) {
    try {
      const query = niche || 'trending';
      const serpRes = await fetch(
        `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(query)}&api_key=${serpKey}&data_type=TIMESERIES`,
        { signal: AbortSignal.timeout(10000) }
      );

      if (serpRes.ok) {
        const data = await serpRes.json();
        const topics = data?.interest_over_time?.timeline_data || [];
        for (const topic of topics.slice(0, limit - trends.length)) {
          const platKeys = Object.keys(platformLabels);
          trends.push({
            id: `serp-${trends.length + 1}`,
            title: topic.title || `${query} trend`,
            hook: `${topic.title || query} — surging in interest. Create content now.`,
            niche: niche || 'General',
            platform: platform && platform !== 'all' ? (platformLabels[platform] || platform) : platformLabels[platKeys[Math.floor(Math.random() * platKeys.length)]],
            region: region || 'Global',
            viralityScore: topic.values?.[0]?.extracted_value ? Math.min(parseInt(topic.values[0].extracted_value), 99) : Math.floor(Math.random() * 30) + 70,
            trendingAudio: '',
            hashtags: [`#${(niche || 'trending').toLowerCase().replace(/\s+/g, '')}`, '#trending', '#viral'],
            contentAngle: 'Trending topic',
            estimatedViews: `${(Math.floor(Math.random() * 5) + 1)}.${Math.floor(Math.random() * 9)}M avg`,
            timeInTrend: `${Math.floor(Math.random() * 7) + 1} days`,
            source: 'google-trends',
          });
        }
      }
    } catch { /* both APIs failed */ }
  }

  if (trends.length === 0) {
    return NextResponse.json(
      { error: 'No trends available. Configure Tavily or SerpAPI keys in Admin > API Providers.', trends: [], count: 0, source: 'none' },
      { status: 200 }
    );
  }

  return NextResponse.json({
    trends: trends.slice(0, limit),
    count: Math.min(limit, trends.length),
    source: tavilyKey ? 'tavily' : 'google-trends',
  });
}
