'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'My Agents',
    items: [
      { href: '/studio/agents/create', emoji: '\u2795', label: 'Create Agent', desc: 'Build custom AI agent' },
      { href: '/studio/agents/mine', emoji: '\uD83E\uDD16', label: 'My Agents', desc: 'Active and saved agents' },
      { href: '/studio/agents/templates', emoji: '\uD83D\uDCCB', label: 'Agent Templates', desc: 'Start from template' },
      { href: '/studio/agents/logs', emoji: '\uD83D\uDCDC', label: 'Agent Logs', desc: 'Run history & errors' },
    ]
  },
  {
    section: 'Integrate',
    items: [
      { href: '/studio/agents/mcp', emoji: '\uD83D\uDD0C', label: 'MCP Server', desc: 'Connect Claude, Codex\u2026', badge: 'NEW' },
      { href: '/studio/agents/cli', emoji: '\uD83D\uDCBB', label: 'CLI Tool', desc: 'Terminal-based generation' },
      { href: '/studio/agents/api', emoji: '\uD83D\uDD11', label: 'API Access', desc: 'REST API + full docs' },
      { href: '/studio/agents/webhooks', emoji: '\uD83D\uDCE1', label: 'Webhooks', desc: 'Trigger from external' },
    ]
  },
]

export function AgentsSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="AI Agents" sectionEmoji="\uD83E\uDD16" toolCount={8}>
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
