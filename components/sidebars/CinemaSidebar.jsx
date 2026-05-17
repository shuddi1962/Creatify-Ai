'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Create',
    items: [
      { href: '/studio/cinema/generate', label: 'Cinema Studio', desc: 'Full cinematic editor' },
      { href: '/studio/cinema/storyboard', label: 'Storyboard Builder', desc: 'Plan your scenes' },
      { href: '/studio/cinema/scene', label: 'Scene Composition', desc: 'Director-level control' },
      { href: '/studio/cinema/vfx', label: 'VFX Presets', desc: '200+ visual effects', badge: 'NEW' },
      { href: '/studio/cinema/color-grading', label: 'Color Grading', desc: 'Pro color presets' },
      { href: '/studio/cinema/genres', label: 'Genre Presets', desc: 'Action, horror, sci-fi\u2026' },
      { href: '/studio/image/camera-angle', label: 'Camera Controls', desc: 'Lens, aperture, DoF', badge: 'TOP' },
    ]
  },
]

export function CinemaSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Cinema Studio" toolCount={7}>
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
