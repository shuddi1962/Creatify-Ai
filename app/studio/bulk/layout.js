import { BulkSidebar } from '@/components/sidebars/BulkSidebar'

export default function BulkLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><BulkSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
