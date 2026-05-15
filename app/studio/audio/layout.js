import { AudioSidebar } from '@/components/sidebars/AudioSidebar'

export default function AudioLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--bg-page)' }}>
      <AudioSidebar />
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg-page)' }}>
        {children}
      </main>
    </div>
  )
}
