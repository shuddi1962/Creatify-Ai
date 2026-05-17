'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { Mic } from 'lucide-react'

const ITEMS = [
  {
    section: 'Animate',
    items: [
      { href: '/studio/lipsync/portrait', label: 'Portrait + Audio', desc: 'Animate portrait photo' },
      { href: '/studio/lipsync/video', label: 'Video + Audio', desc: 'Sync lips on video' },
      { href: '/studio/lipsync/bulk', label: 'Bulk Lip Sync', desc: '1 char \u00d7 100 audios', badge: 'NEW' },
      { href: '/studio/lipsync/avatar', label: 'Talking Avatar', desc: 'Persistent AI avatar' },
      { href: '/studio/lipsync/dubbing', label: 'Multi-language Dub', desc: 'Dub in any language', badge: 'NEW' },
    ]
  },
]

export function LipsyncSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Lip Sync" sectionIcon={Mic} toolCount={5}>
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
