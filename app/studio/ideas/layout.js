import IdeasSidebar from '@/components/ideas/IdeasSidebar'

export default function IdeasLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <IdeasSidebar />
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-page)' }}>
        {children}
      </div>
    </div>
  )
}
