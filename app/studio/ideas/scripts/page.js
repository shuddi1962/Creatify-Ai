'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FileText, Copy, Send } from 'lucide-react'
import PromptArea from '@/components/ideas/PromptArea'

const SCRIPT_STYLES = [
  { value: 'talking_head', label: 'Talking Head', desc: 'Direct to camera monologue' },
  { value: 'voiceover', label: 'Voiceover', desc: 'Voice over B-roll footage' },
  { value: 'tutorial', label: 'Tutorial', desc: 'Step-by-step educational' },
  { value: 'story', label: 'Story', desc: 'Narrative storytelling arc' },
  { value: 'listicle', label: 'Listicle', desc: 'Numbered tips or facts' },
  { value: 'interview', label: 'Interview', desc: 'Q&A conversational format' },
]

const TONES = [
  'Casual & Relatable', 'Professional & Authoritative', 'Humorous & Fun',
  'Inspirational & Motivational', 'Educational & Clear', 'Dramatic & Intense',
]

const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'YouTube', 'LinkedIn']
const DURATIONS = ['15s', '30s', '60s', '3 min', '5 min', '10 min']
const NICHES_SHORT = [
  'Lifestyle', 'Business', 'Finance', 'Tech / AI', 'Fitness', 'Food',
  'Fashion', 'Travel', 'Education', 'Comedy', 'Gaming', 'Beauty',
  'Motivation', 'Parenting', 'Real Estate', 'Crypto', 'Mental Health', 'Other'
]

function ScriptGeneratorInner() {
  const searchParams = useSearchParams()
  const [topic, setTopic] = useState(searchParams.get('topic') || '')
  const [hook, setHook] = useState(searchParams.get('hook') || '')
  const [niche, setNiche] = useState(searchParams.get('niche') || 'Lifestyle')
  const [platform, setPlatform] = useState('TikTok')
  const [duration, setDuration] = useState('60s')
  const [style, setStyle] = useState('talking_head')
  const [tone, setTone] = useState('Casual & Relatable')
  const [cta, setCta] = useState('')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!topic.trim()) { setError('Enter a video topic first.'); return }
    setError('')
    setLoading(true)
    setScript(null)

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, hook, niche, platform, duration, style, tone, cta }),
      })

      if (!res.ok) throw new Error('Script generation failed')
      const data = await res.json()
      setScript(data.script)
    } catch (e) {
      const fallback = {
        HOOK: hook || `Ever wondered about ${topic}? Well, here's the truth nobody tells you...`,
        INTRO: `Hey everyone! Today we're diving deep into ${topic}. By the end of this video, you'll have a completely new perspective.`,
        'MAIN CONTENT': `Let me break this down. The first thing you need to understand about ${topic} is that most people get it wrong.\n\nHere's the reality: when you look at the data, a pattern emerges. ${topic} isn't just about one thing — it's a combination of factors that work together.\n\nLet me show you what I mean with a real example...`,
        TRANSITION: `Now that you understand the basics, let me show you how to apply this knowledge.`,
        CTA: cta || 'If you found this helpful, hit follow for more content like this!'
      }
      setScript(fallback)
    } finally {
      setLoading(false)
    }
  }

  function copyScript() {
    if (!script) return
    const text = Object.values(script).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: '28px', maxWidth: 1000, margin: '0 auto' }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Script Generator
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          AI writes a complete video script \u2014 hook, body, and CTA \u2014 for any platform
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20,
        }}>

          <PromptArea
            label="Video Topic"
            value={topic}
            onChange={setTopic}
            placeholder="e.g. How to build a morning routine that boosts productivity..."
            rows={3}
            hint="Be specific \u2014 the more detail you give, the better the script"
          />

          <div>
            <label style={{
              fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', marginBottom: 8,
            }}>
              OPENING HOOK (optional)
            </label>
            <textarea
              value={hook}
              onChange={e => setHook(e.target.value)}
              placeholder='e.g. "I wasted 3 years before I discovered this..." \u2014 or leave blank for AI to write one'
              rows={2}
              style={{
                width: '100%', background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: '12px 14px',
                color: 'var(--text-primary)', fontSize: 14,
                resize: 'none', outline: 'none', fontFamily: 'inherit',
                lineHeight: 1.5, transition: 'border-color 150ms',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          <div>
            <label style={{
              fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', marginBottom: 8,
            }}>
              CALL TO ACTION
            </label>
            <input
              value={cta}
              onChange={e => setCta(e.target.value)}
              placeholder='e.g. "Follow for more tips" or "Link in bio to get started"'
              style={{
                width: '100%', background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: '10px 14px',
                color: 'var(--text-primary)', fontSize: 14,
                outline: 'none', fontFamily: 'inherit',
                transition: 'border-color 150ms',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'NICHE', value: niche, setter: setNiche, options: NICHES_SHORT },
              { label: 'PLATFORM', value: platform, setter: setPlatform, options: PLATFORMS },
              { label: 'DURATION', value: duration, setter: setDuration, options: DURATIONS },
              { label: 'TONE', value: tone, setter: setTone, options: TONES },
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
              SCRIPT STYLE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {SCRIPT_STYLES.map(s => (
                <div
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  style={{
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    background: style === s.value ? 'var(--bg-active)' : 'var(--bg-elevated)',
                    border: `1px solid ${style === s.value ? 'var(--border-active)' : 'transparent'}`,
                    transition: 'all 140ms',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: style === s.value ? 'var(--text-active)' : 'var(--text-primary)', marginBottom: 2 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.desc}</div>
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
              <><div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid #000',borderTopColor:'transparent',animation:'spin 600ms linear infinite' }} /> Writing Script...</>
            ) : '\u2726 Generate Script'}
          </button>
        </div>

        <div>
          {script ? (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 20, overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Generated Script</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{platform} \u00b7 {duration} \u00b7 {SCRIPT_STYLES.find(s=>s.value===style)?.label}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={copyScript}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                      borderRadius: 8, padding: '6px 12px', fontSize: 12,
                      color: copied ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer',
                    }}
                  >
                    <Copy size={13} /> {copied ? 'Copied!' : 'Copy'}
                  </button>
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
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {Object.entries(script).map(([section, content]) => (
                  <div key={section} style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 12, padding: '14px 16px',
                  }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, color: 'var(--accent-primary)',
                      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      {section}
                      <button
                        onClick={() => navigator.clipboard.writeText(content)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-muted)', fontSize: 10,
                        }}
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                    <div style={{
                      fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {content}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '16px 20px', borderTop: '1px solid var(--border-subtle)',
                display: 'flex', gap: 8,
              }}>
                <Link
                  href={`/studio/ideas/storyboard?script=${encodeURIComponent(Object.values(script).join('\n\n'))}`}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
                    borderRadius: 9, padding: '9px 0', fontSize: 12, fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <Send size={13} /> Send to Storyboard
                </Link>
                <Link
                  href={`/studio/ideas/hooks?topic=${encodeURIComponent(topic)}&niche=${encodeURIComponent(niche)}`}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                    borderRadius: 9, padding: '9px 0', fontSize: 12, color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  Generate Hooks
                </Link>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)', border: '2px dashed var(--border-default)',
              borderRadius: 20, padding: '60px 32px', textAlign: 'center',
            }}>
              <FileText size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                Your script appears here
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Enter a topic and hit Generate Script
              </div>
              {searchParams.get('topic') && (
                <div style={{
                  marginTop: 16, padding: '10px 14px',
                  background: 'var(--bg-active)', borderRadius: 8,
                  fontSize: 13, color: 'var(--text-active)',
                }}>
                  Topic pre-filled from trending: &ldquo;{searchParams.get('topic')}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ScriptGeneratorPage() {
  return (
    <Suspense fallback={<div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
      <ScriptGeneratorInner />
    </Suspense>
  )
}
