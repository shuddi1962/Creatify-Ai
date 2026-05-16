import { ImageSidebar } from '@/components/sidebars/ImageSidebar'

export default function ImageLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><ImageSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
