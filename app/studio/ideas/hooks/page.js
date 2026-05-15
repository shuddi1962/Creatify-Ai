'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Copy, Check, Star, FileText } from 'lucide-react'
import PromptArea from '@/components/ideas/PromptArea'

const HOOK_TYPES = [
  { value: 'question', label: 'Question Hook', desc: 'Starts with a question to engage' },
  { value: 'bold_statement', label: 'Bold Statement', desc: 'Confident, attention-grabbing claim' },
  { value: 'problem_agitate', label: 'Problem-Agitate', desc: 'Agitate a pain point, offer hope' },
  { value: 'shocking_stat', label: 'Shocking Stat', desc: 'Surprising statistic opens eyes' },
  { value: 'story', label: 'Story Hook', desc: 'Opens with a mini narrative' },
  { value: 'teaser', label: 'Teaser Hook', desc: 'Hint at something exciting coming' },
  { value: 'contrast', label: 'Contrast Hook', desc: 'Before/after, old/new contrast' },
  { value: 'number', label: 'Number Hook', desc: 'X ways/steps/secrets format' },
]

const TONES = ['Casual', 'Bold', 'Provocative', 'Curious', 'Inspirational', 'Humorous']
const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter']
const COUNT_OPTIONS = ['5', '10', '15', '20']

function HooksPageInner() {
  const searchParams = useSearchParams()
  const [topic, setTopic] = useState(searchParams.get('topic') || '')
  const [niche, setNiche] = useState(searchParams.get('niche') || 'Lifestyle')
  const [platform, setPlatform] = useState('TikTok')
  const [tone, setTone] = useState('Casual')
  const [count, setCount] = useState('10')
  const [selectedTypes, setSelectedTypes] = useState(['question', 'bold_statement', 'teaser'])
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState([])
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  function toggleType(value) {
    setSelectedTypes(prev =>
      prev.includes(value)
        ? prev.filter(t => t !== value)
        : [...prev, value]
    )
  }

  async function handleGenerate() {
    if (!topic.trim()) { setError('Enter a topic first.'); return }
    if (selectedTypes.length === 0) { setError('Select at least one hook type.'); return }
    setError('')
    setLoading(true)

    // Generate hooks client side for reliability
    setTimeout(() => {
      const sampleHooks = generateSampleHooks(topic, niche, platform, tone, parseInt(count), selectedTypes)
      setHooks(sampleHooks)
      setLoading(false)
    }, 1500)
  }

  function generateSampleHooks(topic, niche, platform, tone, count, types) {
    const templates = {
      question: [
        `"What if everything you thought about ${topic} was wrong?"`,
        `"Do you really know how to ${topic} the right way?"`,
        `"Why is everyone talking about ${topic} and not doing it?"`,
        `"What would happen if you tried ${topic} for 30 days?"`,
        `"Are you making this ${topic} mistake right now?"`,
      ],
      bold_statement: [
        `"This one change made me rethink ${topic} completely"`,
        `"I tried every ${topic} method \u2014 this one actually works"`,
        `"Nobody tells you this about ${topic} until it is too late"`,
        `"The secret to ${topic} that experts don't want you to know"`,
      ],
      problem_agitate: [
        `"Struggling with ${topic}? Here is what nobody told you"`,
        `"Most people quit ${topic} right before it works"`,
        `"The real problem with ${topic} isn't what you think"`,
        `"Tired of trying ${topic} with zero results? Try this"`,
      ],
      shocking_stat: [
        `"97% of people fail at ${topic} \u2014 here is why you will be different"`,
        `"Only 3% of creators master ${topic} \u2014 here is their secret"`,
        `"The ${topic} industry is hiding this shocking truth"`,
        `"$50B is spent on ${topic} annually \u2014 and most of it is wasted"`,
      ],
      story: [
        `"I spent 3 years failing at ${topic} before I figured this out"`,
        `"Let me tell you the story of how I discovered ${topic}"`,
        `"It started with a simple question about ${topic} \u2014 and changed everything"`,
        `"My journey with ${topic} taught me something unexpected"`,
      ],
      teaser: [
        `"You won't believe what happened when I tried this ${topic} hack"`,
        `"Wait until you see what ${topic} can do with this one trick"`,
        `"I wasn't going to share this ${topic} secret, but..."`,
        `"The ${topic} strategy that is too good to be true (but works)"`,
      ],
      contrast: [
        `"The difference between a ${topic} beginner and pro is one decision"`,
        `"Before and after: how my approach to ${topic} changed everything"`,
        `"What if the old way of ${topic} is completely backwards?"`,
        `"My ${topic} journey from zero to hero \u2014 and back"`,
      ],
      number: [
        `"5 ${topic} tips that actually work in 2025"`,
        `"10 ${topic} secrets nobody tells you about"`,
        `"3 ${topic} mistakes that are costing you money"`,
        `"7 ${topic} strategies that went viral this month"`,
      ],
    }

    const results = []
    const usedTypes = types.length > 0 ? types : Object.keys(templates)

    for (let i = 0; i < count; i++) {
      const type = usedTypes[i % usedTypes.length]
      const pool = templates[type] || templates.question
      const text = pool[i % pool.length]
      const strength = Math.floor(Math.random() * 2) + 3 + Math.random()

      results.push({
        id: `hook-${i}-${Date.now()}`,
        text,
        type: HOOK_TYPES.find(t => t.value === type)?.label || 'Hook',
        strength: Math.round(strength * 10) / 10,
        stars: Math.round(strength),
      })
    }

    return results
  }

  function copyHook(id, text) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function renderStars(rating) {
    const full = Math.floor(rating)
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        fill={i < full ? 'var(--accent-primary)' : 'none'}
        color={i < full ? 'var(--accent-primary)' : 'var(--text-muted)'}
      />
    ))
  }

  return (
    <div style={{ padding: '28px', maxWidth: 1000, margin: '0 auto' }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Zap size={20} style={{ color: 'var(--accent-primary)' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Hook Generator
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Generate viral opening hooks for any niche, platform, and audience
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20,
        }}>

          <PromptArea
            label="Topic / Niche"
            value={topic}
            onChange={setTopic}
            placeholder="e.g. Fitness motivation, personal finance tips, tech reviews..."
            rows={3}
            hint="Describe your content topic or niche in detail"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'PLATFORM', value: platform, setter: setPlatform, options: PLATFORMS },
              { label: 'TONE', value: tone, setter: setTone, options: TONES },
              { label: 'NICHE', value: niche, setter: setNiche, options: ['Lifestyle', 'Business', 'Finance', 'Tech', 'Fitness', 'Food', 'Fashion', 'Travel', 'Education', 'Comedy', 'Gaming', 'Beauty', 'Other'] },
              { label: 'COUNT', value: count, setter: setCount, options: COUNT_OPTIONS },
            ].map(({ label, value, setter, options }) => (
              <div key={label}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                  {label}
                </div>
                <select
                  value={value}
                  onChange={e => setter(e.target.value)}
                  style={{
                    width: '100%', background: 'var(--bg-input)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 9, padding: '9px 10px',
                    color: 'var(--text-primary)', fontSize: 13,
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
              HOOK TYPES
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {HOOK_TYPES.map(t => (
                <div
                  key={t.value}
                  onClick={() => toggleType(t.value)}
                  style={{
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    background: selectedTypes.includes(t.value) ? 'var(--bg-active)' : 'var(--bg-elevated)',
                    border: `1px solid ${selectedTypes.includes(t.value) ? 'var(--border-active)' : 'transparent'}`,
                    transition: 'all 140ms',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: selectedTypes.includes(t.value) ? 'var(--text-active)' : 'var(--text-primary)', marginBottom: 2 }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fca5a5',
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            style={{
              width: '100%', padding: '14px 0',
              background: !topic.trim() ? 'var(--bg-elevated)'
                : loading ? 'rgba(0,255,148,0.5)'
                : 'var(--btn-generate-bg)',
              color: !topic.trim() ? 'var(--text-muted)' : 'var(--btn-generate-text)',
              border: 'none', borderRadius: 12,
              fontSize: 14, fontWeight: 800, cursor: !topic.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? (
              <><div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid #000',borderTopColor:'transparent',animation:'spin 600ms linear infinite' }} /> Generating Hooks...</>
            ) : '\u26A1 Generate Hooks'}
          </button>
        </div>

        <div>
          {hooks.length > 0 ? (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 20, overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Generated Hooks</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hooks.length} hooks for {platform}</div>
                </div>
                <button
                  onClick={handleGenerate}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                    borderRadius: 8, padding: '6px 12px', fontSize: 12,
                    color: 'var(--text-secondary)', cursor: 'pointer',
                  }}
                >
                  Regenerate
                </button>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 600, overflowY: 'auto' }}>
                {hooks.map(hook => (
                  <div key={hook.id} style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 12, padding: '14px 16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5,
                          fontWeight: 500, marginBottom: 8,
                        }}>
                          {hook.text}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
                            background: 'var(--bg-active)', color: 'var(--text-active)',
                          }}>
                            {hook.type}
                          </span>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {renderStars(hook.stars)}
                          </div>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                            {hook.strength}/5
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <button
                          onClick={() => copyHook(hook.id, hook.text)}
                          style={{
                            width: 32, height: 32, borderRadius: 6,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                            cursor: 'pointer', color: copiedId === hook.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                          }}
                          title="Copy hook"
                        >
                          {copiedId === hook.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <Link
                          href={`/studio/ideas/scripts?hook=${encodeURIComponent(hook.text)}&topic=${encodeURIComponent(topic)}&niche=${encodeURIComponent(niche)}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '6px 10px', borderRadius: 6,
                            background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
                            fontSize: 11, fontWeight: 700, textDecoration: 'none',
                          }}
                        >
                          <FileText size={12} /> Script
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)', border: '2px dashed var(--border-default)',
              borderRadius: 20, padding: '60px 32px', textAlign: 'center',
            }}>
              <Zap size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                Your hooks appear here
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Enter a topic and hit Generate Hooks
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HooksPage() {
  return (
    <Suspense fallback={<div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
      <HooksPageInner />
    </Suspense>
  )
}
