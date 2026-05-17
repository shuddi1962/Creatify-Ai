'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Build',
    items: [
      { href: '/studio/workflows/canvas', label: 'Canvas', desc: 'Infinite visual builder', badge: 'NEW' },
      { href: '/studio/workflows/builder', label: 'Node Builder', desc: 'Drag-drop AI pipeline' },
      { href: '/studio/workflows/mine', label: 'My Workflows', desc: 'Saved pipelines' },
      { href: '/studio/workflows/templates', label: 'Templates', desc: 'Pre-built workflows' },
      { href: '/studio/workflows/community', label: 'Community', desc: 'Browse published workflows' },
      { href: '/studio/workflows/playground', label: 'Playground', desc: 'Run interactively' },
      { href: '/studio/workflows/scheduled', label: 'Scheduled Runs', desc: 'Auto-run on schedule' },
      { href: '/studio/workflows/share', label: 'Share Workflow', desc: 'Publish your pipeline' },
    ]
  },
]

export function WorkflowsSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Workflows" toolCount={8}>
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
