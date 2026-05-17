'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { Sparkles, RefreshCw, Paintbrush, MoveHorizontal, ArrowUpCircle, Scissors, Lightbulb, Palette, Camera, LayoutGrid, Shirt, User, Package, Smile, Box, Image } from 'lucide-react'

const ITEMS = [
  {
    section: 'Create',
    items: [
      { href: '/studio/image/text-to-image', icon: Sparkles, label: 'Text to Image', desc: 'Generate from prompt' },
      { href: '/studio/image/image-to-image', icon: RefreshCw, label: 'Image to Image', desc: 'Transform any image' },
      { href: '/studio/image/inpaint', icon: Paintbrush, label: 'Inpaint & Edit', desc: 'Brush to edit regions' },
      { href: '/studio/image/outpaint', icon: MoveHorizontal, label: 'Outpaint', desc: 'Expand image borders' },
      { href: '/studio/image/upscale', icon: ArrowUpCircle, label: 'Upscale', desc: '2x, 4x, 8x clarity' },
      { href: '/studio/image/remove-bg', icon: Scissors, label: 'Remove Background', desc: 'One-click BG removal' },
      { href: '/studio/image/relight', icon: Lightbulb, label: 'Relight', desc: 'Adjust lighting & color' },
      { href: '/studio/image/style-transfer', icon: Palette, label: 'Style Transfer', desc: 'Apply any art style' },
      { href: '/studio/image/camera-angle', icon: Camera, label: 'Cinematic Cameras', desc: 'Camera controls & DoF', badge: 'TOP' },
      { href: '/studio/image/multi-view', icon: LayoutGrid, label: 'Multi-View', desc: '9 angles from one image', badge: 'NEW' },
      { href: '/studio/image/fashion', icon: Shirt, label: 'Fashion Generator', desc: 'Outfit on any model' },
      { href: '/studio/image/headshot', icon: User, label: 'AI Headshot', desc: 'Pro headshots in seconds' },
      { href: '/studio/image/product-placement', icon: Package, label: 'Product Placement', desc: 'Place in any scene' },
      { href: '/studio/image/meme', icon: Smile, label: 'Meme Generator', desc: 'Viral memes from prompts' },
      { href: '/studio/image/image-to-3d', icon: Box, label: 'Image to 3D', desc: 'Convert to 3D render', badge: 'NEW' },
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
