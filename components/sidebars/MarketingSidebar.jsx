'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Create Ads',
    items: [
      { href: '/studio/marketing/ugc', label: 'UGC Ad Generator', desc: 'Scroll-stopping ads', badge: 'TOP' },
      { href: '/studio/marketing/product-url', label: 'Product URL to Ad', desc: 'Paste URL \u2192 auto ads', badge: 'NEW' },
      { href: '/studio/marketing/batch', label: 'Batch Ad Generator', desc: '10 variants at once', badge: 'NEW' },
      { href: '/studio/marketing/stories', label: 'Story Ad Builder', desc: 'Short-form story ads' },
      { href: '/studio/marketing/demo', label: 'Product Demo', desc: 'Showcase in motion' },
      { href: '/studio/marketing/brand-kit', label: 'Brand Kit', desc: 'Logo, colors, fonts' },
      { href: '/studio/marketing/formatter', label: 'Platform Formatter', desc: 'Auto-resize content' },
      { href: '/studio/marketing/hooks', label: 'Hook Generator', desc: 'Viral opening hooks' },
    ]
  },
]

export function MarketingSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Marketing Studio" toolCount={8}>
      {ITEMS.map(group => (
        <div key={group.section}>
          <SidebarSectionLabel label={group.section} />
          {group.items.map(item => (
            <SidebarNavItem
              key={item.href + item.label}
              {...item}
              isActive={pathname === item.href || pathname.startsWith(item.href)}
            />
          ))}
        </div>
      ))}
    </SectionSidebar>
  )
}
