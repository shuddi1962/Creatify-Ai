'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Create',
    items: [
      { href: '/studio/image/text-to-image', emoji: '\u2728', label: 'Text to Image', desc: 'Generate from prompt' },
      { href: '/studio/image/image-to-image', emoji: '\uD83D\uDD04', label: 'Image to Image', desc: 'Transform any image' },
      { href: '/studio/image/inpaint', emoji: '\uD83D\uDD8C\uFE0F', label: 'Inpaint & Edit', desc: 'Brush to edit regions' },
      { href: '/studio/image/outpaint', emoji: '\u2194\uFE0F', label: 'Outpaint', desc: 'Expand image borders' },
    ]
  },
  {
    section: 'Enhance',
    items: [
      { href: '/studio/image/upscale', emoji: '\u2B06\uFE0F', label: 'Upscale', desc: '2x, 4x, 8x clarity' },
      { href: '/studio/image/remove-bg', emoji: '\u2702\uFE0F', label: 'Remove Background', desc: 'One-click BG removal' },
      { href: '/studio/image/relight', emoji: '\uD83D\uDCA1', label: 'Relight', desc: 'Adjust lighting & color' },
      { href: '/studio/image/style-transfer', emoji: '\uD83C\uDFA8', label: 'Style Transfer', desc: 'Apply any art style' },
    ]
  },
  {
    section: 'Specialized',
    items: [
      { href: '/studio/image/camera-angle', emoji: '\uD83D\uDCF8', label: 'Cinematic Cameras', desc: 'Camera controls & DoF', badge: 'TOP' },
      { href: '/studio/image/multi-view', emoji: '\u229E', label: 'Multi-View', desc: '9 angles from one image', badge: 'NEW' },
      { href: '/studio/image/fashion', emoji: '\uD83D\uDC57', label: 'Fashion Generator', desc: 'Outfit on any model' },
      { href: '/studio/image/headshot', emoji: '\uD83E\uDD35', label: 'AI Headshot', desc: 'Pro headshots in seconds' },
      { href: '/studio/image/product-placement', emoji: '\uD83D\uDCE6', label: 'Product Placement', desc: 'Place in any scene' },
      { href: '/studio/image/meme', emoji: '\uD83D\uDE02', label: 'Meme Generator', desc: 'Viral memes from prompts' },
      { href: '/studio/image/image-to-3d', emoji: '\uD83E\uDDCA', label: 'Image to 3D', desc: 'Convert to 3D render', badge: 'NEW' },
    ]
  },
]

export function ImageSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Image Studio" sectionEmoji="\uD83D\uDDBC\uFE0F" toolCount={14}>
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
