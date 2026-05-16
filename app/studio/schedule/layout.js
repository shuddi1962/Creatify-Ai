import { ScheduleSidebar } from '@/components/sidebars/ScheduleSidebar'

export default function ScheduleLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><ScheduleSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
