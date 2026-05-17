'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Characters',
    items: [
      { href: '/studio/characters/create', label: 'Create Character', desc: 'Build a reusable Soul ID' },
      { href: '/studio/characters/mine', label: 'My Characters', desc: 'Your character library' },
      { href: '/studio/characters/swap', label: 'Character Swap', desc: 'Replace in any video' },
      { href: '/studio/characters/multi', label: 'Multi-character', desc: 'Multiple in one scene', badge: 'NEW' },
      { href: '/studio/characters/worlds/create', label: 'Create World', desc: 'Save a scene preset' },
      { href: '/studio/characters/worlds', label: 'My Worlds', desc: 'Your world library' },
      { href: '/studio/characters/lighting', label: 'Lighting Presets', desc: 'Golden hour, studio\u2026' },
      { href: '/studio/characters/templates', label: 'Scene Templates', desc: 'Ready-made locations' },
    ]
  },
]

export function CharactersSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Characters & Worlds" toolCount={8}>
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
