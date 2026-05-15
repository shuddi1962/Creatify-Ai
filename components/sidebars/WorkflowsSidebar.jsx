'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Build',
    items: [
      { href: '/studio/workflows/canvas', emoji: '\u221E', label: 'Canvas', desc: 'Infinite visual builder', badge: 'NEW' },
      { href: '/studio/workflows/builder', emoji: '\u26A1', label: 'Node Builder', desc: 'Drag-drop AI pipeline' },
      { href: '/studio/workflows/mine', emoji: '\uD83D\uDCBE', label: 'My Workflows', desc: 'Saved pipelines' },
      { href: '/studio/workflows/templates', emoji: '\uD83D\uDCCB', label: 'Templates', desc: 'Pre-built workflows' },
    ]
  },
  {
    section: 'Run & Share',
    items: [
      { href: '/studio/workflows/community', emoji: '\uD83C\uDF10', label: 'Community', desc: 'Browse published workflows' },
      { href: '/studio/workflows/playground', emoji: '\u25B6\uFE0F', label: 'Playground', desc: 'Run interactively' },
      { href: '/studio/workflows/scheduled', emoji: '\uD83D\uDDD3\uFE0F', label: 'Scheduled Runs', desc: 'Auto-run on schedule' },
      { href: '/studio/workflows/share', emoji: '\uD83D\uDCE4', label: 'Share Workflow', desc: 'Publish your pipeline' },
    ]
  },
]

export function WorkflowsSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Workflows" sectionEmoji="\u26A1" toolCount={8}>
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
