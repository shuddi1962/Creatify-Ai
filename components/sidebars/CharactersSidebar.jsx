'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { Sparkles, Users, RefreshCw, Theater, Globe, Map, Lightbulb, Building, UserCircle } from 'lucide-react'

const ITEMS = [
  {
    section: 'Characters',
    items: [
      { href: '/studio/characters/create', icon: Sparkles, label: 'Create Character', desc: 'Build a reusable Soul ID' },
      { href: '/studio/characters/mine', icon: Users, label: 'My Characters', desc: 'Your character library' },
      { href: '/studio/characters/swap', icon: RefreshCw, label: 'Character Swap', desc: 'Replace in any video' },
      { href: '/studio/characters/multi', icon: Theater, label: 'Multi-character', desc: 'Multiple in one scene', badge: 'NEW' },
      { href: '/studio/characters/worlds/create', icon: Globe, label: 'Create World', desc: 'Save a scene preset' },
      { href: '/studio/characters/worlds', icon: Map, label: 'My Worlds', desc: 'Your world library' },
      { href: '/studio/characters/lighting', icon: Lightbulb, label: 'Lighting Presets', desc: 'Golden hour, studio…' },
      { href: '/studio/characters/templates', icon: Building, label: 'Scene Templates', desc: 'Ready-made locations' },
    ]
  },
]

export function CharactersSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Characters & Worlds" sectionIcon={UserCircle} toolCount={8}>
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
