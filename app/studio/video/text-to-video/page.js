'use client'

import { useState } from 'react'
import { Video, Image } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'
import StudioEditorLayout, { LeftPanel, StudioCanvas, DirectorBar, GenerateButton, ControlButton, PromptInput, CornerMarkers } from '@/components/studio/StudioEditorLayout'
import StudioDropdown from '@/components/StudioDropdown'
import ResultsGrid from '@/components/studio/ResultsGrid'
import * as muapi from '@/packages/studio/src/muapi'
import { generateVideo } from '@/lib/generationUtils'
import { VIDEO_MODELS } from '@/lib/modelsConfig'

const T2V_MODELS = VIDEO_MODELS.filter(m => m.type === 't2v')
const I2V_MODELS = VIDEO_MODELS.filter(m => m.type === 'i2v')

const ASPECT_PRESETS = [
  { id: '16:9', label: '16:9', desc: 'Landscape' },
  { id: '9:16', label: '9:16', desc: 'Portrait' },
  { id: '1:1', label: '1:1', desc: 'Square' },
  { id: '4:3', label: '4:3', desc: 'Standard' },
  { id: '21:9', label: '21:9', desc: 'Cinematic' },
]
const DURATIONS = ['6', '8', '10', '12', '14', '16', '18', '20']
const QUALITIES = [{ label: '480p', desc: 'Fast' }, { label: '720p', desc: 'HD' }, { label: '1080p', desc: 'Full HD' }]

export default function TextToVideoPage() {
  const [inputMode, setInputMode] = useState('text')
  const [prompt, setPrompt] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [model, setModel] = useState(T2V_MODELS[0].name)
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState('5')
  const [quality, setQuality] = useState('720p')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const activeModels = inputMode === 'image' ? I2V_MODELS : T2V_MODELS
  const modelOpts = activeModels.map(m => ({ label: m.name, desc: m.badge || '', id: m.id }))
  const getModelId = (label) => activeModels.find(m => m.name === label)?.id || activeModels[0]?.id || ''

  const handleImageUpload = (file) => {
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }
    else { setImageFile(null); setImagePreview(null) }
  }

  const getApiKey = async () => {
    const local = localStorage.getItem('muapi_key')
    if (local) return local
    try { const r = await fetch('/api/v1/shared-key?provider=muapi'); const d = await r.json(); if (d.key) return d.key } catch {}
    return null
  }

  const handleGenerate = async () => {
    if (!prompt.trim() && !imageFile) { toast.error('Enter a prompt or upload an image'); return }
    setLoading(true)
    try {
      const modelId = getModelId(model)

      if (inputMode === 'image' && imageFile) {
        const apiKey = await getApiKey()
        if (!apiKey) { toast.error('No API key configured'); setLoading(false); return }
        const uploaded = await muapi.uploadFile(imageFile)
        const response = await muapi.generateI2V(apiKey, {
          model: modelId, prompt: prompt || 'Animate this', image_url: uploaded,
          duration: parseInt(duration), quality: quality.toLowerCase(), aspect_ratio: aspectRatio,
        })
        const url = response.url || ''
        if (url) {
          setResults([{ id: `result-${Date.now()}`, url, prompt, type: 'video', model: modelId }])
          toast.success('Video generated!')
        } else { toast.error('No URL in response') }
      } else {
        const results = await generateVideo({
          model: modelId, prompt,
          aspect_ratio: aspectRatio, duration, quality,
        })
        setResults(results)
        toast.success('Video generated!')
      }
    } catch (error) {
      toast.error(error.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { zIndex: 9999, background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', marginTop: 60 } }} />
      <StudioEditorLayout
        left={
          <LeftPanel title={inputMode === 'image' ? 'I2V MODELS' : 'T2V MODELS'}>
            {modelOpts.map(m => (
              <button key={m.id} onClick={() => setModel(m.label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px',
                  background: model === m.label ? 'var(--accent-bg)' : 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
                  color: model === m.label ? 'var(--accent-text)' : 'var(--text-secondary)', fontSize: 12, textAlign: 'left',
                }}
                onMouseEnter={e => { if (model !== m.label) e.currentTarget.style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { if (model !== m.label) e.currentTarget.style.background = 'none' }}
              >
                <span style={{ fontWeight: model === m.label ? 600 : 400 }}>{m.label}</span>
                {m.desc && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--accent-bg)', color: 'var(--accent-text)', marginLeft: 'auto' }}>{m.desc}</span>}
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '12px 0' }} />
            {QUALITIES.map(q => (
              <button key={q.label} onClick={() => setQuality(q.label)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', background: quality === q.label ? 'var(--accent-bg)' : 'none', border: 'none', cursor: 'pointer', borderRadius: 8, color: quality === q.label ? 'var(--accent-text)' : 'var(--text-secondary)', fontSize: 13, textAlign: 'left' }}
              >
                <span>{q.label}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{q.desc}</span>
              </button>
            ))}
          </LeftPanel>
        }
        canvas={
          <StudioCanvas overlay={<CornerMarkers />}>
            {!loading && results.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, zIndex: 1, width: '100%', maxWidth: 500, padding: '0 24px' }}>
                <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: 'transparent', background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', lineHeight: 1.2 }}>
                  {inputMode === 'image' ? 'IMAGE TO VIDEO' : 'TEXT TO VIDEO'}
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                  {inputMode === 'image' ? 'Animate any image into a cinematic video' : 'Generate high-quality video clips from any text prompt'}
                </p>
                {inputMode === 'image' && (
                  <div style={{ width: '100%' }}>
                    {imagePreview ? (
                      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'contain', background: '#000' }} />
                        <button onClick={() => handleImageUpload(null)} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer' }}>×</button>
                      </div>
                    ) : (
                      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 24, borderRadius: 12, border: '2px dashed var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-card)' }}>
                        <Image size={32} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Upload image to animate</span>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files?.[0])} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}
            {results.length > 0 && (
              <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 40px', overflow: 'auto' }}>
                <div style={{ width: '100%', maxWidth: 800 }}>
                  <ResultsGrid results={results} columns={1} />
                </div>
              </div>
            )}
          </StudioCanvas>
        }
        directorBar={
          <DirectorBar title="Video Controls">
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => { setInputMode('text'); setModel(T2V_MODELS[0].name) }}
                style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: inputMode === 'text' ? 'var(--accent-bg)' : 'var(--bg-input)', border: inputMode === 'text' ? '1px solid var(--accent-border)' : '1px solid var(--border-default)', color: inputMode === 'text' ? 'var(--accent-text)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                Text
              </button>
              <button onClick={() => { setInputMode('image'); setModel(I2V_MODELS[0].name) }}
                style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: inputMode === 'image' ? 'var(--accent-bg)' : 'var(--bg-input)', border: inputMode === 'image' ? '1px solid var(--accent-border)' : '1px solid var(--border-default)', color: inputMode === 'image' ? 'var(--accent-text)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                Image+Text
              </button>
            </div>
            <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={inputMode === 'image' ? 'Describe how the image should move...' : 'Describe the video you want to create...'} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ minWidth: 100 }}><StudioDropdown value={model} onChange={setModel} options={modelOpts} /></div>
              <div style={{ minWidth: 80 }}><StudioDropdown value={`${duration}s`} onChange={v => setDuration(v.replace('s', ''))} options={DURATIONS.map(d => `${d}s`)} /></div>
              <GenerateButton onClick={handleGenerate} loading={loading}>{loading ? '' : 'GENERATE'}</GenerateButton>
            </div>
          </DirectorBar>
        }
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
