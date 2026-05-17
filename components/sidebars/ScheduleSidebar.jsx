'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { Calendar, Clock, Plus, Share2, Hash, BarChart, Monitor } from 'lucide-react'

const ITEMS = [
  {
    section: 'Plan',
    items: [
      { href: '/studio/schedule/calendar', icon: Calendar, label: 'Calendar View', desc: 'Drag-drop calendar' },
      { href: '/studio/schedule/posts', icon: Clock, label: 'Scheduled Posts', desc: 'Upcoming posts' },
      { href: '/studio/schedule/new', icon: Plus, label: 'New Post', desc: 'Schedule a post' },
      { href: '/studio/schedule/connect', icon: Share2, label: 'Connect Accounts', desc: 'TikTok, IG, YouTube…' },
      { href: '/studio/schedule/captions', icon: Hash, label: 'Caption Generator', desc: 'AI captions & hashtags' },
      { href: '/studio/schedule/analytics', icon: BarChart, label: 'Post Analytics', desc: 'Views, reach, clicks' },
      { href: '/studio/marketing/formatter', icon: Monitor, label: 'Platform Formatter', desc: 'Auto-resize content' },
    ]
  },
]

export function ScheduleSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Schedule & Publish" sectionIcon={Calendar} toolCount={7}>
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
