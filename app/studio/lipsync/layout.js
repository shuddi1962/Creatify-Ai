import { LipsyncSidebar } from '@/components/sidebars/LipsyncSidebar'

export default function LipsyncLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><LipsyncSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
