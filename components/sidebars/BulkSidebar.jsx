'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { Copy, Image, Video, Mic2, Mic, List, Download, Bell, Cloud } from 'lucide-react'

const ITEMS = [
  {
    section: 'Generate',
    items: [
      { href: '/studio/bulk/image', icon: Image, label: 'Bulk Image', desc: 'CSV \u2192 500 images at once' },
      { href: '/studio/bulk/video', icon: Video, label: 'Bulk Video', desc: 'CSV \u2192 500 videos at once' },
      { href: '/studio/lipsync/bulk', icon: Mic2, label: 'Bulk Lip Sync', desc: '1 character \u00d7 100 audios', badge: 'NEW' },
      { href: '/studio/bulk/voiceover', icon: Mic, label: 'Bulk Voiceover', desc: 'CSV scripts \u2192 batch audio' },
    ]
  },
  {
    section: 'Manage',
    items: [
      { href: '/studio/bulk/queue', icon: List, label: 'Job Queue', desc: 'Live progress tracker' },
      { href: '/studio/bulk/export', icon: Download, label: 'Download ZIP', desc: 'Export all outputs' },
      { href: '/studio/agents/webhooks', icon: Bell, label: 'Webhooks', desc: 'Notify on completion', badge: 'NEW' },
      { href: '/studio/media/drive', icon: Cloud, label: 'Push to Drive', desc: 'Auto-sync to Google Drive' },
    ]
  },
]

export function BulkSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Bulk Generate" sectionEmoji="\uD83D\uDCE6" toolCount={8}>
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
