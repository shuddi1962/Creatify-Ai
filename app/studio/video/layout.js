import { VideoSidebar } from '@/components/sidebars/VideoSidebar'

export default function VideoLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><VideoSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
