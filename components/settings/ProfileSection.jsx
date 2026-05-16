'use client'
import { useState } from 'react'
import { RefreshCw, Zap, MessageCircle, ExternalLink } from 'lucide-react'
import { useAuth } from '@/src/lib/AuthProvider'
import toast from 'react-hot-toast'

export default function ProfileSection() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('profile_display_name') || user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
    return ''
  })
  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('profile_username') || `@${user?.email?.split('@')[0] || 'user'}`
    return ''
  })
  const [bio, setBio] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('profile_bio') || ''
    return ''
  })

  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#fff' }}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{displayName || user?.email?.split('@')[0] || 'User'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Personal account</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Display Name</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Email</label>
            <input defaultValue={user?.email || ''} readOnly style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-muted)', outline: 'none' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Bio</label>
            <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', resize: 'none' }} />
          </div>
        </div>
        <button style={{ marginTop: 16, padding: '8px 20px', fontSize: 13, fontWeight: 600, background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          onClick={() => { localStorage.setItem('profile_display_name', displayName); localStorage.setItem('profile_username', username); localStorage.setItem('profile_bio', bio); toast.success('Profile saved to local storage') }}
        >Save Changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <CreditsCard />
        <BuyCreditsCard />
      </div>

      <PublishToggle />

      <DangerZoneSection />
    </div>
  )
}

function CreditsCard() {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Credits</span>
        <RefreshCw size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)' }}>0%</div>
      <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 100, marginTop: 8, marginBottom: 6 }}>
        <div style={{ width: '0%', height: '100%', background: 'var(--accent-primary)', borderRadius: 100 }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>0 left</div>
      <button style={{ width: '100%', padding: '8px 0', fontSize: 12, fontWeight: 600, background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Top up</button>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40, marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
        {[20, 35, 25, 45, 30, 40, 50, 35, 55, 40, 60, 45].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 11 ? 'var(--accent-primary)' : 'var(--bg-input)', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
        ))}
      </div>
    </div>
  )
}

function BuyCreditsCard() {
  const [selected, setSelected] = useState(null)
  const packs = [
    { credits: 100, price: '$4.99', popular: false },
    { credits: 500, price: '$19.99', popular: true },
    { credits: 1000, price: '$34.99', popular: false },
    { credits: 5000, price: '$149.99', popular: false },
  ]
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Buy Credits</span>
        <Zap size={14} style={{ color: 'var(--accent-primary)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {packs.map((p, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: selected === i ? 'var(--accent-bg)' : 'var(--bg-input)', border: selected === i ? '1px solid var(--accent-border)' : '1px solid var(--border-default)', borderRadius: 8, cursor: 'pointer', transition: 'all 120ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: selected === i ? 'var(--accent-text)' : 'var(--text-primary)' }}>{p.credits}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>credits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {p.popular && <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: 'var(--btn-generate-bg)', color: '#000', textTransform: 'uppercase' }}>Best</span>}
              <span style={{ fontSize: 13, fontWeight: 700, color: selected === i ? 'var(--accent-text)' : 'var(--text-primary)' }}>{p.price}</span>
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => { if (selected !== null) toast.success('Purchasing credits...'); else toast.error('Select a pack first') }} style={{ width: '100%', padding: '9px 0', fontSize: 13, fontWeight: 700, background: selected !== null ? 'var(--btn-generate-bg)' : 'var(--bg-input)', color: selected !== null ? 'var(--btn-generate-text)' : 'var(--text-muted)', border: 'none', borderRadius: 8, cursor: selected !== null ? 'pointer' : 'default', transition: 'all 120ms' }}>
        {selected !== null ? `Buy ${packs[selected].credits} Credits` : 'Select a pack'}
      </button>
    </div>
  )
}

function PublishToggle() {
  const [enabled, setEnabled] = useState(true)
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Publish to explore</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>All your generations will be automatically published to the explore feed</div>
        </div>
        <button onClick={() => setEnabled(!enabled)} style={{ width: 40, height: 22, borderRadius: 100, position: 'relative', background: enabled ? 'var(--accent-primary)' : 'var(--bg-input)', border: 'none', cursor: 'pointer', transition: 'background 150ms' }}>
          <div style={{ position: 'absolute', top: 2, left: enabled ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 150ms' }} />
        </button>
      </div>
      {enabled && <div style={{ fontSize: 10, color: 'var(--accent-text)', marginTop: 6 }}>Your generations are being shared to the explore feed</div>}
    </div>
  )
}

function DangerZoneSection() {
  const [confirmed, setConfirmed] = useState({ generations: false, content: false, discounts: false, settings: false, credits: false })
  const allConfirmed = Object.values(confirmed).every(Boolean)
  return (
    <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 8 }}>Danger Zone</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>Deleting your account will permanently remove:</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'generations', label: 'Access to all your generations' },
          { key: 'content', label: 'All Library & Community content' },
          { key: 'discounts', label: 'Current discounts and subscription' },
          { key: 'settings', label: 'All saved settings and presets' },
          { key: 'credits', label: 'Remaining credits on your balance' },
        ].map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: confirmed[item.key] ? 'rgba(239,68,68,0.08)' : 'transparent', borderRadius: 6 }}>
            <span style={{ fontSize: 12, color: confirmed[item.key] ? '#ef4444' : 'var(--text-secondary)' }}>{item.label}</span>
            <button onClick={() => setConfirmed(prev => ({ ...prev, [item.key]: !prev[item.key] }))} style={{ width: 36, height: 20, borderRadius: 100, position: 'relative', background: confirmed[item.key] ? '#ef4444' : 'var(--bg-input)', border: 'none', cursor: 'pointer', transition: 'background 150ms', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: confirmed[item.key] ? 16 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 150ms' }} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => { if (allConfirmed) toast.success('Account deletion requested'); else toast.error('Please confirm all items first') }} style={{ width: '100%', padding: '9px 0', fontSize: 12, fontWeight: 700, background: allConfirmed ? '#ef4444' : 'transparent', border: `1px solid ${allConfirmed ? '#ef4444' : 'rgba(239,68,68,0.3)'}`, borderRadius: 8, color: allConfirmed ? '#fff' : '#ef4444', cursor: allConfirmed ? 'pointer' : 'default', transition: 'all 120ms' }}>
        {allConfirmed ? 'Confirm Delete Account' : 'Toggle all items to delete'}
      </button>
    </div>
  )
}
