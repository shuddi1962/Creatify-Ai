'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Characters',
    items: [
      { href: '/studio/characters/create', emoji: '\u2728', label: 'Create Character', desc: 'Build a reusable Soul ID' },
      { href: '/studio/characters/mine', emoji: '\uD83D\uDC65', label: 'My Characters', desc: 'Your character library' },
      { href: '/studio/characters/swap', emoji: '\uD83D\uDD04', label: 'Character Swap', desc: 'Replace in any video' },
      { href: '/studio/characters/multi', emoji: '\uD83C\uDFAD', label: 'Multi-character', desc: 'Multiple in one scene', badge: 'NEW' },
    ]
  },
  {
    section: 'Worlds',
    items: [
      { href: '/studio/characters/worlds/create', emoji: '\uD83C\uDF0D', label: 'Create World', desc: 'Save a scene preset' },
      { href: '/studio/characters/worlds', emoji: '\uD83D\uDDFA\uFE0F', label: 'My Worlds', desc: 'Your world library' },
      { href: '/studio/characters/lighting', emoji: '\uD83D\uDCA1', label: 'Lighting Presets', desc: 'Golden hour, studio\u2026' },
      { href: '/studio/characters/templates', emoji: '\uD83C\uDFD9\uFE0F', label: 'Scene Templates', desc: 'Ready-made locations' },
    ]
  },
]

export function CharactersSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Characters & Worlds" sectionEmoji="\uD83D\uDC64" toolCount={8}>
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
