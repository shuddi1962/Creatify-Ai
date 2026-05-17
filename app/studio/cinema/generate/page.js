'use client'
import { useState, useRef } from 'react'
import {
  Film, Sparkles, Plus, Layers, PanelLeftClose,
  ChevronDown, ImageIcon, Video as VideoIcon,
  Volume2, ChevronRight
} from 'lucide-react'

const CINEMA_MODELS = [
  { id: 'kling-v2.6-pro-t2v', name: 'Kling 3.0 Pro', badge: 'TOP', creditCost: 30, desc: 'Best cinematic motion' },
  { id: 'veo3.1-text-to-video', name: 'Veo 3.1', badge: 'NEW', creditCost: 40, desc: 'Google film-grade' },
  { id: 'seedance-v2.0-t2v', name: 'Seedance 2.0', badge: null, creditCost: 25, desc: 'ByteDance flagship' },
  { id: 'hunyuan-text-to-video', name: 'Hunyuan', badge: null, creditCost: 15, desc: 'Tencent cinematic' },
  { id: 'wan2.5-text-to-video', name: 'WAN 2.5', badge: null, creditCost: 12, desc: 'Fast open-source' },
]

const CAMERA_MOVEMENTS = [
  'Static', 'Slow Zoom In', 'Zoom Out', 'Pan Left', 'Pan Right',
  'Tilt Up', 'Tilt Down', 'Orbit Left', 'Orbit Right',
  'Dolly Push', 'Dolly Pull', 'Crane Up', 'Crane Down',
  'Handheld', 'Steadicam', 'Whip Pan', 'Dutch Tilt',
]

const SHOT_TYPES = [
  'Single shot', 'Two shot', 'Close-up', 'Extreme close-up',
  'Wide shot', 'Establishing', 'Over-the-shoulder', 'POV',
]

const SPEED_RAMPS = ['Linear', 'Ease In', 'Ease Out', 'Ease In Out', 'Custom']

export default function CinemaGeneratePage() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('muapi_key') : ''
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState(CINEMA_MODELS[0])
  const [movement, setMovement] = useState('Orbit around')
  const [speedRamp, setSpeedRamp] = useState('Custom')
  const [duration, setDuration] = useState('12s')
  const [shotType, setShotType] = useState('Single shot')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [quality, setQuality] = useState('1080p')
  const [audio, setAudio] = useState(true)
  const [shotCount, setShotCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [activeProject, setActiveProject] = useState('New project')
  const [projects] = useState(['New project', 'Untitled', 'Untitled'])
  const fileInputRef = useRef()

  function buildCinematicPrompt() {
    if (!prompt.trim()) return ''
    const cameraDir = movement !== 'Static' ? `, camera ${movement.toLowerCase()}` : ''
    const shotDir = shotType !== 'Single shot' ? `, ${shotType.toLowerCase()}` : ''
    const durationSec = parseInt(duration)
    const rampDir = speedRamp !== 'Linear' ? `, ${speedRamp.toLowerCase()} speed ramp` : ''
    return `${prompt.trim()}${cameraDir}${shotDir}${rampDir}, cinematic quality, film-grade lighting, ${durationSec} seconds`
  }

  async function handleGenerate() {
    if (!apiKey) { setError('Add your Muapi API key in Settings.'); return }
    if (!prompt.trim()) { setError('Describe your scene first.'); return }
    setError(''); setLoading(true); setResult(null)
    try {
      const finalPrompt = buildCinematicPrompt()
      const body = {
        prompt: finalPrompt,
        aspect_ratio: aspectRatio,
        duration: parseInt(duration),
        quality: quality === '4K' ? 'high' : quality === '1080p' ? 'high' : 'basic',
      }
      if (uploadedImageUrl) body.image_url = uploadedImageUrl
      const response = await fetch(`https://api.muapi.ai/v1/${selectedModel.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || `Generation failed (${response.status})`)
      }
      const data = await response.json()
      const jobId = data.id || data.request_id
      if (jobId) {
        for (let i = 0; i < 120; i++) {
          await new Promise(r => setTimeout(r, 2500))
          const poll = await fetch(`https://api.muapi.ai/v1/predict/results/${jobId}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          })
          if (!poll.ok) continue
          const pd = await poll.json()
          if (pd.status === 'succeeded' || pd.output || pd.url) {
            setResult({ url: pd.url || pd.output?.url || pd.output?.[0], thumbnail: pd.thumbnail_url })
            break
          }
          if (pd.status === 'failed') throw new Error('Generation failed')
        }
      } else if (data.url || data.output?.url) {
        setResult({ url: data.url || data.output?.url })
      }
    } catch (e) {
      setError(e.message || 'Generation failed')
    } finally { setLoading(false) }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !apiKey) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('https://api.muapi.ai/v1/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: fd,
      })
      const data = await res.json()
      setUploadedImageUrl(data.url || data.file_url || '')
    } catch { setUploadedImageUrl(URL.createObjectURL(file)) }
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg-page)', overflow: 'hidden' }}>
      {leftPanelOpen && (
        <div style={{ width: 220, flexShrink: 0, background: 'var(--bg-card)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setLeftPanelOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12 }}>
              <PanelLeftClose size={14} /> Hide
            </button>
          </div>
          <div style={{ padding: '8px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13 }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <Plus size={15} /> New project
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, background: 'var(--bg-active)', cursor: 'pointer', marginBottom: 2 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={12} color="#000" />
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-active)', fontWeight: 500 }}>AI Director</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={12} color="#fff" />
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Elements</span>
            </div>
          </div>
          <div style={{ padding: '0 8px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 12px 6px' }}>Projects</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 8, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <div style={{ width: 26, height: 26, borderRadius: 6, fontSize: 14, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>&#9733;</div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>My Generations</span>
            </div>
            {projects.map((p, i) => (
              <div key={i} onClick={() => setActiveProject(p)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 8, cursor: 'pointer', background: activeProject === p && i === 0 ? 'var(--bg-hover)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = activeProject === p && i === 0 ? 'var(--bg-hover)' : 'none'}>
                <div style={{ width: 26, height: 26, borderRadius: 6, fontSize: 14, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>&#9733;</div>
                <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {!leftPanelOpen && (
          <button onClick={() => setLeftPanelOpen(true)} style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronRight size={14} /> Show
          </button>
        )}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: result ? '#000' : 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0014 50%, #080C10 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          {[
            { top: '12%', left: '12%', borderTop: true, borderLeft: true },
            { top: '12%', right: '12%', borderTop: true, borderRight: true },
            { bottom: '25%', left: '12%', borderBottom: true, borderLeft: true },
            { bottom: '25%', right: '12%', borderBottom: true, borderRight: true },
          ].map((pos, i) => (
            <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...pos, borderTop: pos.borderTop ? '2px solid rgba(255,255,255,0.15)' : 'none', borderBottom: pos.borderBottom ? '2px solid rgba(255,255,255,0.15)' : 'none', borderLeft: pos.borderLeft ? '2px solid rgba(255,255,255,0.15)' : 'none', borderRight: pos.borderRight ? '2px solid rgba(255,255,255,0.15)' : 'none' }} />
          ))}
          <div style={{ position: 'absolute', top: 20, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>CINEMA STUDIO 3.5</div>
          {result ? (
            <video src={result.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }} />
          ) : loading ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 700ms linear infinite', margin: '0 auto 16px' }} />
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Generating cinematic scene...</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 6 }}>This may take 1–3 minutes</div>
            </div>
          ) : (
            <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 800, textAlign: 'center', maxWidth: '60%', lineHeight: 1.15, background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fb923c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', zIndex: 1 }}>
              What would you shoot<br />with infinite budget?
            </h1>
          )}
          {error && (
            <div style={{ position: 'absolute', bottom: 80, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 16px', color: '#fca5a5', fontSize: 13, maxWidth: '70%', textAlign: 'center' }}>
              {error}
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '7px 12px', fontSize: 12, color: uploadedImageUrl ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer' }}>
              <ImageIcon size={13} /> {uploadedImageUrl ? 'Image' : 'Image'}
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '7px 12px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <VideoIcon size={13} /> Video
            </button>
          </div>
          <button style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 100, padding: '8px 14px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer' }}>
            AI Director
          </button>
        </div>
        <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Film size={13} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Director Panel</span>
            </div>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, border: '1.5px dashed var(--border-default)', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Plus size={13} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
            {uploadedImageUrl && (
              <div style={{ width: 52, height: 36, borderRadius: 6, flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                <img src={uploadedImageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ flexShrink: 0, minWidth: 150 }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Movement</div>
              <select value={movement} onChange={e => setMovement(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}>
                {CAMERA_MOVEMENTS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 120, height: 36, background: 'var(--bg-input)', borderRadius: 8, border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', padding: '0 8px', overflow: 'hidden', flexShrink: 0 }}>
              <svg width="100%" height="24" viewBox="0 0 200 24" preserveAspectRatio="none">
                <path d="M0,18 C40,18 60,6 100,4 C140,2 160,8 200,12" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" />
                {[20,70,100,140,180].map((x,i) => (<circle key={i} cx={x} cy={i===1||i===3 ? 6 : 14} r="3" fill="var(--accent-primary)" />))}
              </svg>
            </div>
            <div style={{ flexShrink: 0, minWidth: 120 }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Speed ramp</div>
              <select value={speedRamp} onChange={e => setSpeedRamp(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}>
                {SPEED_RAMPS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ flexShrink: 0, minWidth: 100 }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Duration</div>
              <select value={duration} onChange={e => setDuration(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}>
                {['3s','5s','8s','10s','12s'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
            <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && handleGenerate()} placeholder="Describe your scene — use @ to add characters & locations" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'nowrap' }}>
              <select value={selectedModel.id} onChange={e => setSelectedModel(CINEMA_MODELS.find(m => m.id === e.target.value))} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '5px 8px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}>
                {CINEMA_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select value={shotType} onChange={e => setShotType(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '5px 8px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}>
                {SHOT_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '5px 8px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}>
                {['16:9','9:16','1:1','4:3','2.35:1'].map(r => <option key={r}>{r}</option>)}
              </select>
              <select value={quality} onChange={e => setQuality(e.target.value)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '5px 8px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}>
                {['480p','720p','1080p','4K'].map(q => <option key={q}>{q}</option>)}
              </select>
              <button onClick={() => setAudio(a => !a)} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '5px 8px', fontSize: 11, color: audio ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Volume2 size={12} /> {audio ? 'On' : 'Off'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '5px 8px', fontSize: 11, color: 'var(--text-secondary)' }}>
                <button onClick={() => setShotCount(s => Math.max(1,s-1))} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-secondary)', padding: '0 2px' }}>−</button>
                {shotCount}/4
                <button onClick={() => setShotCount(s => Math.min(4,s+1))} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-secondary)', padding: '0 2px' }}>+</button>
              </div>
              {['START FRAME','END FRAME'].map(label => (
                <button key={label} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '5px 8px', fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Plus size={9} /> {label}
                </button>
              ))}
              <button onClick={handleGenerate} disabled={loading} style={{ background: loading ? 'rgba(0,255,148,0.5)' : 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', minWidth: 130, display: 'flex', alignItems: 'center', gap: 6 }}>
                {loading ? (
                  <><div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #000', borderTopColor: 'transparent', animation: 'spin 600ms linear infinite' }} /> Generating...</>
                ) : `GENERATE ${selectedModel.creditCost}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
