'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Generate',
    items: [
      { href: '/studio/video/text-to-video', emoji: '\u2728', label: 'Text to Video', desc: 'Generate from prompt' },
      { href: '/studio/video/image-to-video', emoji: '\uD83D\uDDBC\uFE0F', label: 'Image to Video', desc: 'Animate any image' },
      { href: '/studio/video/smart-shot', emoji: '\uD83C\uDFAC', label: 'Smart Shot', desc: 'Prompt \u2192 cinematic video', badge: 'NEW' },
      { href: '/studio/video/motion-sync', emoji: '\uD83C\uDFAF', label: 'Motion Sync', desc: 'Sync from reference' },
    ]
  },
  {
    section: 'Edit',
    items: [
      { href: '/studio/video/edit', emoji: '\u270F\uFE0F', label: 'Edit Video', desc: 'Inpaint video regions' },
      { href: '/studio/video/extend', emoji: '\u23ED\uFE0F', label: 'Extend Video', desc: 'Add more seconds' },
      { href: '/studio/video/restyle', emoji: '\uD83C\uDFA8', label: 'Restyle Video', desc: 'Apply new visual style' },
      { href: '/studio/video/replace-character', emoji: '\uD83D\uDD04', label: 'Replace Character', desc: 'Swap in any clip', badge: 'NEW' },
    ]
  },
  {
    section: 'Enhance',
    items: [
      { href: '/studio/video/upscale', emoji: '\u2B06\uFE0F', label: 'Video Upscale', desc: 'Enhance to HD/4K' },
      { href: '/studio/video/sound-effects', emoji: '\uD83D\uDD0A', label: 'Add Sound Effects', desc: 'AI audio on video' },
      { href: '/studio/video/mixed-media', emoji: '\uD83C\uDFAD', label: 'Mixed Media', desc: 'Blend real + AI footage' },
      { href: '/studio/video/camera-motion', emoji: '\uD83D\uDCF7', label: 'Camera Motion', desc: 'Zoom, pan, orbit presets' },
    ]
  },
]

export function VideoSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Video Studio" sectionEmoji="\uD83C\uDFAC" toolCount={12}>
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
