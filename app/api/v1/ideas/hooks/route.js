import { NextResponse } from 'next/server';

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { niche, count = 10 } = body;

  const hookTemplates = [
    { template: 'Stop {verb} your {noun} — try this instead', angle: 'Contrarian' },
    { template: 'I tried {trend} for {days} days and here\'s what happened', angle: 'Experimental' },
    { template: 'The #1 mistake people make with {topic}', angle: 'Educational' },
    { template: 'This {tool} changed how I {action}', angle: 'Transformational' },
    { template: 'Why {common_belief} is completely wrong', angle: 'Myth-busting' },
    { template: 'You\'ve been {verb} {noun} wrong your whole life', angle: 'Mind-blowing' },
    { template: 'What nobody tells you about {topic}', angle: 'Honest' },
    { template: 'The secret to {goal} that {experts} don\'t want you to know', angle: 'Insider' },
    { template: 'How I went from {low} to {high} in just {time}', angle: 'Journey' },
    { template: 'Do this every morning for {days} days and watch what happens', angle: 'Challenge' },
    { template: 'This {profession} tip will save you {amount} hours a week', angle: 'Productivity' },
    { template: 'The {adj} truth about {topic} that everyone ignores', angle: 'Raw' },
    { template: '{number} signs you\'re more {trait} than you think', angle: 'Self-discovery' },
    { template: 'If you {do_this}, you\'re already behind', angle: 'Urgency' },
    { template: 'The easiest way to {achieve} without {sacrifice}', angle: 'Hack' },
    { template: 'I asked {experts} about {topic} and they all said the same thing', angle: 'Social proof' },
    { template: 'This {adj} hack costs $0 and works better than {expensive_alternative}', angle: 'Budget' },
    { template: 'Watch this before you {action} — it could save you {consequence}', angle: 'Warning' },
    { template: '{year} is the year of {trend} — here\'s how to prepare', angle: 'Forward-looking' },
    { template: 'The {adj} difference between successful people and everyone else', angle: 'Comparison' },
    { template: 'Why your {something} isn\'t working (and how to fix it in {time})', angle: 'Problem-solution' },
    { template: 'I replaced {old_habit} with this and my life changed overnight', angle: 'Transformation' },
    { template: 'Forget everything you know about {topic} — science says otherwise', angle: 'Science-based' },
    { template: 'This one decision made me {result} in {time}', angle: 'Pivotal moment' },
    { template: 'The hidden feature in {tool} that 99% of people don\'t know about', angle: 'Discovery' },
  ];

  const nicheWords = niche?.split(' ') || ['social media'];
  const hooks = Array.from({ length: count }, (_, i) => {
    const t = hookTemplates[i % hookTemplates.length];
    const hook = t.template
      .replace(/{noun}/g, nicheWords[nicheWords.length - 1] || 'game')
      .replace(/{topic}/g, niche || 'content')
      .replace(/{trend}/g, niche || 'trending')
      .replace(/{goal}/g, `master ${niche || 'this'}`)
      .replace(/{profession}/g, 'creator')
      .replace(/{tool}/g, 'AI tool')
      .replace(/{experts}/g, 'experts')
      .replace(/{adj}/g, ['shocking', 'crazy', 'simple', 'proven', 'surprising', 'unexpected'][i % 6])
      .replace(/{verb}/g, ['wasting', 'doing', 'thinking', 'believing', 'ignoring', 'overcomplicating'][i % 6])
      .replace(/{action}/g, ['create', 'grow', 'learn', 'build', 'succeed', 'work'][i % 6])
      .replace(/{number}/g, ['5', '7', '10', '3', '15', '21'][i % 6])
      .replace(/{time}/g, ['30 days', 'a week', '24 hours', '7 days', '2 weeks', 'a month'][i % 6])
      .replace(/{days}/g, ['30', '7', '14', '21', '60', '90'][i % 6])
      .replace(/{result}/g, ['10x my income', 'got promoted', 'built an audience', 'found peace', 'achieved more', 'created better content'][i % 6]);
    return { hook, angle: t.angle, niche: niche || 'general', platform: ['TikTok', 'Instagram', 'YouTube'][i % 3] };
  });

  return NextResponse.json({ hooks, count: hooks.length });
}

export async function GET() {
  return NextResponse.json({ hooks: [], count: 0, message: 'Use POST with { niche, count }' });
}
