'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { Image } from 'lucide-react'

const ITEMS = [
  {
    section: 'Create',
    items: [
      { href: '/studio/image/text-to-image', label: 'Text to Image', desc: 'Generate from prompt' },
      { href: '/studio/image/image-to-image', label: 'Image to Image', desc: 'Transform any image' },
      { href: '/studio/image/inpaint', label: 'Inpaint & Edit', desc: 'Brush to edit regions' },
      { href: '/studio/image/outpaint', label: 'Outpaint', desc: 'Expand image borders' },
      { href: '/studio/image/upscale', label: 'Upscale', desc: '2x, 4x, 8x clarity' },
      { href: '/studio/image/remove-bg', label: 'Remove Background', desc: 'One-click BG removal' },
      { href: '/studio/image/relight', label: 'Relight', desc: 'Adjust lighting & color' },
      { href: '/studio/image/style-transfer', label: 'Style Transfer', desc: 'Apply any art style' },
      { href: '/studio/image/camera-angle', label: 'Cinematic Cameras', desc: 'Camera controls & DoF', badge: 'TOP' },
      { href: '/studio/image/multi-view', label: 'Multi-View', desc: '9 angles from one image', badge: 'NEW' },
      { href: '/studio/image/fashion', label: 'Fashion Generator', desc: 'Outfit on any model' },
      { href: '/studio/image/headshot', label: 'AI Headshot', desc: 'Pro headshots in seconds' },
      { href: '/studio/image/product-placement', label: 'Product Placement', desc: 'Place in any scene' },
      { href: '/studio/image/meme', label: 'Meme Generator', desc: 'Viral memes from prompts' },
      { href: '/studio/image/image-to-3d', label: 'Image to 3D', desc: 'Convert to 3D render', badge: 'NEW' },
    ]
  },
]

export function ImageSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Image Studio" sectionIcon={Image} toolCount={14}>
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
