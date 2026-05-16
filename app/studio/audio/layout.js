import { AudioSidebar } from '@/components/sidebars/AudioSidebar'

export default function AudioLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><AudioSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
