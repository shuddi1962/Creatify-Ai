import { BulkSidebar } from '@/components/sidebars/BulkSidebar'

export default function BulkLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--bg-page)' }}>
      <BulkSidebar />
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg-page)' }}>
        {children}
      </main>
    </div>
  )
}
