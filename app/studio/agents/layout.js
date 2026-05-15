import { AgentsSidebar } from '@/components/sidebars/AgentsSidebar'

export default function AgentsLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--bg-page)' }}>
      <AgentsSidebar />
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg-page)' }}>
        {children}
      </main>
    </div>
  )
}
