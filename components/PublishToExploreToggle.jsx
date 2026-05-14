'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../src/lib/supabase'

export default function PublishToExploreToggle() {
  const [publishToExplore, setPublishToExplore] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('user_preferences')
        .select('publish_to_explore')
        .eq('user_id', user.id)
        .single()
      if (data) setPublishToExplore(data.publish_to_explore)
    }
    load()
  }, [])

  async function handleToggle() {
    const newValue = !publishToExplore
    setSaving(true)
    setPublishToExplore(newValue)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('user_preferences').upsert({
      user_id: user.id,
      publish_to_explore: newValue,
      updated_at: new Date().toISOString(),
    })

    setSaving(false)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      padding: '16px 20px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 12,
    }}>
      <div>
        <div style={{
          fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
          marginBottom: 4,
        }}>
          Publish to Explore
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 380 }}>
          {publishToExplore
            ? 'Your generations are being shared to the explore feed. Other users can see and enjoy your creations.'
            : 'Your generations are private. Only you can see them. Toggle on to share with the community.'}
        </div>
      </div>

      <button
        onClick={handleToggle}
        disabled={saving}
        style={{
          width: 48, height: 26, borderRadius: 100,
          background: publishToExplore ? 'var(--accent-primary)' : 'var(--bg-input)',
          border: '1px solid var(--border-default)',
          position: 'relative', cursor: 'pointer',
          flexShrink: 0, marginLeft: 16,
          transition: 'background 200ms',
          opacity: saving ? 0.7 : 1,
        }}
        title={publishToExplore ? 'Turn off public sharing' : 'Share to explore feed'}
      >
        <div style={{
          position: 'absolute', top: 3,
          left: publishToExplore ? 24 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          transition: 'left 200ms ease',
        }} />
      </button>
    </div>
  )
}
