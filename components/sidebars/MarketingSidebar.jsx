'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { Smartphone, Link, Zap, Play, Target, Palette, Ruler, ShoppingBag } from 'lucide-react'

const ITEMS = [
  {
    section: 'Create Ads',
    items: [
      { href: '/studio/marketing/ugc', icon: Smartphone, label: 'UGC Ad Generator', desc: 'Scroll-stopping ads', badge: 'TOP' },
      { href: '/studio/marketing/product-url', icon: Link, label: 'Product URL to Ad', desc: 'Paste URL → auto ads', badge: 'NEW' },
      { href: '/studio/marketing/batch', icon: Zap, label: 'Batch Ad Generator', desc: '10 variants at once', badge: 'NEW' },
      { href: '/studio/marketing/stories', icon: Play, label: 'Story Ad Builder', desc: 'Short-form story ads' },
      { href: '/studio/marketing/demo', icon: Target, label: 'Product Demo', desc: 'Showcase in motion' },
      { href: '/studio/marketing/brand-kit', icon: Palette, label: 'Brand Kit', desc: 'Logo, colors, fonts' },
      { href: '/studio/marketing/formatter', icon: Ruler, label: 'Platform Formatter', desc: 'Auto-resize content' },
      { href: '/studio/marketing/hooks', icon: Zap, label: 'Hook Generator', desc: 'Viral opening hooks' },
    ]
  },
]

export function MarketingSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Marketing Studio" sectionIcon={ShoppingBag} toolCount={8}>
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
