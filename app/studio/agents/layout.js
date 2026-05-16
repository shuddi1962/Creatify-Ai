import { AgentsSidebar } from '@/components/sidebars/AgentsSidebar'

export default function AgentsLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><AgentsSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
