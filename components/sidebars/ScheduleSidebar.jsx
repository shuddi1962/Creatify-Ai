'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Plan',
    items: [
      { href: '/studio/schedule/calendar', label: 'Calendar View', desc: 'Drag-drop calendar' },
      { href: '/studio/schedule/posts', label: 'Scheduled Posts', desc: 'Upcoming posts' },
      { href: '/studio/schedule/new', label: 'New Post', desc: 'Schedule a post' },
      { href: '/studio/schedule/connect', label: 'Connect Accounts', desc: 'TikTok, IG, YouTube\u2026' },
      { href: '/studio/schedule/captions', label: 'Caption Generator', desc: 'AI captions & hashtags' },
      { href: '/studio/schedule/analytics', label: 'Post Analytics', desc: 'Views, reach, clicks' },
      { href: '/studio/marketing/formatter', label: 'Platform Formatter', desc: 'Auto-resize content' },
    ]
  },
]

export function ScheduleSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Schedule & Publish" toolCount={7}>
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
