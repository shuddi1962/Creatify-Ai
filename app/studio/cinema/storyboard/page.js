'use client'
import { useState } from 'react'
import { Plus, Trash2, Send, Download } from 'lucide-react'

export default function StoryboardPage() {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('muapi_key') : ''
  const [scenes, setScenes] = useState([
    { id: 1, prompt: '', thumbnail: null, loading: false },
    { id: 2, prompt: '', thumbnail: null, loading: false },
  ])
  const [nextId, setNextId] = useState(3)

  function addScene() {
    setScenes(prev => [...prev, { id: nextId, prompt: '', thumbnail: null, loading: false }])
    setNextId(n => n + 1)
  }

  function removeScene(id) {
    if (scenes.length <= 1) return
    setScenes(prev => prev.filter(s => s.id !== id))
  }

  function updatePrompt(id, val) {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, prompt: val } : s))
  }

  async function generateThumbnail(id) {
    const scene = scenes.find(s => s.id === id)
    if (!scene?.prompt?.trim() || !apiKey) return
    setScenes(prev => prev.map(s => s.id === id ? { ...s, loading: true } : s))
    try {
      const body = { prompt: scene.prompt + ', storyboard thumbnail, cinematic storyboard art, wide shot, concept art style', aspect_ratio: '16:9', quality: 'standard', num_images: 1 }
      const response = await fetch('https://api.muapi.ai/v1/flux-dev-image', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error('Failed')
      const data = await response.json()
      const jobId = data.id || data.request_id
      let url = data.url || data.output?.url || data.output?.[0]
      if (jobId && !url) {
        for (let i = 0; i < 60; i++) {
          await new Promise(r => setTimeout(r, 2000))
          const poll = await fetch(`https://api.muapi.ai/v1/predict/results/${jobId}`, { headers: { 'Authorization': `Bearer ${apiKey}` } })
          if (!poll.ok) continue
          const pd = await poll.json()
          if (pd.status === 'succeeded' || pd.output || pd.url) { url = pd.url || pd.output?.url || pd.output?.[0]; break }
          if (pd.status === 'failed') break
        }
      }
      if (url) setScenes(prev => prev.map(s => s.id === id ? { ...s, thumbnail: url, loading: false } : s))
    } catch {} finally { setScenes(prev => prev.map(s => s.id === id ? { ...s, loading: false } : s)) }
  }

  function sendToBulk() {
    const prompts = scenes.filter(s => s.prompt.trim()).map(s => s.prompt.trim())
    if (prompts.length > 0) {
      localStorage.setItem('bulk_prompts', JSON.stringify(prompts))
      window.location.href = '/studio/bulk/video'
    }
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>CINEMA STUDIO — STORYBOARD</div>
        <h1 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 8 }}>STORYBOARD BUILDER</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Plan and visualize your scenes before generating any video</p>
      </div>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
        {scenes.map((scene, idx) => (
          <div key={scene.id} style={{ minWidth: 280, maxWidth: 320, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Scene {idx + 1}</span>
              <button onClick={() => removeScene(scene.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}><Trash2 size={14} /></button>
            </div>
            <div style={{ height: 180, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {scene.thumbnail ? <img src={scene.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : scene.loading ? (
                <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 600ms linear infinite' }} />
              ) : (
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>No thumbnail</span>
              )}
            </div>
            <div style={{ padding: '12px 14px' }}>
              <textarea value={scene.prompt} onChange={e => updatePrompt(scene.id, e.target.value)} placeholder="Describe this scene..." rows={3} style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 10px', color: 'var(--text-primary)', fontSize: 12, resize: 'none', outline: 'none', fontFamily: 'inherit', marginBottom: 8 }} />
              <button onClick={() => generateThumbnail(scene.id)} disabled={scene.loading || !scene.prompt.trim() || !apiKey} style={{ width: '100%', padding: '7px 0', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                {scene.loading ? 'Generating...' : 'Generate Thumbnail'}
              </button>
            </div>
          </div>
        ))}
        <div onClick={addScene} style={{ minWidth: 200, background: 'var(--bg-card)', border: '2px dashed var(--border-default)', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
          <Plus size={28} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Add Scene</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button onClick={sendToBulk} disabled={!scenes.some(s => s.prompt.trim())} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
          <Send size={14} /> Send all to Bulk Video
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 10, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <Download size={14} /> Export PDF
        </button>
      </div>
    </div>
  )
}
