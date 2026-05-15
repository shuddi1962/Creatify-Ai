'use client'
import { useState, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Layout, ChevronRight, ChevronLeft, Play, FileText, Loader } from 'lucide-react'
import Link from 'next/link'
import PromptArea from '@/components/ideas/PromptArea'

function StoryboardInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [script, setScript] = useState(searchParams.get('script') || '')
  const [scenes, setScenes] = useState([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genProgress, setGenProgress] = useState({ current: 0, total: 0 })
  const [selectedScene, setSelectedScene] = useState(null)

  const handleGenerateStoryboard = () => {
    if (!script.trim()) return
    setLoading(true)

    const lines = script.split('\n').filter(l => l.trim())
    const generatedScenes = lines.length >= 3
      ? lines.map((line, i) => ({
          id: i + 1,
          scene: line.length > 80 ? line.substring(0, 80) + '...' : line,
          duration: '5s',
          camera: 'Medium shot',
          action: line,
          visuals: 'Generated from script context',
        }))
      : [
          { id: 1, scene: 'Opening shot - establishing the setting', duration: '3s', camera: 'Wide angle', action: 'Subject walks into frame', visuals: 'Morning light through window' },
          { id: 2, scene: 'Hook moment - direct to camera', duration: '5s', camera: 'Medium close-up', action: 'Eye contact, confident tone', visuals: 'Neutral background, clean lighting' },
          { id: 3, scene: 'Main content - demonstration', duration: '20s', camera: 'POV / over shoulder', action: 'Hands showing the process', visuals: 'Product/material in focus' },
          { id: 4, scene: 'Key insight callout', duration: '4s', camera: 'Close-up', action: 'Pointing at visual element', visuals: 'Text overlay on screen' },
          { id: 5, scene: 'CTA and outro', duration: '8s', camera: 'Medium shot', action: 'Clear call to action, friendly tone', visuals: 'Subscribe button visible' },
        ]

    setTimeout(() => {
      setScenes(generatedScenes)
      setStep(2)
      setLoading(false)
    }, 1500)
  }

  const updateScene = (id, field, value) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleSendToBulk = useCallback(() => {
    if (scenes.length === 0) return
    setGenerating(true)
    setGenProgress({ current: 0, total: scenes.length })

    const batchData = scenes.map(s => ({
      prompt: `${s.action}. Camera: ${s.camera}. Visual style: ${s.visuals}`,
      duration: parseInt(s.duration) || 5,
      aspect_ratio: '16:9',
      model: 'seedance-2',
    }))

    sessionStorage.setItem('storyboard_batch', JSON.stringify(batchData))
    router.push('/studio/bulk/video')
  }, [scenes, router])

  return (
    <div style={{ padding: '28px', maxWidth: 1000, margin: '0 auto' }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Layout size={20} style={{ color: 'var(--accent-primary)' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Storyboard Pipeline
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Paste your script. AI breaks it into scenes with camera directions and visual descriptions.
        </p>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 16, padding: '16px 20px',
        marginBottom: 24,
        display: 'flex', gap: 8,
      }}>
        {[
          { num: 1, label: 'Enter Script' },
          { num: 2, label: 'Review Storyboard' },
          { num: 3, label: 'Generate Videos' },
        ].map(s => (
          <div
            key={s.num}
            onClick={() => s.num <= 2 || scenes.length > 0 ? setStep(s.num) : null}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 10,
              cursor: step >= s.num ? 'pointer' : 'not-allowed',
              background: step === s.num ? 'var(--bg-active)' : step > s.num ? 'var(--bg-elevated)' : 'transparent',
              border: `1px solid ${step === s.num ? 'var(--border-active)' : 'var(--border-subtle)'}`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>STEP {s.num}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: step >= s.num ? 'var(--text-active)' : 'var(--text-muted)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <PromptArea
            label="Your Script"
            value={script}
            onChange={setScript}
            placeholder="Paste your full video script here. AI will analyze it and break it into visual scenes..."
            rows={8}
            hint="The more detailed your script, the better the storyboard"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Link href="/studio/ideas/scripts" style={{
              padding: '10px 20px', borderRadius: 10,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              fontSize: 13, color: 'var(--text-secondary)',
              textDecoration: 'none', fontWeight: 500,
            }}>
              <FileText size={14} /> Import from Script Generator
            </Link>
            <button
              onClick={handleGenerateStoryboard}
              disabled={loading || !script.trim()}
              style={{
                padding: '10px 24px', borderRadius: 10,
                border: 'none', fontSize: 13, fontWeight: 700,
                background: loading || !script.trim() ? 'var(--bg-elevated)' : '#CCFF00',
                color: loading || !script.trim() ? 'var(--text-muted)' : '#000',
                cursor: loading || !script.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {loading ? (
                <><div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 600ms linear infinite' }} /> Analyzing...</>
              ) : (
                <><Layout size={14} /> Generate Storyboard <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            {scenes.length} scenes detected
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {scenes.map((scene, idx) => (
              <div key={scene.id} style={{
                background: 'var(--bg-card)',
                border: `1px solid ${selectedScene === scene.id ? 'var(--border-active)' : 'var(--border-subtle)'}`,
                borderRadius: 14, padding: '16px',
                transition: 'border-color 150ms',
              }}
                onClick={() => setSelectedScene(scene.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--accent-primary)', color: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      value={scene.scene}
                      onChange={e => updateScene(scene.id, 'scene', e.target.value)}
                      style={{
                        width: '100%', background: 'transparent', border: 'none',
                        fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                        outline: 'none', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
                    background: 'var(--bg-elevated)', padding: '3px 8px', borderRadius: 6,
                  }}>
                    {scene.duration}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Camera', value: scene.camera, field: 'camera' },
                    { label: 'Action', value: scene.action, field: 'action' },
                    { label: 'Visuals', value: scene.visuals, field: 'visuals' },
                  ].map(({ label, value, field }) => (
                    <div key={field}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
                      <input
                        value={value}
                        onChange={e => updateScene(scene.id, field, e.target.value)}
                        style={{
                          width: '100%', background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)', borderRadius: 6,
                          padding: '6px 8px', fontSize: 12, color: 'var(--text-secondary)',
                          outline: 'none', fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button
              onClick={() => setStep(1)}
              style={{
                padding: '10px 20px', borderRadius: 10,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <ChevronLeft size={14} /> Back to Script
            </button>
            <button
              onClick={() => setStep(3)}
              style={{
                padding: '10px 24px', borderRadius: 10,
                border: 'none', fontSize: 13, fontWeight: 700,
                background: '#CCFF00', color: '#000', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              Proceed to Generate <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 20, padding: '40px', textAlign: 'center',
        }}>
          {generating ? (
            <>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--border-default)', borderTopColor: 'var(--accent-primary)', animation: 'spin 600ms linear infinite', margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Preparing {genProgress.total} scenes...
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Building prompts for each scene and redirecting to Bulk Video Generator...
              </p>
              <div style={{ maxWidth: 300, margin: '16px auto 0', height: 6, background: 'var(--bg-elevated)', borderRadius: 100 }}>
                <div style={{ width: `${(genProgress.current / genProgress.total) * 100}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: 100, transition: 'width 300ms' }} />
              </div>
            </>
          ) : (
            <>
              <Play size={48} color="var(--accent-primary)" style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                {scenes.length} Scenes Ready
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, maxWidth: 400, margin: '0 auto 16px' }}>
                Each scene will be passed as a video generation prompt to the Bulk Video Generator.
                AI video models like Seedance, Kling, or Sora will generate each clip.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                {['Seedance 2.0', 'Kling 3.0', 'Sora 2'].map(m => (
                  <span key={m} style={{
                    fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 100,
                    background: 'var(--bg-active)', color: 'var(--text-active)',
                  }}>
                    {m}
                  </span>
                ))}
              </div>
              <button
                onClick={handleSendToBulk}
                style={{
                  padding: '12px 32px', borderRadius: 12,
                  border: 'none', fontSize: 14, fontWeight: 700,
                  background: '#CCFF00', color: '#000', cursor: 'pointer',
                  transition: 'opacity 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Send All to Bulk Video Generator
              </button>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
                Uses your Muapi API key to generate each scene via AI video models
              </p>
            </>
          )}
          {!generating && (
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: '8px 16px', borderRadius: 8,
                  background: 'none', border: 'none',
                  fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer',
                }}
              >
                <ChevronLeft size={14} /> Back to edit storyboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function StoryboardPage() {
  return (
    <Suspense fallback={<div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
      <StoryboardInner />
    </Suspense>
  )
}
