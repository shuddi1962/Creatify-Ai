'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Plan',
    items: [
      { href: '/studio/schedule/calendar', emoji: '\uD83D\uDCC5', label: 'Calendar View', desc: 'Drag-drop calendar' },
      { href: '/studio/schedule/posts', emoji: '\uD83D\uDD50', label: 'Scheduled Posts', desc: 'Upcoming posts' },
      { href: '/studio/schedule/new', emoji: '\u2795', label: 'New Post', desc: 'Schedule a post' },
    ]
  },
  {
    section: 'Connect & Analyze',
    items: [
      { href: '/studio/schedule/connect', emoji: '\uD83D\uDD17', label: 'Connect Accounts', desc: 'TikTok, IG, YouTube\u2026' },
      { href: '/studio/schedule/captions', emoji: '#\uFE0F\u20E3', label: 'Caption Generator', desc: 'AI captions & hashtags' },
      { href: '/studio/schedule/analytics', emoji: '\uD83D\uDCCA', label: 'Post Analytics', desc: 'Views, reach, clicks' },
      { href: '/studio/marketing/formatter', emoji: '\uD83D\uDCD0', label: 'Platform Formatter', desc: 'Auto-resize content' },
    ]
  },
]

export function ScheduleSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Schedule & Publish" sectionEmoji="\uD83D\uDCC5" toolCount={7}>
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
