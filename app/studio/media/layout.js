import { MediaSidebar } from '@/components/sidebars/MediaSidebar'

export default function MediaLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><MediaSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
