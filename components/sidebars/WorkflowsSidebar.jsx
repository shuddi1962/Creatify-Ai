'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { LayoutGrid, GitMerge, Save, LayoutTemplate, Users, Play, Calendar, Share2 } from 'lucide-react'

const ITEMS = [
  {
    section: 'Build',
    items: [
      { href: '/studio/workflows/canvas', icon: LayoutGrid, label: 'Canvas', desc: 'Infinite visual builder', badge: 'NEW' },
      { href: '/studio/workflows/builder', icon: GitMerge, label: 'Node Builder', desc: 'Drag-drop AI pipeline' },
      { href: '/studio/workflows/mine', icon: Save, label: 'My Workflows', desc: 'Saved pipelines' },
      { href: '/studio/workflows/templates', icon: LayoutTemplate, label: 'Templates', desc: 'Pre-built workflows' },
      { href: '/studio/workflows/community', icon: Users, label: 'Community', desc: 'Browse published workflows' },
      { href: '/studio/workflows/playground', icon: Play, label: 'Playground', desc: 'Run interactively' },
      { href: '/studio/workflows/scheduled', icon: Calendar, label: 'Scheduled Runs', desc: 'Auto-run on schedule' },
      { href: '/studio/workflows/share', icon: Share2, label: 'Share Workflow', desc: 'Publish your pipeline' },
    ]
  },
]

export function WorkflowsSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Workflows" sectionIcon={GitMerge} toolCount={8}>
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
