import { CinemaSidebar } from '@/components/sidebars/CinemaSidebar'

export default function CinemaLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><CinemaSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
