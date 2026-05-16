import { MarketingSidebar } from '@/components/sidebars/MarketingSidebar'

export default function MarketingLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><MarketingSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
