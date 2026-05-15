import { MarketingSidebar } from '@/components/sidebars/MarketingSidebar'

export default function MarketingLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--bg-page)' }}>
      <MarketingSidebar />
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg-page)' }}>
        {children}
      </main>
    </div>
  )
}
