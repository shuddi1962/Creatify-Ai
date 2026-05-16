import { WorkflowsSidebar } from '@/components/sidebars/WorkflowsSidebar'

export default function WorkflowsLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><WorkflowsSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
