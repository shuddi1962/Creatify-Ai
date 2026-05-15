'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Create',
    items: [
      { href: '/studio/cinema/generate', emoji: '\uD83C\uDFAC', label: 'Cinema Studio', desc: 'Full cinematic editor' },
      { href: '/studio/cinema/storyboard', emoji: '\uD83D\uDCCB', label: 'Storyboard Builder', desc: 'Plan your scenes' },
      { href: '/studio/cinema/scene', emoji: '\uD83C\uDFAD', label: 'Scene Composition', desc: 'Director-level control' },
    ]
  },
  {
    section: 'Effects',
    items: [
      { href: '/studio/cinema/vfx', emoji: '\uD83D\uDCA5', label: 'VFX Presets', desc: '200+ visual effects', badge: 'NEW' },
      { href: '/studio/cinema/color-grading', emoji: '\uD83C\uDFA8', label: 'Color Grading', desc: 'Pro color presets' },
      { href: '/studio/cinema/genres', emoji: '\uD83C\uDF9E\uFE0F', label: 'Genre Presets', desc: 'Action, horror, sci-fi\u2026' },
      { href: '/studio/image/camera-angle', emoji: '\uD83D\uDCF8', label: 'Camera Controls', desc: 'Lens, aperture, DoF', badge: 'TOP' },
    ]
  },
]

export function CinemaSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Cinema Studio" sectionEmoji="\uD83C\uDFAC" toolCount={7}>
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
