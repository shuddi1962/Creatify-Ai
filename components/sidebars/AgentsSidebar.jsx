'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'My Agents',
    items: [
      { href: '/studio/agents/create', label: 'Create Agent', desc: 'Build custom AI agent' },
      { href: '/studio/agents/mine', label: 'My Agents', desc: 'Active and saved agents' },
      { href: '/studio/agents/templates', label: 'Agent Templates', desc: 'Start from template' },
      { href: '/studio/agents/logs', label: 'Agent Logs', desc: 'Run history & errors' },
      { href: '/studio/agents/mcp', label: 'MCP Server', desc: 'Connect Claude, Codex\u2026', badge: 'NEW' },
      { href: '/studio/agents/cli', label: 'CLI Tool', desc: 'Terminal-based generation' },
      { href: '/studio/agents/api', label: 'API Access', desc: 'REST API + full docs' },
      { href: '/studio/agents/webhooks', label: 'Webhooks', desc: 'Trigger from external' },
    ]
  },
]

export function AgentsSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="AI Agents" toolCount={8}>
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
