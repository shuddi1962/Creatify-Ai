import IdeasSidebar from '@/components/ideas/IdeasSidebar'

export default function IdeasLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><IdeasSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
