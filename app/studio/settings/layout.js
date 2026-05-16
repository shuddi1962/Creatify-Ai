import { SettingsSidebar } from '@/components/sidebars/SettingsSidebar'

export default function SettingsLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><SettingsSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
