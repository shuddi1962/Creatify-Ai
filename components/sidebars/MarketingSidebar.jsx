'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Create Ads',
    items: [
      { href: '/studio/marketing/ugc', emoji: '\uD83D\uDCF1', label: 'UGC Ad Generator', desc: 'Scroll-stopping ads', badge: 'TOP' },
      { href: '/studio/marketing/product-url', emoji: '\uD83D\uDD17', label: 'Product URL to Ad', desc: 'Paste URL \u2192 auto ads', badge: 'NEW' },
      { href: '/studio/marketing/batch', emoji: '\u26A1', label: 'Batch Ad Generator', desc: '10 variants at once', badge: 'NEW' },
      { href: '/studio/marketing/stories', emoji: '\u25B6\uFE0F', label: 'Story Ad Builder', desc: 'Short-form story ads' },
      { href: '/studio/marketing/demo', emoji: '\uD83C\uDFAF', label: 'Product Demo', desc: 'Showcase in motion' },
    ]
  },
  {
    section: 'Brand & Tools',
    items: [
      { href: '/studio/marketing/brand-kit', emoji: '\uD83C\uDFA8', label: 'Brand Kit', desc: 'Logo, colors, fonts' },
      { href: '/studio/marketing/formatter', emoji: '\uD83D\uDCD0', label: 'Platform Formatter', desc: 'Auto-resize content' },
      { href: '/studio/marketing/hooks', emoji: '\u26A1', label: 'Hook Generator', desc: 'Viral opening hooks' },
    ]
  },
]

export function MarketingSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Marketing Studio" sectionEmoji="\uD83D\uDCE2" toolCount={8}>
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
