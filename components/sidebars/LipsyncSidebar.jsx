'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Animate',
    items: [
      { href: '/studio/lipsync/portrait', emoji: '\uD83D\uDC64', label: 'Portrait + Audio', desc: 'Animate portrait photo' },
      { href: '/studio/lipsync/video', emoji: '\uD83C\uDFAC', label: 'Video + Audio', desc: 'Sync lips on video' },
      { href: '/studio/lipsync/bulk', emoji: '\uD83D\uDCE6', label: 'Bulk Lip Sync', desc: '1 char \u00d7 100 audios', badge: 'NEW' },
      { href: '/studio/lipsync/avatar', emoji: '\uD83E\uDD16', label: 'Talking Avatar', desc: 'Persistent AI avatar' },
      { href: '/studio/lipsync/dubbing', emoji: '\uD83C\uDF10', label: 'Multi-language Dub', desc: 'Dub in any language', badge: 'NEW' },
    ]
  },
]

export function LipsyncSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Lip Sync" sectionEmoji="\uD83D\uDC44" toolCount={5}>
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
