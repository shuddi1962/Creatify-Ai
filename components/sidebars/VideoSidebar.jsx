'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Generate',
    items: [
      { href: '/studio/video/text-to-video', label: 'Text to Video', desc: 'Generate from prompt' },
      { href: '/studio/video/image-to-video', label: 'Image to Video', desc: 'Animate any image' },
      { href: '/studio/video/smart-shot', label: 'Smart Shot', desc: 'Prompt \u2192 cinematic video', badge: 'NEW' },
      { href: '/studio/video/motion-sync', label: 'Motion Sync', desc: 'Sync from reference' },
      { href: '/studio/video/edit', label: 'Edit Video', desc: 'Inpaint video regions' },
      { href: '/studio/video/extend', label: 'Extend Video', desc: 'Add more seconds' },
      { href: '/studio/video/restyle', label: 'Restyle Video', desc: 'Apply new visual style' },
      { href: '/studio/video/replace-character', label: 'Replace Character', desc: 'Swap in any clip', badge: 'NEW' },
      { href: '/studio/video/upscale', label: 'Video Upscale', desc: 'Enhance to HD/4K' },
      { href: '/studio/video/sound-effects', label: 'Add Sound Effects', desc: 'AI audio on video' },
      { href: '/studio/video/mixed-media', label: 'Mixed Media', desc: 'Blend real + AI footage' },
      { href: '/studio/video/camera-motion', label: 'Camera Motion', desc: 'Zoom, pan, orbit presets' },
    ]
  },
]

export function VideoSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Video Studio" toolCount={12}>
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
