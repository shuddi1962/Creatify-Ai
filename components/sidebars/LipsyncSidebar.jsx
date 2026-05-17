'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { User, Film, Copy, Bot, Globe, Mic } from 'lucide-react'

const ITEMS = [
  {
    section: 'Animate',
    items: [
      { href: '/studio/lipsync/portrait', icon: User, label: 'Portrait + Audio', desc: 'Animate portrait photo' },
      { href: '/studio/lipsync/video', icon: Film, label: 'Video + Audio', desc: 'Sync lips on video' },
      { href: '/studio/lipsync/bulk', icon: Copy, label: 'Bulk Lip Sync', desc: '1 char × 100 audios', badge: 'NEW' },
      { href: '/studio/lipsync/avatar', icon: Bot, label: 'Talking Avatar', desc: 'Persistent AI avatar' },
      { href: '/studio/lipsync/dubbing', icon: Globe, label: 'Multi-language Dub', desc: 'Dub in any language', badge: 'NEW' },
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
