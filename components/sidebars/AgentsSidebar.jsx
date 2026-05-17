'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { PlusCircle, Bot, LayoutTemplate, ScrollText, Server, Terminal, Key, Bell } from 'lucide-react'

const ITEMS = [
  {
    section: 'My Agents',
    items: [
      { href: '/studio/agents/create', icon: PlusCircle, label: 'Create Agent', desc: 'Build custom AI agent' },
      { href: '/studio/agents/mine', icon: Bot, label: 'My Agents', desc: 'Active and saved agents' },
      { href: '/studio/agents/templates', icon: LayoutTemplate, label: 'Agent Templates', desc: 'Start from template' },
      { href: '/studio/agents/logs', icon: ScrollText, label: 'Agent Logs', desc: 'Run history & errors' },
      { href: '/studio/agents/mcp', icon: Server, label: 'MCP Server', desc: 'Connect Claude, Codex…', badge: 'NEW' },
      { href: '/studio/agents/cli', icon: Terminal, label: 'CLI Tool', desc: 'Terminal-based generation' },
      { href: '/studio/agents/api', icon: Key, label: 'API Access', desc: 'REST API + full docs' },
      { href: '/studio/agents/webhooks', icon: Bell, label: 'Webhooks', desc: 'Trigger from external' },
    ]
  },
]

export function AgentsSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="AI Agents" sectionIcon={Bot} toolCount={8}>
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
