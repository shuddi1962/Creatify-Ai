'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { Video, Image, Clapperboard, Activity, Pencil, SkipForward, Palette, UserX, ArrowUpCircle, Volume2, Layers, Camera } from 'lucide-react'

const ITEMS = [
  {
    section: 'Generate',
    items: [
      { href: '/studio/video/text-to-video', icon: Video, label: 'Text to Video', desc: 'Generate from prompt' },
      { href: '/studio/video/image-to-video', icon: Image, label: 'Image to Video', desc: 'Animate any image' },
      { href: '/studio/video/smart-shot', icon: Clapperboard, label: 'Smart Shot', desc: 'Prompt → cinematic video', badge: 'NEW' },
      { href: '/studio/video/motion-sync', icon: Activity, label: 'Motion Sync', desc: 'Sync from reference' },
      { href: '/studio/video/edit', icon: Pencil, label: 'Edit Video', desc: 'Inpaint video regions' },
      { href: '/studio/video/extend', icon: SkipForward, label: 'Extend Video', desc: 'Add more seconds' },
      { href: '/studio/video/restyle', icon: Palette, label: 'Restyle Video', desc: 'Apply new visual style' },
      { href: '/studio/video/replace-character', icon: UserX, label: 'Replace Character', desc: 'Swap in any clip', badge: 'NEW' },
      { href: '/studio/video/upscale', icon: ArrowUpCircle, label: 'Video Upscale', desc: 'Enhance to HD/4K' },
      { href: '/studio/video/sound-effects', icon: Volume2, label: 'Add Sound Effects', desc: 'AI audio on video' },
      { href: '/studio/video/mixed-media', icon: Layers, label: 'Mixed Media', desc: 'Blend real + AI footage' },
      { href: '/studio/video/camera-motion', icon: Camera, label: 'Camera Motion', desc: 'Zoom, pan, orbit presets' },
    ]
  },
]

export function VideoSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Video Studio" sectionIcon={Video} toolCount={12}>
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
