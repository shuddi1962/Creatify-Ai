import { CinemaSidebar } from '@/components/sidebars/CinemaSidebar'

export default function CinemaLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--bg-page)' }}>
      <CinemaSidebar />
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg-page)' }}>
        {children}
      </main>
    </div>
  )
}
